"use client";

import { useState } from "react";
import type { Post } from "@/lib/types";

// Five explicit states. Suspense does not watch fetches started in a
// click handler, so loading/data/error are tracked manually.
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; posts: Post[] }
  | { status: "empty" }
  | { status: "error"; message: string };

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts?userId=1";

export default function ExplorePosts() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function loadPosts() {
    if (state.status === "loading") return; // guard against duplicate clicks
    setState({ status: "loading" });

    try {
      const res = await fetch(POSTS_URL);
      // fetch does NOT throw on 404/503, so inspect the response.
      if (!res.ok) {
        throw new Error(`Request failed (${res.status}).`);
      }
      const posts = (await res.json()) as Post[];
      setState(
        posts.length === 0 ? { status: "empty" } : { status: "success", posts }
      );
    } catch {
      setState({
        status: "error",
        message: "We couldn't load the posts. Please try again.",
      });
    }
  }

  const isLoading = state.status === "loading";

  return (
    <div>
      {state.status === "idle" && (
        <p className="mb-2 text-gray-600">
          Click the button to load all posts from the browser.
        </p>
      )}

      <button
        onClick={loadPosts}
        disabled={isLoading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isLoading ? "Loading..." : state.status === "error" ? "Try again" : "Load posts"}
      </button>

      {isLoading && (
        <p className="mt-3 text-gray-600" role="status">
          Loading posts...
        </p>
      )}

      {state.status === "error" && (
        <p className="mt-3 text-red-700" role="alert">
          {state.message}
        </p>
      )}

      {state.status === "empty" && <p className="mt-3">No posts found</p>}

      {state.status === "success" && (
        <ul className="mt-4 space-y-3">
          {state.posts.map((post) => (
            <li key={post.id} className="rounded border p-3">
              <h3 className="font-medium">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}