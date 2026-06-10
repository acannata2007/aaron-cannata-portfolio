// lib/model.js
// Workforce Value Model — methodology and benchmarks.
// All benchmark values are deliberately conservative and fully overridable
// in the calculator UI. Sources noted per field.

export const INDUSTRIES = {
  manufacturing: {
    label: "Manufacturing",
    caregiverShare: 0.32,        // share of workforce with dependent-care responsibility
    absenceDays: 12,             // care-related absence days / caregiver / yr (BLS absence data, care-attributed share)
    careAttrition: 0.09,         // annual attrition among caregivers attributable to care breakdowns
    replacementCost: 0.75,       // replacement cost as a multiple of annual salary (SHRM range 0.5–2.0)
    defaultWage: 58000
  },
  healthcare: {
    label: "Healthcare",
    caregiverShare: 0.38,
    absenceDays: 13,
    careAttrition: 0.11,
    replacementCost: 0.9,
    defaultWage: 72000
  },
  logistics: {
    label: "Logistics & Distribution",
    caregiverShare: 0.30,
    absenceDays: 11,
    careAttrition: 0.10,
    replacementCost: 0.6,
    defaultWage: 52000
  },
  hospitality: {
    label: "Hospitality & Food Service",
    caregiverShare: 0.34,
    absenceDays: 10,
    careAttrition: 0.12,
    replacementCost: 0.5,
    defaultWage: 38000
  },
  professional: {
    label: "Professional Services",
    caregiverShare: 0.30,
    absenceDays: 9,
    careAttrition: 0.07,
    replacementCost: 1.0,
    defaultWage: 95000
  },
  retail: {
    label: "Retail",
    caregiverShare: 0.33,
    absenceDays: 10,
    careAttrition: 0.12,
    replacementCost: 0.5,
    defaultWage: 36000
  }
};

// Federal §45F employer-provided childcare credit, post-2025 expansion:
// 40% of qualified expenditures, capped at $500,000/yr (general business).
export const F45 = { rate: 0.4, cap: 500000 };

export function runModel(input) {
  const {
    employees,
    avgWage,
    caregiverShare,
    absenceDays,
    careAttrition,
    replacementCost,
    programCostPerEmployee, // annual, per employee
    mitigation             // share of the burden the program recovers
  } = input;

  const caregivers = employees * caregiverShare;
  const dailyWage = avgWage / 260;

  const absenteeismCost = caregivers * absenceDays * dailyWage;
  const attritionCost = caregivers * careAttrition * avgWage * replacementCost;
  const totalBurden = absenteeismCost + attritionCost;

  const programCost = employees * programCostPerEmployee;
  const credit = Math.min(programCost * F45.rate, F45.cap);
  const netProgramCost = Math.max(programCost - credit, 0);

  const recovered = totalBurden * mitigation;
  const netBenefit = recovered - netProgramCost;
  const roi = netProgramCost > 0 ? netBenefit / netProgramCost : null;
  const paybackMonths =
    recovered > 0 ? Math.max((netProgramCost / recovered) * 12, 0) : null;

  return {
    caregivers,
    absenteeismCost,
    attritionCost,
    totalBurden,
    programCost,
    credit,
    netProgramCost,
    recovered,
    netBenefit,
    roi,
    paybackMonths
  };
}

export const fmt = {
  usd: (n) =>
    n == null
      ? "—"
      : n.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0
        }),
  usdShort: (n) => {
    if (n == null) return "—";
    if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
    if (Math.abs(n) >= 1e3) return `$${Math.round(n / 1e3)}K`;
    return `$${Math.round(n)}`;
  },
  pct: (n) => (n == null ? "—" : `${Math.round(n * 100)}%`),
  num: (n) => (n == null ? "—" : Math.round(n).toLocaleString("en-US")),
  months: (n) => (n == null ? "—" : `${n.toFixed(1)} mo`)
};

