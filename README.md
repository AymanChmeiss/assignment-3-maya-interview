# Employee Explorer

A small Next.js (App Router) dashboard for Maya's interview assignment. It shows what runs on the server and what runs in the browser.

## Run

    npm install
    npm run dev

Open http://localhost:3000.

## What is on the page
- Employee profile: Server Component (employee 1).
- Recent posts preview: async Server Component inside its own Suspense boundary, with an intentional 2-second delay (a learning simulation).
- Load posts: Client Component that fetches after a click.

## Demo scenarios (testing controls)
The client explorer has a "Demo scenario" selector. Success and Slow use the real JSONPlaceholder API. HTTP error (503) and Empty are deliberate local simulations built with `new Response(...)` and passed through the same `response.ok` and JSON-parsing code. JSONPlaceholder did not return them. A selection applies only to the next Load or Retry, not to the server sections.

## Docs
- `docs/INTERVIEW.md`
- `docs/TESTING.md`