"use client";
import { useMemo, useState } from "react";
import { COMPANY_SIZES, runSaasModel, buildSaasBrief, fmt } from "@/lib/saasModel";
import { CalcNav, PageHeader, Field, Select, Stat, Headline, BriefGenerator } from "./ui";

export default function SaasSpend() {
  const [size, setSize] = useState("midmarket");
  const [company, setCompany] = useState("");
  const [employees, setEmployees] = useState(1000);
  const [stakeholder, setStakeholder] = useState(null);
  const [show, setShow] = useState(false);

  const def = COMPANY_SIZES.midmarket;
  const [a, setA] = useState({
    spendPerEmployee: def.spendPerEmployee,
    utilization: def.utilization,
    redundantShare: def.redundantShare,
    renewalLeakage: def.renewalLeakage,
    programCostShare: 0.015,
    recoveryRate: 0.55
  });

  function pickSize(key) {
    setSize(key);
    const s = COMPANY_SIZES[key];
    setA((prev) => ({
      ...prev,
      spendPerEmployee: s.spendPerEmployee, utilization: s.utilization,
      redundantShare: s.redundantShare, renewalLeakage: s.renewalLeakage
    }));
  }

  const r = useMemo(() => runSaasModel({ employees, ...a }), [employees, a]);
  const brief = stakeholder ? buildSaasBrief(stakeholder, r, { ...a, employees, company }) : null;

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24">
      <CalcNav index="01" />

      <PageHeader
        eyebrow="SaaS Spend Model"
        title="The recoverable share of your software budget, priced."
        description="Two inputs size the waste in unused licenses, overlapping tools, and unmanaged renewals, then show the return on fixing it."
      />

      {/* INPUTS */}
      <section className="mt-10 rounded-lg border border-line bg-tint p-6 sm:p-8">
        <p className="label text-blue">Inputs</p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <Select
            label="Company size"
            value={size}
            onChange={pickSize}
            options={Object.entries(COMPANY_SIZES).map(([k, v]) => [k, v.label])}
          />
          <Field label="Employees" value={employees} onChange={setEmployees} step={50} />
        </div>
        <button
          onClick={() => setShow((s) => !s)}
          className="mt-6 text-sm font-semibold text-blue hover:text-navy"
        >
          {show ? "Hide" : "Override"} benchmark assumptions
        </button>
        {show && (
          <div className="mt-6 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
            <Field label="SaaS spend / employee / yr" suffix="USD" value={a.spendPerEmployee} onChange={(v) => setA({ ...a, spendPerEmployee: v })} step={100} />
            <Field label="License utilization" suffix="%" pct value={a.utilization} onChange={(v) => setA({ ...a, utilization: v })} step={1} />
            <Field label="Redundant tooling share" suffix="%" pct value={a.redundantShare} onChange={(v) => setA({ ...a, redundantShare: v })} step={1} />
            <Field label="Renewal leakage" suffix="%" pct value={a.renewalLeakage} onChange={(v) => setA({ ...a, renewalLeakage: v })} step={1} />
            <Field label="Program cost (% of spend)" suffix="%" pct value={a.programCostShare} onChange={(v) => setA({ ...a, programCostShare: v })} step={0.5} />
            <Field label="Year-one recovery rate" suffix="%" pct value={a.recoveryRate} onChange={(v) => setA({ ...a, recoveryRate: v })} step={5} />
          </div>
        )}
      </section>

      {/* RESULTS */}
      <section className="mt-14">
        <Headline
          label="First-Year Net Benefit"
          value={fmt.usd(r.netBenefit)}
          desc="Year-one recovery minus program cost, at conservative benchmarks."
        />

        <div className="mt-10 grid gap-x-8 gap-y-10 border-t border-line pt-8 sm:grid-cols-3">
          <Stat
            size="lg"
            label="First-Year ROI"
            value={fmt.pct(r.roi)}
            tone="green"
            desc="Return on the spend-management program itself."
          />
          <Stat
            size="lg"
            label="Payback Period"
            value={fmt.months(r.paybackMonths)}
            tone="green"
            desc="Time for recovered spend to cover program cost."
          />
          <Stat
            size="lg"
            label="Total Identified Waste"
            value={fmt.usd(r.totalWaste)}
            tone="red"
            desc="Shelfware, redundancy, and renewal leakage combined."
          />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-8 sm:grid-cols-4">
          <Stat label="Annual SaaS spend" value={fmt.usd(r.totalSpend)} />
          <Stat label="Shelfware cost" value={fmt.usd(r.shelfwareCost)} tone="red" />
          <Stat label="Redundant tooling" value={fmt.usd(r.redundancyCost)} tone="red" />
          <Stat label="Renewal leakage" value={fmt.usd(r.leakageCost)} tone="red" />
          <Stat label="Waste share of spend" value={fmt.pct(r.wastePctOfSpend)} tone="red" />
          <Stat label="Program cost" value={fmt.usd(r.programCost)} />
          <Stat label="Year-one recovery" value={fmt.usd(r.recovered)} tone="green" />
        </div>
      </section>

      <BriefGenerator
        company={company} setCompany={setCompany}
        stakeholder={stakeholder} setStakeholder={setStakeholder}
        options={[["cfo", "For the CFO"], ["cio", "For the CIO"], ["procurement", "For Procurement"]]}
        brief={brief}
      />

      <footer className="mt-20 max-w-2xl text-xs leading-relaxed text-slate">
        <span className="label text-navy">Methodology:</span> Waste is decomposed
        into shelfware (spend times unused-license share), redundancy (overlapping
        tools), and renewal leakage (uncontested escalation). Recovery is modeled
        at a conservative year-one rate because contract terms gate how fast
        identified waste converts to realized savings. Benchmarks reflect
        published utilization medians; every number is overridable with SSO and
        contract actuals.
      </footer>
    </main>
  );
}
