import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image"; // Import the image helper
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image

// Update the type to include the mainImage
interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  publishedAt: string;
}

export const revalidate = 0;

// Update the query to also fetch the mainImage
async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage, // Request the main image
    publishedAt
  }`;
  const posts = await client.fetch<Post[]>(query);
  return posts;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8">My Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug.current}`}
            className="flex flex-col bg-gray-800/20 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-all overflow-hidden"
          >
            {post.mainImage && (
              <Image
                src={urlFor(post.mainImage).width(500).height(300).url()}
                alt={post.title}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6 flex-grow">
              <h2 className="text-2xl font-semibold text-accent">{post.title}</h2>
              <p className="text-gray-400 mt-2">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}