# Interview Notes

## Mission 1: Initial Predictions (before implementation)

1. **Where each request runs:**
   - Profile (`/users/1`): server, in a Server Component.
   - Recent posts (`/posts?userId=1`): server, in an async Server Component inside Suspense.
   - Explore all posts: browser, in a Client Component after a click.

2. **What stays visible while the preview loads:** The page title, the employee profile, and the Explore section. Only the recent posts area shows the Suspense fallback.

3. **Does Suspense around a click-handler fetch show its fallback?** No. Suspense only reacts to components that suspend during render. A fetch in an event handler doesn't suspend, so I need manual loading/error state.

4. **Does fetch throw on HTTP 503?** No. fetch only rejects on network failure. A 503 returns a normal Response with `res.ok === false`, so I must check `res.ok` and throw myself.
