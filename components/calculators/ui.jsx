"use client";
import Link from "next/link";

export function Field({ label, suffix, value, onChange, step = 1, min = 0, max, pct }) {
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

export function Stat({ label, value, tone = "ink" }) {
  const color =
    tone === "green" ? "text-green" : tone === "red" ? "text-[#A02C2C]" : "text-ink";
  return (
    <div className="hairline-top pt-3">
      <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-slate">{label}</p>
      <p className={`font-mono text-2xl sm:text-3xl mt-1 ${color}`}>{value}</p>
    </div>
  );
}

export function CalcNav({ index }) {
  return (
    <nav className="flex items-baseline justify-between py-8">
      <Link href="/" className="font-serif text-xl hover:text-green">← Aaron Cannata</Link>
      <span className="font-mono text-[11px] tracking-widest uppercase text-green">
        Live model {index}
      </span>
    </nav>
  );
}

export function HeroBand({ items }) {
  return (
    <section className="bg-ink text-paper p-8 grid sm:grid-cols-3 gap-8 mb-16">
      {items.map((it) => (
        <div key={it.label}>
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-paper/60">
            {it.label}
          </p>
          <p className={`font-mono text-4xl mt-2 ${it.green ? "text-green" : ""}`}>
            {it.value}
          </p>
        </div>
      ))}
    </section>
  );
}

export function BriefGenerator({ company, setCompany, stakeholder, setStakeholder, options, brief }) {
  return (
    <section className="hairline-top pt-12">
      <p className="eyebrow mb-3">Executive brief generator</p>
      <h2 className="font-serif text-3xl mb-2">Same model, three audiences.</h2>
      <p className="text-slate text-[15px] max-w-xl mb-8">
        A number only moves a decision when it&rsquo;s framed for the person who owns
        it. Pick the stakeholder; the brief writes itself from the live model above.
        Print or save it as a PDF.
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
        {options.map(([k, label]) => (
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
        <article id="brief-doc" className="mt-10 border border-hairline bg-white p-8 sm:p-12 max-w-3xl shadow-sm">
          <div className="flex items-baseline justify-between mb-1">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-green">Executive brief</p>
            <p className="font-mono text-[10px] text-slate">{brief.date}</p>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl mt-3">{brief.title}</h3>
          <p className="font-mono text-[11px] uppercase tracking-wider text-slate mt-1 mb-8">{brief.audience}</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8">
            {brief.stats.map((s) => (<Stat key={s.label} {...s} />))}
          </div>
          <div className="space-y-4 text-[14px] leading-relaxed text-ink">
            {brief.paragraphs.map((p, i) => (<p key={i}>{p}</p>))}
          </div>
          <p className="font-mono text-[10px] text-slate mt-10 hairline-top pt-4 leading-relaxed">{brief.footer}</p>
          <button
            onClick={() => window.print()}
            className="no-print mt-8 bg-green text-paper font-mono text-[12px] tracking-wider uppercase px-5 py-3 hover:bg-ink transition-colors"
          >
            Print / save as PDF
          </button>
        </article>
      )}
    </section>
  );
}
