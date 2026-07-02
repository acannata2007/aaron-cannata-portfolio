"use client";
import { useMemo, useState } from "react";
import { COMPANY_SIZES, runSaasModel, buildSaasBrief, fmt } from "@/lib/saasModel";
import { Field, Stat, CalcNav, HeroBand, BriefGenerator } from "./ui";

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
    <main className="px-6 sm:px-12 max-w-6xl mx-auto pb-24">
      <CalcNav index="03" />

      <header className="max-w-3xl mt-8 mb-14">
        <p className="eyebrow mb-3">SaaS Spend Model</p>
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
          The recoverable share of your software budget — priced.
        </h1>
        <p className="text-slate mt-5 text-[15px] leading-relaxed">
          Unused licenses, overlapping tools, and auto-renewals that escalate
          unchallenged. This model sizes all three from two inputs, then shows the
          return on a structured spend-management practice. Benchmarks reflect
          published utilization medians; every number is overridable with SSO and
          contract actuals.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-8 mb-4 max-w-2xl">
        <label className="block">
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-slate">Company size</span>
          <select
            className="w-full bg-transparent border-b border-hairline focus:border-green outline-none font-mono text-lg py-1 mt-1"
            value={size}
            onChange={(e) => pickSize(e.target.value)}
          >
            {Object.entries(COMPANY_SIZES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </label>
        <Field label="Employees" value={employees} onChange={setEmployees} step={50} />
      </section>

      <button onClick={() => setShow((s) => !s)} className="font-mono text-[12px] tracking-wider uppercase text-green mb-10">
        {show ? "− Hide" : "+ Override"} benchmark assumptions
      </button>

      {show && (
        <section className="grid sm:grid-cols-3 gap-8 mb-12 bg-tint p-6">
          <Field label="SaaS spend / employee / yr" suffix="USD" value={a.spendPerEmployee} onChange={(v) => setA({ ...a, spendPerEmployee: v })} step={100} />
          <Field label="License utilization" suffix="%" pct value={a.utilization} onChange={(v) => setA({ ...a, utilization: v })} step={1} />
          <Field label="Redundant tooling share" suffix="%" pct value={a.redundantShare} onChange={(v) => setA({ ...a, redundantShare: v })} step={1} />
          <Field label="Renewal leakage" suffix="%" pct value={a.renewalLeakage} onChange={(v) => setA({ ...a, renewalLeakage: v })} step={1} />
          <Field label="Program cost (% of spend)" suffix="%" pct value={a.programCostShare} onChange={(v) => setA({ ...a, programCostShare: v })} step={0.5} />
          <Field label="Year-one recovery rate" suffix="%" pct value={a.recoveryRate} onChange={(v) => setA({ ...a, recoveryRate: v })} step={5} />
        </section>
      )}

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-8 mb-6">
        <Stat label="Annual SaaS spend" value={fmt.usd(r.totalSpend)} />
        <Stat label="Shelfware cost" value={fmt.usd(r.shelfwareCost)} tone="red" />
        <Stat label="Redundant tooling" value={fmt.usd(r.redundancyCost)} tone="red" />
        <Stat label="Renewal leakage" value={fmt.usd(r.leakageCost)} tone="red" />
        <Stat label="Total identified waste" value={fmt.usd(r.totalWaste)} tone="red" />
        <Stat label="Waste as share of spend" value={fmt.pct(r.wastePctOfSpend)} tone="red" />
        <Stat label="Program cost" value={fmt.usd(r.programCost)} />
        <Stat label="Year-one recovery" value={fmt.usd(r.recovered)} tone="green" />
      </section>

      <HeroBand items={[
        { label: "First-year net benefit", value: fmt.usd(r.netBenefit), green: true },
        { label: "First-year ROI", value: fmt.pct(r.roi) },
        { label: "Payback period", value: fmt.months(r.paybackMonths) }
      ]} />

      <BriefGenerator
        company={company} setCompany={setCompany}
        stakeholder={stakeholder} setStakeholder={setStakeholder}
        options={[["cfo", "For the CFO"], ["cio", "For the CIO"], ["procurement", "For Procurement"]]}
        brief={brief}
      />

      <footer className="mt-20 font-mono text-[11px] text-slate leading-relaxed max-w-2xl">
        METHODOLOGY — Waste is decomposed into shelfware (spend × unused-license
        share), redundancy (overlapping tools), and renewal leakage (uncontested
        escalation). Recovery is modeled at a conservative year-one rate because
        contract terms gate how fast identified waste converts to realized savings.
      </footer>
    </main>
  );
}
