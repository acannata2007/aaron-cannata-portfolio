import Link from "next/link";

"use client";
import { useEffect, useRef, useState } from "react";
import { INDUSTRIES, runModel } from "@/lib/model";
import { SEGMENTS, runSalesModel } from "@/lib/salesModel";
import { COMPANY_SIZES, runSaasModel, fmt } from "@/lib/saasModel";

const SCENARIOS = ["workforce", "sales", "saas"];
const LABELS = { workforce: "Workforce", sales: "Revenue", saas: "Software" };

const HREFS = {
  workforce: "/tools/workforce-roi",
  sales: "/tools/sales-productivity",
  saas: "/tools/saas-spend"
};

function NumInput({ value, onChange, width }) {
  return (
    <input
      aria-label="Edit the model input"
      className={`hero-input ${width}`}
      type="text"
      inputMode="numeric"
      value={value.toLocaleString("en-US")}
      onChange={(e) => {
        const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
        onChange(Math.min(isNaN(v) ? 0 : v, 99999));
      }}
    />
  );
}

export default function HeroModel() {
  const [scenario, setScenario] = useState("workforce");
  const [paused, setPaused] = useState(false);
  const [employees, setEmployees] = useState(500);
  const [reps, setReps] = useState(50);
  const [staff, setStaff] = useState(1000);
  const timer = useRef(null);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => {
      setScenario((s) => SCENARIOS[(SCENARIOS.indexOf(s) + 1) % SCENARIOS.length]);
    }, 8000);
    return () => clearInterval(timer.current);
  }, [paused]);

  function interact() {
    setPaused(true);
    if (timer.current) clearInterval(timer.current);
  }

  const ind = INDUSTRIES.manufacturing;
  const wf = runModel({
    employees, avgWage: ind.defaultWage, caregiverShare: ind.caregiverShare,
    absenceDays: ind.absenceDays, careAttrition: ind.careAttrition,
    replacementCost: ind.replacementCost, programCostPerEmployee: 250, mitigation: 0.35
  });

  const seg = SEGMENTS.midmarket;
  const sl = runSalesModel({
    reps, quota: seg.quota, attainment: seg.attainment, turnover: seg.turnover,
    vacancyMonths: seg.vacancyMonths, rampMonths: seg.rampMonths,
    rampProductivity: seg.rampProductivity, hiringCost: seg.hiringCost,
    programCostPerRep: 2000, mitigation: 0.2, grossMargin: 0.75
  });

  const cs = COMPANY_SIZES.midmarket;
  const sw = runSaasModel({
    employees: staff, spendPerEmployee: cs.spendPerEmployee, utilization: cs.utilization,
    redundantShare: cs.redundantShare, renewalLeakage: cs.renewalLeakage,
    programCostShare: 0.015, recoveryRate: 0.55
  });

  return (
    <div className="max-w-3xl" onClick={interact} onFocusCapture={interact}>
      <div className="flex gap-5 mb-8 font-mono text-[11px] tracking-[0.18em] uppercase no-print">
        {SCENARIOS.map((s) => (
          <button
            key={s}
            onClick={() => { interact(); setScenario(s); }}
            className={`pb-1 border-b-2 transition-colors ${
              scenario === s ? "border-green text-green" : "border-transparent text-slate hover:text-ink"
            }`}
          >
            {LABELS[s]}
          </button>
        ))}
      </div>

      <p className="font-serif text-[clamp(1.9rem,4.5vw,3.4rem)] leading-[1.18] text-ink">
        {scenario === "workforce" && (
          <>
            A <NumInput value={employees} onChange={setEmployees} width="w-[4.2ch]" />
            -employee manufacturer loses roughly{" "}
            <span className="font-mono text-green whitespace-nowrap">{fmt.usdShort(wf.totalBurden)}</span>{" "}
            a year to care-driven absence and turnover.
            <span className="italic text-slate"> Most never see the number.</span>
          </>
        )}
        {scenario === "sales" && (
          <>
            A <NumInput value={reps} onChange={setReps} width="w-[3.2ch]" />
            -rep sales org forfeits roughly{" "}
            <span className="font-mono text-green whitespace-nowrap">{fmt.usdShort(sl.revenueExposure)}</span>{" "}
            in revenue a year to turnover, empty seats, and ramp time.
            <span className="italic text-slate"> The plan counts seats, not productive months.</span>
          </>
        )}
        {scenario === "saas" && (
          <>
            A <NumInput value={staff} onChange={setStaff} width="w-[5.2ch]" />
            -employee company wastes roughly{" "}
            <span className="font-mono text-green whitespace-nowrap">{fmt.usdShort(sw.totalWaste)}</span>{" "}
            a year on software nobody uses.
            <span className="italic text-slate"> The renewal calendar keeps the secret.</span>
          </>
        )}
      </p>
      <p className="mt-6 font-mono text-[12px] text-slate tracking-wide">
        ↑ EDIT THE NUMBER. EVERY MODEL ON THIS SITE IS LIVE.
      </p>
      <div className="mt-12 flex flex-wrap gap-4 no-print">
        <Link
          href={HREFS[scenario]}
          className="bg-ink text-paper font-mono text-[13px] tracking-wider uppercase px-6 py-3 hover:bg-green transition-colors"
        >
          Run the full model →
        </Link>
        
          href="#contact"
          className="border border-ink font-mono text-[13px] tracking-wider uppercase px-6 py-3 hover:border-green hover:text-green transition-colors"
        >
          Work with me
        </a>
      </div>
    </div>
  );
}
