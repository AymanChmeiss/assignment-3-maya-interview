import { getEmployee } from "@/lib/api";
import type { Employee } from "@/lib/types";

export default async function EmployeeProfile() {
  let employee: Employee;

  try {
    employee = await getEmployee();
  } catch {
    return (
      <section className="rounded-lg border border-red-300 bg-red-50 p-4">
        <h2 className="text-lg font-semibold">Employee profile</h2>
        <p className="text-red-700">
          We couldn&apos;t load the profile right now. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border p-4">
      <h2 className="text-xl font-semibold">{employee.name}</h2>
      <p>{employee.email}</p>
      <p className="text-gray-600">{employee.company.name}</p>
    </section>
  );
}