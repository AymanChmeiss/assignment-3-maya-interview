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

2. **Why did you choose server fetching for the profile and client fetching for the button?**
The profile needs no user interaction, so it is fetched on the server and arrives as ready HTML without extra JavaScript in the browser.
The button needs a user click, `onClick`, and state (loading, error, success), and these only work in a Client Component. Also, the user decides when to load the posts, so the request starts in the browser after the click.

3. **What activates the preview's Suspense fallback? Why doesn't the click-handler request activate it automatically?**
The fallback is shown when a component inside Suspense waits during render. In my project, RecentPosts is async and awaits the delay and the fetch, so React shows the fallback until it is ready.
The button request does not activate it because the fetch runs inside a click handler, after render has finished. So I track loading myself with useState.

4. **What would change if you moved the preview's boundary around the whole dashboard?**
The whole page would show only one fallback for about 2 seconds, because the boundary replaces everything inside it while any child is not ready. The title, profile, and button would wait for the slow Recent posts even though they are ready. With the boundary only around RecentPosts, only that section waits.

5. **How does your custom error class help, and what does super(message) do?**
`ApiError` extends `Error`, so it inherits everything from `Error` and adds a `status`. I throw it when `res.ok` is false, and in the `catch` I use `instanceof ApiError` to tell an HTTP failure (I show the status, like 503) from other failures such as a network error. `super(message)` calls the parent `Error` constructor so the message is stored. I saved status to show the status number in the message (e.g.: HTTP 503).

6. **What is the difference between an HTTP failure, a network failure, and an empty result?**
An HTTP failure means the server answered with a failure status such as 503. `fetch` still returns a Response with `res.ok === false`, so my code throws an `ApiError`. A network failure means no response arrived at all (e.g. offline), so `fetch` rejects and the code goes straight to `catch`. An empty result is a successful response (200) with an empty array, so it is not an error and I show "No posts found".
I tested this with Offline mode and saw the network error message.

7. **What happens if employee ID 1 is changed to 2 in all three sections?**
I changed the ID to 2 in the two places in `lib/api.ts` (`/users/2` and `userId=2`). The profile changed to Ervin Howell (employee 2), and Recent posts and Load posts used the same ID. If I changed only one place, the page would mix data (employee 2 with posts of employee 1) without any error. Keeping the ID in one constant would avoid this.
The ID is written in two places, but it affects three sections: the profile, Recent posts, and Load posts.

8. **Which decision did you personally verify rather than accepting without checking?**
I verified that repeated clicks do not start duplicate requests. I chose the Slow scenario, clicked Load posts, then clicked the button many times during the wait. The button was disabled and the Network panel (filter `jsonplaceholder`) showed only 1 request.

## AI suggestion I evaluated
- Proposed: The AI suggested protecting the Load posts button from duplicate requests by returning early when the state is "loading" and disabling the button.
- How I checked it: I chose the Slow scenario, clicked the button many times during the wait, and the Network panel showed only 1 request.
- Decision (accepted / changed / rejected): Accepted.
