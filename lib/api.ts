import type { Employee, Post } from "./types";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
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
    res = await fetch(`${BASE_URL}/posts?userId=1`);
  } catch {
    throw new ApiError("Network error while loading posts.");
  }

  if (!res.ok) {
    throw new ApiError(`Posts request failed (${res.status}).`, res.status);
  }

  return (await res.json()) as Post[];
}