import { client } from "@/sanity/client";
import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  publishedAt: string;
}

export const revalidate = 0; // Ensures the post list is always fresh

async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    publishedAt
  }`;
  const posts = await client.fetch<Post[]>(query);
  return posts;
}

export default async function BlogManagementPage() {
  const posts = await getPosts();

  const newPostUrl = `/studio/intent/create/type=post`;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-primary">Blog Management</h1>
        <Link
          href={newPostUrl}
          target="_blank" // Opens the studio in a new tab for a better workflow
          className="inline-block bg-accent text-on-primary font-bold py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors"
        >
          + Create New Post
        </Link>
      </div>

      <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg">
        <table className="w-full text-left">
          <thead className="border-b border-gray-700/50">
            <tr>
              <th className="p-4 text-primary font-semibold">Title</th>
              <th className="p-4 text-primary font-semibold">Published Date</th>
              <th className="p-4 text-primary font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const editUrl = `/studio/desk/post;${post._id}`;
              return (
                <tr key={post._id} className="border-b border-gray-800/50 last:border-b-0">
                  <td className="p-4 text-on-background">{post.title}</td>
                  <td className="p-4 text-gray-400">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="p-4">
                    <Link
                      href={editUrl}
                      target="_blank"
                      className="text-accent hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}