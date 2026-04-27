import { client } from "@/sanity/client";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { urlFor } from "@/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

interface Post {
  title: string;
  mainImage: { asset: { _ref: string; _type: string } };
  author: { name: string; image: { asset: { _ref: string; _type: string } } };
  body: any[];
  publishedAt: string;
  categories: { title: string; slug: { current: string } }[];
}

export const revalidate = 0;

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
  const minutes = Math.max(1, Math.round(countWords(body) / 200));
  return `${minutes} min read`;
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    mainImage,
    author->{ name, image },
    body,
    publishedAt,
    categories[]->{ title, slug }
  }`;

  const slug = params.slug;
  const post = await client.fetch<Post>(query, { slug });

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article className="max-w-3xl mx-auto">
      <ReadingProgressBar />

      {/* Back link */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-accent hover:underline text-sm mb-8">
        ← Back to Blog
      </Link>

      {/* Categories */}
      {post.categories?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
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

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Author + meta */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-700/50">
        {post.author?.image && (
          <Image
            src={urlFor(post.author.image).width(44).height(44).url()}
            alt={post.author.name}
            width={44}
            height={44}
            className="rounded-full border-2 border-gray-700"
          />
        )}
        <div>
          <p className="font-semibold text-primary text-sm">{post.author?.name || "Anonymous"}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{readingTime(post.body)}</span>
          </div>
        </div>
      </div>

      {/* Cover image */}
      {post.mainImage && (
        <Image
          src={urlFor(post.mainImage).width(900).height(500).url()}
          alt={post.title}
          width={900}
          height={500}
          className="w-full h-auto object-cover rounded-xl mb-10 border border-gray-700/50"
        />
      )}

      {/* Body */}
      <div className="prose prose-invert prose-lg max-w-none
        prose-h2:text-accent prose-h3:text-primary
        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
        prose-code:text-accent prose-code:bg-gray-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700/50
        prose-blockquote:border-accent prose-blockquote:text-gray-400
        prose-img:rounded-xl prose-img:border prose-img:border-gray-700/50">
        <PortableText value={post.body} />
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gray-700/50">
        <Link href="/blog" className="inline-flex items-center gap-2 text-accent hover:underline text-sm">
          ← Back to Blog
        </Link>
      </div>
    </article>
  );
}