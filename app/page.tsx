import { Suspense } from "react";
import EmployeeProfile from "./components/EmployeeProfile";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 p-4 sm:p-8">
      <h1 className="text-2xl font-bold">Employee Explorer</h1>

      <Suspense fallback={<p>Loading profile...</p>}>
        <EmployeeProfile />
      </Suspense>
    </main>
  );
}