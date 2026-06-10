"use client";
import { useState } from "react";
import { INDUSTRIES, runModel, fmt } from "@/lib/model";

export default function HeroModel() {
  const [employees, setEmployees] = useState(500);
  const ind = INDUSTRIES.manufacturing;

  const r = runModel({
    employees,
    avgWage: ind.defaultWage,
    caregiverShare: ind.caregiverShare,
    absenceDays: ind.absenceDays,
    careAttrition: ind.careAttrition,
    replacementCost: ind.replacementCost,
    programCostPerEmployee: 250,
    mitigation: 0.35
  });

  return (
    <div className="max-w-3xl">
      <p className="font-serif text-[clamp(1.9rem,4.5vw,3.4rem)] leading-[1.18] text-ink">
        A{" "}
        <input
          aria-label="Number of employees"
          className="hero-input w-[4.2ch]"
          type="text"
          inputMode="numeric"
          value={employees.toLocaleString("en-US")}
          onChange={(e) => {
            const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
            setEmployees(Math.min(isNaN(v) ? 0 : v, 99999));
          }}
        />
        -employee manufacturer loses roughly{" "}
        <span className="font-mono text-green whitespace-nowrap">
          {fmt.usdShort(r.totalBurden)}
        </span>{" "}
        a year to care-driven absence and turnover.
        <span className="italic text-slate"> Most never see the number.</span>
      </p>
      <p className="mt-6 font-mono text-[12px] text-slate tracking-wide">
        ↑ EDIT THE HEADCOUNT. THE MODEL IS LIVE — LIKE EVERYTHING I BUILD.
      </p>
    </div>
  );
}
