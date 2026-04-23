import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import Link from "next/link";
import Image from "next/image";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: { asset: { _ref: string; _type: string } };
  publishedAt: string;
  excerpt: string;
  categories: { title: string; slug: { current: string } }[];
  body: any[];
}

export const revalidate = 0;

// Count words in Sanity block content
function countWords(body: any[]): number {
  if (!body) return 0;
  return body.reduce((count, block) => {
    if (block._type === "block" && block.children) {
      return count + block.children
        .filter((c: any) => c._type === "span")
        .reduce((acc: number, c: any) => acc + (c.text?.split(/\s+/).length || 0), 0);
    }
    return count;
  }, 0);
}

function readingTime(body: any[]): string {
  const words = countWords(body);
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    "excerpt": array::join(string::split(pt::text(body), "")[0..200], "") + "...",
    categories[]->{ title, slug },
    body
  }`;
  return client.fetch<Post[]>(query);
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-2">Blog</h1>
      <p className="text-on-background mb-10">Thoughts on software engineering, signal processing, and things I'm learning.</p>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No posts yet — check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="flex flex-col bg-gray-800/20 rounded-xl border border-gray-700/50 hover:border-accent/50 hover:bg-gray-800/40 transition-all overflow-hidden group"
            >
              {post.mainImage && (
                <Image
                  src={urlFor(post.mainImage).width(500).height(280).url()}
                  alt={post.title}
                  width={500}
                  height={280}
                  className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                />
              )}
              <div className="p-6 flex flex-col flex-grow">
                {/* Categories */}
                {post.categories?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.map((cat) => (
                      <span
                        key={cat.title}
                        className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/20"
                      >
                        {cat.title}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="text-xl font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-on-background text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto">
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span>{readingTime(post.body)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}