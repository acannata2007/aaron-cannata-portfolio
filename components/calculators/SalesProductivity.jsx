"use client";
import { useMemo, useState } from "react";
import { SEGMENTS, runSalesModel, buildSalesBrief, fmt } from "@/lib/salesModel";
import { Field, Stat, CalcNav, HeroBand, BriefGenerator } from "./ui";

export default function SalesProductivity() {
  const [segment, setSegment] = useState("midmarket");
  const [company, setCompany] = useState("");
  const [reps, setReps] = useState(50);
  const [stakeholder, setStakeholder] = useState(null);
  const [show, setShow] = useState(false);

  const seg = SEGMENTS.midmarket;
  const [a, setA] = useState({
    quota: seg.quota,
    attainment: seg.attainment,
    turnover: seg.turnover,
    vacancyMonths: seg.vacancyMonths,
    rampMonths: seg.rampMonths,
    rampProductivity: seg.rampProductivity,
    hiringCost: seg.hiringCost,
    programCostPerRep: 2000,
    mitigation: 0.2,
    grossMargin: 0.75
  });

  function pickSegment(key) {
    setSegment(key);
    const s = SEGMENTS[key];
    setA((prev) => ({
      ...prev,
      quota: s.quota, attainment: s.attainment, turnover: s.turnover,
      vacancyMonths: s.vacancyMonths, rampMonths: s.rampMonths,
      rampProductivity: s.rampProductivity, hiringCost: s.hiringCost
    }));
  }

  const r = useMemo(() => runSalesModel({ reps, ...a }), [reps, a]);
  const brief = stakeholder ? buildSalesBrief(stakeholder, r, { ...a, reps, company }) : null;

  return (
    <main className="px-6 sm:px-12 max-w-6xl mx-auto pb-24">
      <CalcNav index="02" />

      <header className="max-w-3xl mt-8 mb-14">
        <p className="eyebrow mb-3">Sales Productivity Model</p>
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
          What rep turnover, empty seats, and ramp time cost a revenue plan.
        </h1>
        <p className="text-slate mt-5 text-[15px] leading-relaxed">
          Coverage models count seats. Revenue comes from productive months. This
          model prices the gap — vacancy, ramp, and replacement — then shows the
          return on closing it. Every benchmark is overridable with CRM actuals.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-8 mb-4 max-w-2xl">
        <label className="block">
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-slate">Segment</span>
          <select
            className="w-full bg-transparent border-b border-hairline focus:border-green outline-none font-mono text-lg py-1 mt-1"
            value={segment}
            onChange={(e) => pickSegment(e.target.value)}
          >
            {Object.entries(SEGMENTS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </label>
        <Field label="Quota-carrying reps" value={reps} onChange={setReps} step={5} />
      </section>

      <button onClick={() => setShow((s) => !s)} className="font-mono text-[12px] tracking-wider uppercase text-green mb-10">
        {show ? "− Hide" : "+ Override"} benchmark assumptions
      </button>

      {show && (
        <section className="grid sm:grid-cols-3 gap-8 mb-12 bg-tint p-6">
          <Field label="Average quota" suffix="USD/yr" value={a.quota} onChange={(v) => setA({ ...a, quota: v })} step={50000} />
          <Field label="Average attainment" suffix="%" pct value={a.attainment} onChange={(v) => setA({ ...a, attainment: v })} step={1} />
          <Field label="Annual rep turnover" suffix="%" pct value={a.turnover} onChange={(v) => setA({ ...a, turnover: v })} step={1} />
          <Field label="Months to backfill" value={a.vacancyMonths} onChange={(v) => setA({ ...a, vacancyMonths: v })} step={0.5} />
          <Field label="Ramp months" value={a.rampMonths} onChange={(v) => setA({ ...a, rampMonths: v })} step={0.5} />
          <Field label="Productivity during ramp" suffix="%" pct value={a.rampProductivity} onChange={(v) => setA({ ...a, rampProductivity: v })} step={5} />
          <Field label="Hiring cost per rep" suffix="USD" value={a.hiringCost} onChange={(v) => setA({ ...a, hiringCost: v })} step={1000} />
          <Field label="Program cost / rep / yr" suffix="USD" value={a.programCostPerRep} onChange={(v) => setA({ ...a, programCostPerRep: v })} step={250} />
          <Field label="Exposure recovered" suffix="%" pct value={a.mitigation} onChange={(v) => setA({ ...a, mitigation: v })} step={5} />
          <Field label="Gross margin" suffix="%" pct value={a.grossMargin} onChange={(v) => setA({ ...a, grossMargin: v })} step={5} />
        </section>
      )}

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-8 mb-6">
        <Stat label="Rep exits / yr" value={fmt.num(r.exits)} tone="red" />
        <Stat label="Loss per departed rep" value={fmt.usd(r.revLossPerExit)} tone="red" />
        <Stat label="Revenue exposure / yr" value={fmt.usd(r.revenueExposure)} tone="red" />
        <Stat label="Replacement cost / yr" value={fmt.usd(r.replacementCost)} tone="red" />
        <Stat label="Vacancy share per exit" value={fmt.usd(r.vacancyLossPerExit)} />
        <Stat label="Ramp share per exit" value={fmt.usd(r.rampLossPerExit)} />
        <Stat label="Program cost" value={fmt.usd(r.programCost)} />
        <Stat label="Recovered revenue" value={fmt.usd(r.recoveredRevenue)} tone="green" />
      </section>

      <HeroBand items={[
        { label: "First-year net benefit (margin basis)", value: fmt.usd(r.netBenefit), green: true },
        { label: "First-year ROI", value: fmt.pct(r.roi) },
        { label: "Payback period", value: fmt.months(r.paybackMonths) }
      ]} />

      <BriefGenerator
        company={company} setCompany={setCompany}
        stakeholder={stakeholder} setStakeholder={setStakeholder}
        options={[["cro", "For the CRO"], ["cfo", "For the CFO"], ["revops", "For RevOps / Enablement"]]}
        brief={brief}
      />

      <footer className="mt-20 font-mono text-[11px] text-slate leading-relaxed max-w-2xl">
        METHODOLOGY — Revenue exposure is computed per departed rep as vacancy
        months plus ramp months at reduced productivity, against quota × attainment.
        ROI is evaluated on a gross-margin basis so the result survives finance
        review. Segment defaults are conservative medians; the override panel exists
        because credibility lives in the buyer&rsquo;s own numbers.
      </footer>
    </main>
  );
}
