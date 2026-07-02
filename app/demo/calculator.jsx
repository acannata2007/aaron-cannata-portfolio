"use client";

import { useState } from "react";

// Placeholder assumption: share of fully loaded workforce cost the program
// recovers each year. Tune per company before sharing the route.
const RECOVERY_RATE = 0.05;

function parseNum(value) {
  const n = parseInt(value.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? 0 : Math.min(n, 10000000);
}

export default function RoiCalculator() {
  const [employees, setEmployees] = useState(500);
  const [costPerEmployee, setCostPerEmployee] = useState(75000);

  const savings = Math.round(employees * costPerEmployee * RECOVERY_RATE);

  return (
    <div className="mt-10 rounded-lg border border-line bg-tint p-7 sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="employees" className="label text-navy">
            Number of Employees
          </label>
          <input
            id="employees"
            type="text"
            inputMode="numeric"
            value={employees.toLocaleString("en-US")}
            onChange={(e) => setEmployees(parseNum(e.target.value))}
            className="mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-lg font-semibold text-navy outline-none focus:border-blue"
          />
        </div>
        <div>
          <label htmlFor="cost" className="label text-navy">
            Avg. Annual Cost per Employee ($)
          </label>
          <input
            id="cost"
            type="text"
            inputMode="numeric"
            value={costPerEmployee.toLocaleString("en-US")}
            onChange={(e) => setCostPerEmployee(parseNum(e.target.value))}
            className="mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-lg font-semibold text-navy outline-none focus:border-blue"
          />
        </div>
      </div>

      <div className="mt-10 border-t border-line pt-8">
        <p className="text-5xl font-bold tracking-tight text-blue sm:text-6xl">
          ${savings.toLocaleString("en-US")}
        </p>
        <p className="label mt-3 text-slate">Projected Annual Savings</p>
      </div>
    </div>
  );
}
