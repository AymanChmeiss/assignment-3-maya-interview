"use client";

import { useState } from "react";
import { ApiError, POSTS_URL, parsePostsResponse } from "@/lib/api";
import type { Post } from "@/lib/types";

type Scenario = "success" | "slow" | "http-error" | "empty";

const SCENARIOS: { value: Scenario; label: string }[] = [
  { value: "success", label: "Success (real API)" },
  { value: "slow", label: "Slow (2s wait, then real API)" },
  { value: "http-error", label: "HTTP error (simulated 503)" },
  { value: "empty", label: "Empty (simulated empty array)" },
];

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; posts: Post[] }
  | { status: "empty" }
  | { status: "error"; message: string };

// Returns a Response for the chosen scenario. Success and Slow hit the
// real JSONPlaceholder API. The other two are LOCAL simulations built with
// new Response(...) so they flow through the same response-checking code.
async function getResponse(scenario: Scenario): Promise<Response> {
  switch (scenario) {
    case "slow":
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return fetch(POSTS_URL);
    case "http-error":
      return new Response(null, { status: 503, statusText: "Service Unavailable" });
    case "empty":
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    default:
      return fetch(POSTS_URL);
  }
}

export default function ExplorePosts() {
  const [state, setState] = useState<State>({ status: "idle" });
  const [scenario, setScenario] = useState<Scenario>("success");

  async function loadPosts() {
    if (state.status === "loading") return; // block duplicate clicks
    setState({ status: "loading" });

    try {
      const res = await getResponse(scenario);
      const posts = await parsePostsResponse(res);
      // Empty is a successful response, kept separate from errors.
      setState(
        posts.length === 0 ? { status: "empty" } : { status: "success", posts }
      );
    } catch (err) {
      if (err instanceof ApiError) {
        // Our own error: the server answered with a non-ok status.
        setState({
          status: "error",
          message: `The posts service is unavailable right now (HTTP ${err.status}). Please try again.`,
        });
      } else {
        // Network failure (fetch rejected) or anything unexpected.
        setState({
          status: "error",
          message:
            "We couldn't reach the server. Check your connection and try again.",
        });
      }
    }
    // No finally needed: every path above leaves "loading" by setting
    // success, empty, or error.
  }

  const isLoading = state.status === "loading";

  return (
    <div>
      <div className="mb-3 rounded border border-dashed p-3 text-sm">
        <label htmlFor="scenario" className="font-medium">
          Demo scenario
        </label>
        <select
          id="scenario"
          value={scenario}
          onChange={(e) => setScenario(e.target.value as Scenario)}
          disabled={isLoading}
          className="ml-2 rounded border px-2 py-1"
        >
          {SCENARIOS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Testing control: HTTP error and Empty are simulated locally in the
          browser, not returned by JSONPlaceholder. Applies to the next Load
          or Retry only.
        </p>
      </div>

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
        {isLoading
          ? "Loading..."
          : state.status === "error"
          ? "Try again"
          : "Load posts"}
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