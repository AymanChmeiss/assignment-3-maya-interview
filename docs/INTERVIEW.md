# Interview Notes

## Mission 1: Initial Predictions (before implementation)

1. **Where each request runs:**
   - Profile (`/users/1`): server, in a Server Component.
   - Recent posts (`/posts?userId=1`): server, in an async Server Component inside Suspense.
   - Explore all posts: browser, in a Client Component after a click.

2. **What stays visible while the preview loads:** The page title, the employee profile, and the Explore section. Only the recent posts area shows the Suspense fallback.

3. **Does Suspense around a click-handler fetch show its fallback?** No. Suspense only reacts to components that suspend during render. A fetch in an event handler doesn't suspend, so I need manual loading/error state.

4. **Does fetch throw on HTTP 503?** No. fetch only rejects on network failure. A 503 returns a normal Response with `res.ok === false`, so I must check `res.ok` and throw myself.

## What I learned after testing
- Prediction 1: Correct. The profile and recent posts did not appear in the Network panel, and the Load posts request appeared only after the click.
- Prediction 2: Mostly correct. The page title, the intro, and the All posts section stayed visible, and only the Recent posts area showed its fallback ("Loading recent posts..."). One difference: the profile also showed its own "Loading profile..." fallback for a moment, because it has its own Suspense boundary.
- Prediction 3: Correct. Suspense did not show a fallback for the button request. The "Loading..." came from my own useState loading state, because the fetch runs in a click handler, not during render.
- Prediction 4: Correct. In the HTTP error scenario, I created a `new Response(null, { status: 503 })` and passed it through `parsePostsResponse`. Neither `fetch` nor `Response` threw on its own; my code checked `res.ok` and threw an `ApiError`, so the "HTTP 503" message and the "Try again" button appeared.

## Interview answers
1. **Where each request runs and my evidence:**
The profile and recent posts run on the server because they are async Server Components (no "use client") that fetch inside the component.
Evidence: after loading the page, the Network panel with the filter `jsonplaceholder` showed 0 requests, even though the profile and the three titles were visible.
The Load posts request runs in the browser because ExplorePosts is a Client Component. Evidence: after clicking, Network showed `posts?userId=1` with Initiator `ExplorePosts.tsx`.

