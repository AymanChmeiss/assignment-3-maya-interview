# Interview Notes

## Mission 1: Initial Predictions (before implementation)

1. **Where each request runs:**
   - Profile (`/users/1`): server, in a Server Component.
   - Recent posts (`/posts?userId=1`): server, in an async Server Component inside Suspense.
   - Explore all posts: browser, in a Client Component after a click.

2. **What stays visible while the preview loads:** The page title, the employee profile, and the Explore section. Only the recent posts area shows the Suspense fallback.

3. **Does Suspense around a click-handler fetch show its fallback?** No. Suspense only reacts to components that suspend during render. A fetch in an event handler doesn't suspend, so I need manual loading/error state.

4. **Does fetch throw on HTTP 503?** No. fetch only rejects on network failure. A 503 returns a normal Response with `res.ok === false`, so I must check `res.ok` and throw myself.

# Testing Notes

## Mission 2: Employee profile
- Success: profile shows name, email, and company from `/users/1`.
- Failure: changed the URL to `/users/99999`. The API returned 404, `res.ok` was false, `ApiError` was thrown and caught in `EmployeeProfile`. A friendly profile-specific message appeared and the page title still rendered.

## Mission 3: Recent posts with Suspense
- Next.js version: 16.4.3.
- Direct reload: title, intro, and profile appear immediately; the posts area shows its fallback for ~2s, then three titles.
- The 2s delay is an intentional learning simulation, placed after `await connection()` so it runs per request instead of at prerender time.
- `loading.tsx` applies to a whole route segment, so it can't isolate one section; a manual Suspense boundary replaces only that subtree.

## Mission 4: Client-side fetch after a click
- Idle: no request to jsonplaceholder on page load (Network panel empty after filtering).
- Loading: button disabled and "Loading posts..." shown; duplicate clicks ignored.
- Success: titles and bodies render after the click. Request visible in Network with Initiator `ExplorePosts.tsx:25` (status 304 from browser cache, treated as success).
- Empty: used `userId=9999`, API returned `[]`, "No posts found" appeared.
- Error: used a wrong path (`/postsxx`, 404). Friendly message appeared, button became "Try again", and the profile and recent posts stayed visible.
- Suspense does not wrap this fetch: it runs in an event handler outside render, so loading/error are tracked with state.