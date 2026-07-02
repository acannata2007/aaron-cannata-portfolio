// lib/salesModel.js
// Sales Productivity & Rep Turnover Model.
// Quantifies the revenue exposure created by rep attrition, backfill vacancy,
// and ramp time, and the return on retention/enablement investment.

export const SEGMENTS = {
  smb: { label: "SMB / Velocity", quota: 600000, attainment: 0.7, turnover: 0.34, vacancyMonths: 2.5, rampMonths: 4, rampProductivity: 0.5, hiringCost: 15000 },
  midmarket: { label: "Mid-Market", quota: 900000, attainment: 0.68, turnover: 0.3, vacancyMonths: 3, rampMonths: 6, rampProductivity: 0.5, hiringCost: 25000 },
  enterprise: { label: "Enterprise", quota: 1500000, attainment: 0.62, turnover: 0.25, vacancyMonths: 4, rampMonths: 9, rampProductivity: 0.4, hiringCost: 40000 }
};

export function runSalesModel(i) {
  const {
    reps, quota, attainment, turnover, vacancyMonths, rampMonths,
    rampProductivity, hiringCost, programCostPerRep, mitigation, grossMargin
  } = i;

  const productiveRevPerRep = quota * attainment;
  const exits = reps * turnover;

  const vacancyLossPerExit = productiveRevPerRep * (vacancyMonths / 12);
  const rampLossPerExit = productiveRevPerRep * (1 - rampProductivity) * (rampMonths / 12);
  const revLossPerExit = vacancyLossPerExit + rampLossPerExit;

  const revenueExposure = exits * revLossPerExit;
  const replacementCost = exits * hiringCost;
  const totalExposure = revenueExposure + replacementCost;

  const programCost = reps * programCostPerRep;
  const recoveredRevenue = revenueExposure * mitigation;
  const recoveredMargin = recoveredRevenue * grossMargin + replacementCost * mitigation;
  const netBenefit = recoveredMargin - programCost;
  const roi = programCost > 0 ? netBenefit / programCost : null;
  const paybackMonths = recoveredMargin > 0 ? Math.max((programCost / recoveredMargin) * 12, 0) : null;

  return {
    exits, revLossPerExit, vacancyLossPerExit, rampLossPerExit,
    revenueExposure, replacementCost, totalExposure,
    programCost, recoveredRevenue, recoveredMargin, netBenefit, roi, paybackMonths
  };
}

import { fmt } from "./fmt.js";
export { fmt };

export function buildSalesBrief(stakeholder, r, ctx) {
  const company = ctx.company || "the organization";
  const common = {
    footer: "Prepared with the Sales Productivity Model. Segment benchmarks are conservative medians; every assumption is overridable with CRM and HRIS actuals for board-grade output.",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  };

  if (stakeholder === "cro") {
    return { ...common,
      title: "Revenue Brief: The Quota Coverage Cost of Rep Turnover",
      audience: "Prepared for the CRO / Head of Sales",
      stats: [
        { label: "REP EXITS / YR", value: fmt.num(r.exits), tone: "red" },
        { label: "REVENUE EXPOSURE / YR", value: fmt.usd(r.revenueExposure), tone: "red" },
        { label: "LOSS PER DEPARTED REP", value: fmt.usd(r.revLossPerExit), tone: "ink" },
        { label: "RECOVERABLE REVENUE", value: fmt.usd(r.recoveredRevenue), tone: "green" }
      ],
      paragraphs: [
        `At current turnover, ${company} loses ${fmt.num(r.exits)} quota-carrying reps per year. Each departure removes ${fmt.usd(r.revLossPerExit)} in productive revenue: ${fmt.usd(r.vacancyLossPerExit)} while the seat sits empty and ${fmt.usd(r.rampLossPerExit)} while the replacement ramps below full productivity.`,
        `The aggregate revenue exposure is ${fmt.usd(r.revenueExposure)} per year: capacity the plan assumes but the floor never delivers. This is why coverage models that look healthy in January miss in Q3: the plan counts seats, not productive months.`,
        `A retention and ramp-acceleration investment of ${fmt.usd(r.programCost)} modeled at ${fmt.pct(ctx.mitigation)} exposure recovery returns ${fmt.usd(r.recoveredRevenue)} in revenue. Recommendation: validate turnover and ramp inputs against the last 8 quarters of CRM data, then segment by tenure band. The exposure is rarely uniform across the org.`
      ]
    };
  }

  if (stakeholder === "cfo") {
    return { ...common,
      title: "Financial Brief: Sales Attrition as a P&L Line Item",
      audience: "Prepared for Finance leadership",
      stats: [
        { label: "TOTAL ANNUAL EXPOSURE", value: fmt.usd(r.totalExposure), tone: "red" },
        { label: "PROGRAM COST", value: fmt.usd(r.programCost), tone: "ink" },
        { label: "FIRST-YEAR NET BENEFIT (MARGIN BASIS)", value: fmt.usd(r.netBenefit), tone: "green" },
        { label: "PAYBACK PERIOD", value: fmt.months(r.paybackMonths), tone: "green" }
      ],
      paragraphs: [
        `Sales attrition at ${company} carries a total annual exposure of ${fmt.usd(r.totalExposure)}: ${fmt.usd(r.revenueExposure)} in unproduced revenue plus ${fmt.usd(r.replacementCost)} in direct replacement cost. None of it appears as a line item; all of it lands in the variance between plan and actual.`,
        `Modeled at ${fmt.pct(ctx.grossMargin)} gross margin and ${fmt.pct(ctx.mitigation)} recovery, a ${fmt.usd(r.programCost)} retention and enablement investment yields ${fmt.usd(r.netBenefit)} in first-year net benefit with a ${fmt.months(r.paybackMonths)} payback, evaluated on margin, not revenue, so the case survives finance scrutiny.`,
        `Recommendation: treat rep attrition the way the business treats churn: a measured rate with an owner and a target. The model's two highest-sensitivity inputs (turnover rate and ramp months) are both verifiable from existing systems in under a week.`
      ]
    };
  }

  // revops
  return { ...common,
    title: "Operations Brief: Ramp Time Is the Hidden Capacity Lever",
    audience: "Prepared for RevOps / Sales Enablement leadership",
    stats: [
      { label: "RAMP LOSS PER HIRE", value: fmt.usd(r.rampLossPerExit), tone: "red" },
      { label: "VACANCY LOSS PER EXIT", value: fmt.usd(r.vacancyLossPerExit), tone: "red" },
      { label: "ANNUAL REVENUE EXPOSURE", value: fmt.usd(r.revenueExposure), tone: "red" },
      { label: "FIRST-YEAR ROI", value: fmt.pct(r.roi), tone: "green" }
    ],
    paragraphs: [
      `Every backfilled seat at ${company} costs ${fmt.usd(r.revLossPerExit)} in unproduced revenue, and the larger share is often the ramp, not the vacancy. At ${ctx.rampMonths} months to full productivity, each new hire forfeits ${fmt.usd(r.rampLossPerExit)} relative to a fully ramped rep.`,
      `This makes ramp compression the highest-leverage enablement metric in the model: shortening ramp by a single month is worth ${fmt.usd((r.rampLossPerExit / ctx.rampMonths) * r.exits)} annually at current attrition, before any retention improvement.`,
      `Recommendation: instrument ramp as a measured curve (time to first deal, time to 50% and 100% attainment) rather than a fixed onboarding period, and re-run this model quarterly with actuals. The deltas become the enablement team's business case.`
    ]
  };
}
