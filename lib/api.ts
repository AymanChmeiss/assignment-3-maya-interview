import type { Employee, Post } from "./types";

const BASE_URL = "https://jsonplaceholder.typicode.com";
export const POSTS_URL = `${BASE_URL}/posts?userId=1`;

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Shared by the server preview, the client explorer, and the demo
// scenarios: every Response goes through this same check.
export async function parsePostsResponse(res: Response): Promise<Post[]> {
  // fetch resolves on 404/503, so check ok ourselves.
  if (!res.ok) {
    throw new ApiError(`Posts request failed (${res.status}).`, res.status);
  }
  return (await res.json()) as Post[];
}

export async function getEmployee(): Promise<Employee> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/users/1`);
  } catch {
    throw new ApiError("Network error while loading the profile.");
  }

  if (!res.ok) {
    throw new ApiError(`Profile request failed (${res.status}).`, res.status);
  }

  return (await res.json()) as Employee;
}

export async function getPosts(): Promise<Post[]> {
  let res: Response;
  try {
    res = await fetch(POSTS_URL);
  } catch {
    throw new ApiError("Network error while loading posts.");
  }
  return parsePostsResponse(res);
}