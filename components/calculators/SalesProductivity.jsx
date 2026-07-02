"use client";
import { useMemo, useState } from "react";
import { SEGMENTS, runSalesModel, buildSalesBrief, fmt } from "@/lib/salesModel";
import { CalcNav, PageHeader, Field, Select, Stat, Headline, BriefGenerator } from "./ui";

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
    <main className="mx-auto max-w-5xl px-6 pb-24">
      <CalcNav index="02" />

      <PageHeader
        eyebrow="Sales Productivity Model"
        title="What rep turnover, empty seats, and ramp time cost a revenue plan."
        description="Coverage models count seats. This one prices vacancy, ramp, and replacement, then shows the return on closing the gap."
      />

      {/* INPUTS */}
      <section className="mt-10 rounded-lg border border-line bg-tint p-6 sm:p-8">
        <p className="label text-blue">Inputs</p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <Select
            label="Segment"
            value={segment}
            onChange={pickSegment}
            options={Object.entries(SEGMENTS).map(([k, v]) => [k, v.label])}
          />
          <Field label="Quota-carrying reps" value={reps} onChange={setReps} step={5} />
        </div>
        <button
          onClick={() => setShow((s) => !s)}
          className="mt-6 text-sm font-semibold text-blue hover:text-navy"
        >
          {show ? "Hide" : "Override"} benchmark assumptions
        </button>
        {show && (
          <div className="mt-6 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
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
          </div>
        )}
      </section>

      {/* RESULTS */}
      <section className="mt-14">
        <Headline
          label="First-Year Net Benefit (Margin Basis)"
          value={fmt.usd(r.netBenefit)}
          desc="Evaluated on gross margin, not revenue, so the case survives finance review."
        />

        <div className="mt-10 grid gap-x-8 gap-y-10 border-t border-line pt-8 sm:grid-cols-3">
          <Stat
            size="lg"
            label="First-Year ROI"
            value={fmt.pct(r.roi)}
            tone="green"
            desc="Return on the retention and enablement spend."
          />
          <Stat
            size="lg"
            label="Payback Period"
            value={fmt.months(r.paybackMonths)}
            tone="green"
            desc="Time for recovered margin to cover program cost."
          />
          <Stat
            size="lg"
            label="Revenue Exposure / Yr"
            value={fmt.usd(r.revenueExposure)}
            tone="red"
            desc="Capacity the plan assumes but the floor never delivers."
          />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-8 sm:grid-cols-4">
          <Stat label="Rep exits / yr" value={fmt.num(r.exits)} tone="red" />
          <Stat label="Loss per departed rep" value={fmt.usd(r.revLossPerExit)} tone="red" />
          <Stat label="Replacement cost / yr" value={fmt.usd(r.replacementCost)} tone="red" />
          <Stat label="Vacancy share per exit" value={fmt.usd(r.vacancyLossPerExit)} />
          <Stat label="Ramp share per exit" value={fmt.usd(r.rampLossPerExit)} />
          <Stat label="Program cost" value={fmt.usd(r.programCost)} />
          <Stat label="Recovered revenue" value={fmt.usd(r.recoveredRevenue)} tone="green" />
        </div>
      </section>

      <BriefGenerator
        company={company} setCompany={setCompany}
        stakeholder={stakeholder} setStakeholder={setStakeholder}
        options={[["cro", "For the CRO"], ["cfo", "For the CFO"], ["revops", "For RevOps / Enablement"]]}
        brief={brief}
      />

      <footer className="mt-20 max-w-2xl text-xs leading-relaxed text-slate">
        <span className="label text-navy">Methodology:</span> Revenue exposure is
        computed per departed rep as vacancy months plus ramp months at reduced
        productivity, against quota times attainment. ROI is evaluated on a
        gross-margin basis so the result survives finance review. Segment defaults
        are conservative medians; the override panel exists because credibility
        lives in the buyer&apos;s own numbers.
      </footer>
    </main>
  );
}
