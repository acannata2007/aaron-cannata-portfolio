// lib/saasModel.js
// SaaS Spend & Shelfware Model.
// Quantifies waste from unused licenses, redundant tooling, and unmanaged
// renewals, and the return on a structured spend-management practice.

export const COMPANY_SIZES = {
  smb: { label: "Under 250 employees", spendPerEmployee: 2300, utilization: 0.72, redundantShare: 0.06, renewalLeakage: 0.03 },
  midmarket: { label: "250–2,000 employees", spendPerEmployee: 3100, utilization: 0.66, redundantShare: 0.09, renewalLeakage: 0.04 },
  enterprise: { label: "2,000+ employees", spendPerEmployee: 4200, utilization: 0.6, redundantShare: 0.12, renewalLeakage: 0.05 }
};

export function runSaasModel(i) {
  const {
    employees, spendPerEmployee, utilization, redundantShare,
    renewalLeakage, programCostShare, recoveryRate
  } = i;

  const totalSpend = employees * spendPerEmployee;
  const shelfwareCost = totalSpend * (1 - utilization);
  const redundancyCost = totalSpend * redundantShare;
  const leakageCost = totalSpend * renewalLeakage;
  const totalWaste = shelfwareCost + redundancyCost + leakageCost;

  const programCost = totalSpend * programCostShare;
  const recovered = totalWaste * recoveryRate;
  const netBenefit = recovered - programCost;
  const roi = programCost > 0 ? netBenefit / programCost : null;
  const paybackMonths = recovered > 0 ? Math.max((programCost / recovered) * 12, 0) : null;
  const wastePctOfSpend = totalSpend > 0 ? totalWaste / totalSpend : 0;

  return {
    totalSpend, shelfwareCost, redundancyCost, leakageCost, totalWaste,
    wastePctOfSpend, programCost, recovered, netBenefit, roi, paybackMonths
  };
}

import { fmt } from "./fmt.js";
export { fmt };

export function buildSaasBrief(stakeholder, r, ctx) {
  const company = ctx.company || "the organization";
  const common = {
    footer: "Prepared with the SaaS Spend Model. Benchmarks reflect published utilization and redundancy medians; every assumption is overridable with SSO, expense, and contract actuals.",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  };

  if (stakeholder === "cfo") {
    return { ...common,
      title: "Financial Brief: The Recoverable Share of Software Spend",
      audience: "Prepared for Finance leadership",
      stats: [
        { label: "ANNUAL SAAS SPEND", value: fmt.usd(r.totalSpend), tone: "ink" },
        { label: "IDENTIFIED WASTE", value: fmt.usd(r.totalWaste), tone: "red" },
        { label: "YEAR-ONE RECOVERY", value: fmt.usd(r.recovered), tone: "green" },
        { label: "PAYBACK PERIOD", value: fmt.months(r.paybackMonths), tone: "green" }
      ],
      paragraphs: [
        `${company} carries an estimated ${fmt.usd(r.totalSpend)} in annual SaaS spend, of which ${fmt.usd(r.totalWaste)} (${fmt.pct(r.wastePctOfSpend)}) is recoverable waste: ${fmt.usd(r.shelfwareCost)} in unused licenses, ${fmt.usd(r.redundancyCost)} in overlapping tools, and ${fmt.usd(r.leakageCost)} in unmanaged renewal escalation.`,
        `Unlike most cost programs, this one requires no headcount action and no capability loss: the waste is, by definition, spend that produces nothing today. A structured spend-management practice at ${fmt.usd(r.programCost)} recovers ${fmt.usd(r.recovered)} in year one at a ${fmt.pct(ctx.recoveryRate)} recovery rate, with a ${fmt.months(r.paybackMonths)} payback.`,
        `Recommendation: validate utilization against SSO log-in data for the ten largest contracts first, since they typically hold 60%+ of the waste, and sequence renegotiations to the renewal calendar.`
      ]
    };
  }

  if (stakeholder === "cio") {
    return { ...common,
      title: "Technology Brief: Portfolio Rationalization Without Capability Loss",
      audience: "Prepared for IT leadership",
      stats: [
        { label: "LICENSE UTILIZATION", value: fmt.pct(ctx.utilization), tone: "red" },
        { label: "SHELFWARE COST", value: fmt.usd(r.shelfwareCost), tone: "red" },
        { label: "REDUNDANT TOOLING COST", value: fmt.usd(r.redundancyCost), tone: "red" },
        { label: "RECOVERABLE / YR", value: fmt.usd(r.recovered), tone: "green" }
      ],
      paragraphs: [
        `At ${fmt.pct(ctx.utilization)} measured utilization, ${company}'s software portfolio carries ${fmt.usd(r.shelfwareCost)} in licenses no one uses and ${fmt.usd(r.redundancyCost)} in tools that duplicate one another. Beyond cost, every redundant application is surface area: another vendor to assess, another integration to maintain, another place data lives.`,
        `Rationalization is therefore a security and architecture program that happens to pay for itself. The same SSO and access data that drives the cost model drives the consolidation roadmap.`,
        `Recommendation: rank the portfolio by spend-per-active-user rather than total spend — it surfaces the worst contracts immediately — and pair each planned elimination with a named system of record so the business sees consolidation, not subtraction.`
      ]
    };
  }

  // procurement
  return { ...common,
    title: "Procurement Brief: Turning Renewal Calendar Into Negotiating Leverage",
    audience: "Prepared for Procurement / Vendor Management",
    stats: [
      { label: "RENEWAL LEAKAGE / YR", value: fmt.usd(r.leakageCost), tone: "red" },
      { label: "TOTAL ADDRESSABLE WASTE", value: fmt.usd(r.totalWaste), tone: "red" },
      { label: "PROGRAM COST", value: fmt.usd(r.programCost), tone: "ink" },
      { label: "FIRST-YEAR ROI", value: fmt.pct(r.roi), tone: "green" }
    ],
    paragraphs: [
      `An estimated ${fmt.usd(r.leakageCost)} of ${company}'s software spend escalates each year through auto-renewals and uncontested price increases: leverage that expires the moment a renewal date passes unprepared.`,
      `Combined with shelfware and redundancy, the addressable pool is ${fmt.usd(r.totalWaste)}. Utilization data transforms every renewal conversation: a vendor facing documented 55% adoption negotiates differently than one facing a routine re-up.`,
      `Recommendation: build a rolling 120-day renewal calendar with utilization attached to each line, and route any contract above a set threshold through a brief, standardized business-case review: the model on this page, populated with that contract's actuals.`
    ]
  };
}
