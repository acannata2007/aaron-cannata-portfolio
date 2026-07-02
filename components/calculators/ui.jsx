"use client";
import Link from "next/link";

// Functional colors for model output: blue for benefit, a single restrained
// red reserved for cost and exposure figures.
const TONE = {
  ink: "text-navy",
  green: "text-blue",
  red: "text-[#B91C1C]"
};

export function CalcNav({ index }) {
  return (
    <nav className="flex items-baseline justify-between py-6">
      <Link href="/" className="text-sm font-semibold text-slate hover:text-blue">
        &larr; Back to home
      </Link>
      <span className="label text-blue">Live Model {index}</span>
    </nav>
  );
}

export function PageHeader({ eyebrow, title, description }) {
  return (
    <header className="mt-6 max-w-3xl">
      <p className="label text-blue">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate">{description}</p>
    </header>
  );
}

export function Field({ label, suffix, value, onChange, step = 1, min = 0, max, pct }) {
  return (
    <label className="block">
      <span className="label text-navy">{label}</span>
      <div className="mt-2 flex items-baseline gap-2">
        <input
          type="number"
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-lg font-semibold tabular-nums text-navy outline-none focus:border-blue"
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
        {suffix && <span className="text-sm font-medium text-slate">{suffix}</span>}
      </div>
    </label>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="label text-navy">{label}</span>
      <select
        className="mt-2 w-full appearance-none rounded-md border border-line bg-white px-3 py-2 text-lg font-semibold text-navy outline-none focus:border-blue"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(([k, labelText]) => (
          <option key={k} value={k}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}

// The site's stat-callout pattern: small all-caps label above, large bold
// number, optional short italic descriptor below.
export function Stat({ label, value, tone = "ink", desc, size = "md" }) {
  const valueSize =
    size === "lg" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl";
  return (
    <div>
      <p className="label text-slate">{label}</p>
      <p className={`mt-2 font-bold tabular-nums tracking-tight ${valueSize} ${TONE[tone] || TONE.ink}`}>
        {value}
      </p>
      {desc && <p className="mt-1.5 text-sm italic leading-snug text-slate">{desc}</p>}
    </div>
  );
}

// The dominant headline metric for a results section.
export function Headline({ label, value, desc }) {
  return (
    <div>
      <p className="label text-slate">{label}</p>
      <p className="mt-2 text-5xl font-bold tabular-nums tracking-tight text-blue sm:text-6xl">
        {value}
      </p>
      {desc && <p className="mt-3 text-sm italic text-slate">{desc}</p>}
    </div>
  );
}

export function BriefGenerator({ company, setCompany, stakeholder, setStakeholder, options, brief }) {
  return (
    <section className="mt-16 border-t border-line pt-12">
      <p className="label text-blue">Executive Brief Generator</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Same model, three audiences.
      </h2>
      <p className="mb-8 mt-3 max-w-xl text-[15px] leading-relaxed text-slate">
        A number only moves a decision when it is framed for the person who owns
        it. Pick the stakeholder; the brief writes itself from the live model
        above. Print or save it as a PDF.
      </p>
      <div className="no-print mb-4 flex flex-wrap gap-3">
        <input
          placeholder="Company name (optional)"
          className="w-56 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-navy outline-none focus:border-blue"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div className="no-print flex flex-wrap gap-3">
        {options.map(([k, label]) => (
          <button
            key={k}
            onClick={() => setStakeholder(k)}
            className={`rounded-md border px-5 py-3 text-sm font-semibold ${
              stakeholder === k
                ? "border-navy bg-navy text-white"
                : "border-navy text-navy hover:border-blue hover:text-blue"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {brief && (
        <article
          id="brief-doc"
          className="mt-10 max-w-3xl rounded-lg border border-line bg-white p-8 shadow-sm sm:p-12"
        >
          <div className="mb-1 flex items-baseline justify-between">
            <p className="label text-blue">Executive Brief</p>
            <p className="text-xs text-slate">{brief.date}</p>
          </div>
          <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{brief.title}</h3>
          <p className="label mb-8 mt-2 text-slate">{brief.audience}</p>
          <div className="mb-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-6">
            {brief.stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
          <div className="space-y-4 text-[14px] leading-relaxed text-navy">
            {brief.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="mt-10 border-t border-line pt-4 text-xs leading-relaxed text-slate">
            {brief.footer}
          </p>
          <button
            onClick={() => window.print()}
            className="no-print mt-8 rounded-md bg-blue px-5 py-3 text-sm font-semibold text-white hover:bg-navy"
          >
            Print / Save as PDF
          </button>
        </article>
      )}
    </section>
  );
}
