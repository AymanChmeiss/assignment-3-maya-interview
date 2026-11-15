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


## Mission 5: Understandable failures
- `ApiError` (message + status) is thrown by `parsePostsResponse` when `response.ok` is false, and caught in the client with `instanceof ApiError`; other failures (e.g. Offline) show a separate network message.
- HTTP error and Empty are local simulations built with `new Response(...)` and passed through the same response-checking code.
- Recovery: HTTP error, then Load, then switch to Success and Try again, and posts appear.


## Evidence for Maya
Next.js version: 16.4.3. Tested in Chrome on localhost (`npm run dev`).

| Check | Expected | Actual | Result |
|---|---|---|---|
| Server profile | Name, email, company from employee 1 | Leanne Graham, Sincere@april.biz, Romaguera-Crona | Pass |
| Server preview | Fallback during the delay; page shell visible | With Slow 4G and F5, sections appeared progressively; no part of the page was blank; only Recent posts waited | Pass |
| Client idle | No posts request before first click | Network filter `jsonplaceholder` showed 0 requests after load | Pass |
| Client slow | Loading feedback; repeat clicks don't duplicate | Button disabled with "Loading..."; many clicks produced 1 request | Pass |
| Client success | Titles and bodies appear | Post cards with titles and bodies rendered | Pass |
| HTTP failure | Shared check creates and handles ApiError; retry available | Message with HTTP 503 and "Try again" button | Pass |
| Empty response | Empty-state message, no error | "No posts found", no error message | Pass |
| Recovery | Switch to Success and retry shows posts, clears error | Posts appeared, error message disappeared | Pass |
| Section independence | Client failure keeps profile and preview | Profile and recent posts stayed visible during the error | Pass |
| Usability | Labels, visible focus, readable at 360px | Tab focus visible; clicking the label focuses the select; readable at 360px with no horizontal scroll | Pass |
| Offline network failure | Non-ApiError message | "We couldn't reach the server. Check your connection and try again." and the "Try again" button appeared; no HTTP status shown | Pass |

### Steps used
- Server preview: DevTools Network set to Slow 4G, then F5, watching the sections appear.
- Client slow: scenario Slow, one click on Load posts, then repeated clicks during the wait; counted requests in the Network panel (filter `jsonplaceholder`).
- HTTP error and Empty are local simulations built with `new Response(...)`, not returned by JSONPlaceholder.
- 360px: DevTools device mode with width 360.

### Commands
- `npm run lint`: passed, no errors or warnings.
- `npm run build`: passed. `/` is Partial Prerender (static shell + streamed dynamic content), `/_not-found` is Static.

### Screenshots
- Normal state: `screenshots/normal.png`
- Server preview loading: `screenshots/preview-loading.png`
- Client error: `screenshots/client-error.png`
- Empty state: `screenshots/empty.png`


### Commands
- `npm run lint`: passed, no errors or warnings.
- `npm run build`: passed. `/` is Partial Prerender (static shell + streamed dynamic content), `/_not-found` is Static.