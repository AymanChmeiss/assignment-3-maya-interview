import { connection } from "next/server";
import { getPosts } from "@/lib/api";
import type { Post } from "@/lib/types";

// INTENTIONAL LEARNING SIMULATION:
// A 2-second artificial delay so the Suspense fallback is visible.
// It must not be used in a real production app.
const ARTIFICIAL_DELAY_MS = 2000;

export default async function RecentPosts() {
  // Opt in to request-time rendering so the delay runs on every
  // request instead of once during prerendering.
  await connection();

  // Intentional learning simulation (see comment above).
  await new Promise((resolve) => setTimeout(resolve, ARTIFICIAL_DELAY_MS));

  let posts: Post[];
  try {
    posts = await getPosts();
  } catch {
    return (
      <p className="text-red-700">
        We couldn&apos;t load recent posts right now.
      </p>
    );
  }

  const recent = posts.slice(0, 3);
  if (recent.length === 0) return <p>No posts yet.</p>;

  return (
    <ul className="list-disc space-y-1 pl-5">
      {recent.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}