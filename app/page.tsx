import { Suspense } from "react";
import EmployeeProfile from "./components/EmployeeProfile";
import RecentPosts from "./components/RecentPosts";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 p-4 sm:p-8">
      <h1 className="text-2xl font-bold">Employee Explorer</h1>
      <p className="text-gray-600">
        A small dashboard showing what loads on the server and what loads in
        the browser.
      </p>

      <Suspense fallback={<p>Loading profile...</p>}>
        <EmployeeProfile />
      </Suspense>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Recent posts</h2>
        <p className="mb-2 text-xs text-gray-500">
          Intentional learning simulation: this section has a 2-second delay.
        </p>
        <Suspense fallback={<p>Loading recent posts (2s simulated delay)...</p>}>
          <RecentPosts />
        </Suspense>
      </section>
    </main>
  );
}