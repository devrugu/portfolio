import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image"; // This fixes the 'Image' component error

// The interface definition that was accidentally deleted
interface Post {
  title: string;
  mainImage: { asset: { _ref: string; _type: string; }; };
  author: { name: string; image: { asset: { _ref: string; _type: string; }; }; };
  body: any[];
  publishedAt: string;
}

export const revalidate = 0;

// The full component function with the logic and JSX
export default async function PostPage({ params }: { params: { slug: string } }) {
  // Define the query right here
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    mainImage,
    author->{ name, image },
    body,
    publishedAt
  }`;

  // THE WORKAROUND:
  // 1. Manually extract the slug from params into a variable.
  const slug = params.slug;

  // 2. Pass a NEW object to client.fetch containing only the slug.
  const post = await client.fetch<Post>(query, { slug });

  if (!post) {
    return <div>Post not found</div>;
  }

  // The JSX with the imported components
  return (
    <article>
      <div className="flex items-center space-x-4 mb-8">
        {post.author?.image && (
          <Image
            src={urlFor(post.author.image).width(50).height(50).url()}
            alt={post.author.name}
            width={50}
            height={50}
            className="rounded-full bg-gray-700"
          />
        )}
        <div>
          <p className="font-semibold text-primary">{post.author?.name || 'Anonymous'}</p>
          <p className="text-gray-400 text-sm">
            Published on {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">{post.title}</h1>
      {post.mainImage && (
        <Image
          src={urlFor(post.mainImage).width(900).height(600).url()}
          alt={post.title}
          width={900}
          height={600}
          className="w-full h-auto object-cover rounded-lg mb-8 border border-gray-700/50"
        />
      )}
      <div className="prose prose-invert prose-lg max-w-none prose-h2:text-accent prose-a:text-accent">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}