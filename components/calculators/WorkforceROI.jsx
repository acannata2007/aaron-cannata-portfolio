"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { INDUSTRIES, runModel, buildBrief, fmt } from "@/lib/model";

function Field({ label, suffix, value, onChange, step = 1, min = 0, max, pct }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-slate">
        {label}
      </span>
      <div className="flex items-baseline gap-2 mt-1">
        <input
          type="number"
          className="w-full bg-transparent border-b border-hairline focus:border-green outline-none font-mono text-lg py-1"
          value={pct ? Math.round(value * 1000) / 10 : value}
          step={step}
          min={min}
          max={max}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (isNaN(v)) return;
            onChange(pct ? v / 100 : v);
          }}
        />
        {suffix && <span className="font-mono text-sm text-slate">{suffix}</span>}
      </div>
    </label>
  );
}

function Stat({ label, value, tone = "ink" }) {
  const color =
    tone === "green" ? "text-green" : tone === "red" ? "text-[#A02C2C]" : "text-ink";
  return (
    <div className="hairline-top pt-3">
      <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-slate">
        {label}
      </p>
      <p className={`font-mono text-2xl sm:text-3xl mt-1 ${color}`}>{value}</p>
    </div>
  );
}

export default function WorkforceROI() {
  const [industry, setIndustry] = useState("manufacturing");
  const [company, setCompany] = useState("");
  const [employees, setEmployees] = useState(500);
  const [avgWage, setAvgWage] = useState(INDUSTRIES.manufacturing.defaultWage);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [stakeholder, setStakeholder] = useState(null);

  // Overridable assumptions, seeded from industry benchmarks
  const [a, setA] = useState({
    caregiverShare: INDUSTRIES.manufacturing.caregiverShare,
    absenceDays: INDUSTRIES.manufacturing.absenceDays,
    careAttrition: INDUSTRIES.manufacturing.careAttrition,
    replacementCost: INDUSTRIES.manufacturing.replacementCost,
    programCostPerEmployee: 250,
    mitigation: 0.35
  });

  function pickIndustry(key) {
    setIndustry(key);
    const ind = INDUSTRIES[key];
    setAvgWage(ind.defaultWage);
    setA((prev) => ({
      ...prev,
      caregiverShare: ind.caregiverShare,
      absenceDays: ind.absenceDays,
      careAttrition: ind.careAttrition,
      replacementCost: ind.replacementCost
    }));
  }

  const r = useMemo(
    () => runModel({ employees, avgWage, ...a }),
    [employees, avgWage, a]
  );

  const brief = stakeholder
    ? buildBrief(stakeholder, r, { ...a, employees, company, industry })
    : null;

  return (
    <main className="px-6 sm:px-12 max-w-6xl mx-auto pb-24">
      <nav className="flex items-baseline justify-between py-8">
        <Link href="/" className="font-serif text-xl hover:text-green">
          ← Aaron Cannata
        </Link>
        <span className="font-mono text-[11px] tracking-widest uppercase text-green">
          Live model 01
        </span>
      </nav>

      <header className="max-w-3xl mt-8 mb-14">
        <p className="eyebrow mb-3">Workforce ROI Calculator</p>
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
          What care-driven absence and attrition actually cost — and what a program
          nets after §45F.
        </h1>
        <p className="text-slate mt-5 text-[15px] leading-relaxed">
          Two inputs produce a defensible first read. Every benchmark underneath is
          visible and overridable, so the same model scales from a five-minute
          qualification to a CFO-grade business case. When you&rsquo;re done, generate
          an executive brief written for the stakeholder who has to approve it.
        </p>
      </header>

      {/* INPUTS */}
      <section className="grid sm:grid-cols-3 gap-8 mb-4">
        <label className="block">
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-slate">
            Industry
          </span>
          <select
            className="w-full bg-transparent border-b border-hairline focus:border-green outline-none font-mono text-lg py-1 mt-1"
            value={industry}
            onChange={(e) => pickIndustry(e.target.value)}
          >
            {Object.entries(INDUSTRIES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
        <Field label="Employees" value={employees} onChange={setEmployees} step={50} />
        <Field label="Average salary" suffix="USD/yr" value={avgWage} onChange={setAvgWage} step={1000} />
      </section>

      <button
        onClick={() => setShowAssumptions((s) => !s)}
        className="font-mono text-[12px] tracking-wider uppercase text-green mb-10"
      >
        {showAssumptions ? "− Hide" : "+ Override"} benchmark assumptions
      </button>

      {showAssumptions && (
        <section className="grid sm:grid-cols-3 gap-8 mb-12 bg-tint p-6">
          <Field label="Caregiver share of workforce" suffix="%" pct value={a.caregiverShare} onChange={(v) => setA({ ...a, caregiverShare: v })} step={1} />
          <Field label="Care absence days / caregiver / yr" value={a.absenceDays} onChange={(v) => setA({ ...a, absenceDays: v })} />
          <Field label="Care-driven attrition rate" suffix="%" pct value={a.careAttrition} onChange={(v) => setA({ ...a, careAttrition: v })} step={1} />
          <Field label="Replacement cost (× salary)" suffix="%" pct value={a.replacementCost} onChange={(v) => setA({ ...a, replacementCost: v })} step={5} />
          <Field label="Program cost / employee / yr" suffix="USD" value={a.programCostPerEmployee} onChange={(v) => setA({ ...a, programCostPerEmployee: v })} step={10} />
          <Field label="Burden recovered by program" suffix="%" pct value={a.mitigation} onChange={(v) => setA({ ...a, mitigation: v })} step={5} />
        </section>
      )}

      {/* OUTPUTS */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-8 mb-6">
        <Stat label="Absenteeism cost / yr" value={fmt.usd(r.absenteeismCost)} tone="red" />
        <Stat label="Attrition cost / yr" value={fmt.usd(r.attritionCost)} tone="red" />
        <Stat label="Total annual burden" value={fmt.usd(r.totalBurden)} tone="red" />
        <Stat label="Caregivers in workforce" value={fmt.num(r.caregivers)} />
        <Stat label="Gross program cost" value={fmt.usd(r.programCost)} />
        <Stat label="§45F federal credit" value={`−${fmt.usd(r.credit)}`} tone="green" />
        <Stat label="Net program cost" value={fmt.usd(r.netProgramCost)} />
        <Stat label="Modeled annual recovery" value={fmt.usd(r.recovered)} tone="green" />
      </section>

      <section className="bg-ink text-paper p-8 grid sm:grid-cols-3 gap-8 mb-16">
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-paper/60">
            First-year net benefit
          </p>
          <p className="font-mono text-4xl mt-2 text-green">{fmt.usd(r.netBenefit)}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-paper/60">
            First-year ROI
          </p>
          <p className="font-mono text-4xl mt-2">{fmt.pct(r.roi)}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-paper/60">
            Payback period
          </p>
          <p className="font-mono text-4xl mt-2">{fmt.months(r.paybackMonths)}</p>
        </div>
      </section>

      {/* BRIEF GENERATOR */}
      <section className="hairline-top pt-12">
        <p className="eyebrow mb-3">Executive brief generator</p>
        <h2 className="font-serif text-3xl mb-2">
          Same model, three audiences.
        </h2>
        <p className="text-slate text-[15px] max-w-xl mb-8">
          A number only moves a decision when it&rsquo;s framed for the person who
          owns it. Pick the stakeholder; the brief writes itself from the live model
          above. Print or save it as a PDF.
        </p>
        <div className="flex flex-wrap gap-3 mb-4 no-print">
          <input
            placeholder="Company name (optional)"
            className="bg-transparent border-b border-hairline focus:border-green outline-none font-mono text-sm py-2 w-56"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3 no-print">
          {[
            ["cfo", "For the CFO"],
            ["ops", "For Operations"],
            ["chro", "For HR / CHRO"]
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setStakeholder(k)}
              className={`font-mono text-[12px] tracking-wider uppercase px-5 py-3 border transition-colors ${
                stakeholder === k
                  ? "bg-ink text-paper border-ink"
                  : "border-ink hover:border-green hover:text-green"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {brief && (
          <article
            id="brief-doc"
            className="mt-10 border border-hairline bg-white p-8 sm:p-12 max-w-3xl shadow-sm"
          >
            <div className="flex items-baseline justify-between mb-1">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-green">
                Executive brief
              </p>
              <p className="font-mono text-[10px] text-slate">{brief.date}</p>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl mt-3">{brief.title}</h3>
            <p className="font-mono text-[11px] uppercase tracking-wider text-slate mt-1 mb-8">
              {brief.audience}
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8">
              {brief.stats.map((s) => (
                <Stat key={s.label} {...s} />
              ))}
            </div>
            <div className="space-y-4 text-[14px] leading-relaxed text-ink">
              {brief.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="font-mono text-[10px] text-slate mt-10 hairline-top pt-4 leading-relaxed">
              {brief.footer}
            </p>
            <button
              onClick={() => window.print()}
              className="no-print mt-8 bg-green text-paper font-mono text-[12px] tracking-wider uppercase px-5 py-3 hover:bg-ink transition-colors"
            >
              Print / save as PDF
            </button>
          </article>
        )}
      </section>

      <footer className="mt-20 font-mono text-[11px] text-slate leading-relaxed max-w-2xl">
        METHODOLOGY — Benchmarks are conservative industry medians (BLS absence
        data, SHRM replacement-cost ranges, §45F at the post-2025 40% rate, $500K
        cap). They exist to produce a fast, honest first read; the override panel
        exists because a business case is only as strong as the inputs the buyer
        recognizes as their own.
      </footer>
    </main>
  );
}