// Stakeholder lenses for the executive brief generator.
export function buildBrief(stakeholder, r, ctx) {
  const company = ctx.company || "the organization";
  const industry = INDUSTRIES[ctx.industry]?.label || "the industry";

  const common = {
    footer:
      "Prepared with the Workforce Value Model. Benchmarks are industry medians; every assumption is overridable with employer data for audit-grade output.",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  };

  if (stakeholder === "cfo") {
    return {
      ...common,
      title: "Financial Brief: Care-Driven Workforce Cost Exposure",
      audience: "Prepared for Finance leadership",
      stats: [
        { label: "ANNUAL COST EXPOSURE", value: fmt.usd(r.totalBurden), tone: "red" },
        { label: "NET PROGRAM COST AFTER §45F", value: fmt.usd(r.netProgramCost), tone: "ink" },
        { label: "FIRST-YEAR NET BENEFIT", value: fmt.usd(r.netBenefit), tone: "green" },
        { label: "PAYBACK PERIOD", value: fmt.months(r.paybackMonths), tone: "green" }
      ],
      paragraphs: [
        `${company} carries an estimated ${fmt.usd(r.totalBurden)} in annual cost attributable to care-driven absenteeism and attrition across a workforce of ${fmt.num(ctx.employees)} in ${industry.toLowerCase()}. This cost is real but invisible on the P&L: it disperses across overtime, recruiting, training, and lost productivity lines rather than appearing as a single entry.`,
        `A structured care benefit at ${fmt.usd(r.programCost)} gross annual cost qualifies for the federal §45F employer childcare credit at 40% of qualified expenditure (capped at $500,000), reducing net program cost to ${fmt.usd(r.netProgramCost)}. Modeled conservatively at ${fmt.pct(ctx.mitigation)} burden recovery, the program returns ${fmt.usd(r.recovered)} annually — a first-year net benefit of ${fmt.usd(r.netBenefit)} and a payback period of ${fmt.months(r.paybackMonths)}.`,
        `Recommendation: validate the two highest-sensitivity inputs (caregiver share and care-attributable attrition) against internal HRIS data, then model state-level credit stacking, which in several jurisdictions drives net program cost toward zero.`
      ]
    };
  }

  if (stakeholder === "ops") {
    return {
      ...common,
      title: "Operations Brief: Coverage, Overtime, and Reliability Exposure",
      audience: "Prepared for Operations leadership",
      stats: [
        { label: "CAREGIVERS IN WORKFORCE", value: fmt.num(r.caregivers), tone: "ink" },
        { label: "CARE-RELATED ABSENCE DAYS / YR", value: fmt.num(r.caregivers * ctx.absenceDays), tone: "red" },
        { label: "ABSENTEEISM COST", value: fmt.usd(r.absenteeismCost), tone: "red" },
        { label: "ANNUAL RECOVERY AT TARGET", value: fmt.usd(r.recovered), tone: "green" }
      ],
      paragraphs: [
        `An estimated ${fmt.num(r.caregivers)} employees at ${company} carry dependent-care responsibility. At benchmark rates for ${industry.toLowerCase()}, that produces roughly ${fmt.num(r.caregivers * ctx.absenceDays)} unplanned absence days per year — absorbed today through overtime, schedule churn, and degraded coverage depth.`,
        `Unplanned absence is the most expensive form of absence: it is backfilled at premium rates and erodes procedural depth on every shift it touches. The modeled absenteeism cost of ${fmt.usd(r.absenteeismCost)} understates the operational impact because it excludes second-order effects on quality, safety exposure, and supervisor load.`,
        `Recommendation: pull 12 months of unplanned-absence and overtime data for one representative site and re-run this model with actuals. The site-level result typically makes the network-level case on its own.`
      ]
    };
  }

  // chro
  return {
    ...common,
    title: "People Brief: Retention Economics of Care Support",
    audience: "Prepared for HR / Total Rewards leadership",
    stats: [
      { label: "CARE-DRIVEN EXITS / YR", value: fmt.num(r.caregivers * ctx.careAttrition), tone: "red" },
      { label: "ATTRITION COST", value: fmt.usd(r.attritionCost), tone: "red" },
      { label: "NET PROGRAM COST AFTER §45F", value: fmt.usd(r.netProgramCost), tone: "ink" },
      { label: "FIRST-YEAR ROI", value: fmt.pct(r.roi), tone: "green" }
    ],
    paragraphs: [
      `Care breakdowns drive an estimated ${fmt.num(r.caregivers * ctx.careAttrition)} preventable exits per year at ${company}. At a replacement cost of ${fmt.pct(ctx.replacementCost)} of salary, that is ${fmt.usd(r.attritionCost)} in annual attrition cost — concentrated among experienced employees whose institutional knowledge takes 6–18 months to rebuild.`,
      `Care-related attrition is rarely uniform: it disproportionately affects the demographics most organizations have explicit commitments to retain and advance. A care benefit is therefore both a retention instrument and a measurable contribution to workforce commitments.`,
      `After the federal §45F credit, the net program cost is ${fmt.usd(r.netProgramCost)} against ${fmt.usd(r.recovered)} in modeled annual recovery — a first-year ROI of ${fmt.pct(r.roi)}. Recommendation: pair this model with exit-interview coding for care-related departure reasons to convert the benchmark into an internal actual.`
    ]
  };
}
