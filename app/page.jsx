import Link from "next/link";
import HeroModel from "@/components/HeroModel";

const TOOLS = [
  {
    href: "/tools/workforce-roi",
    name: "Workforce ROI Calculator",
    desc: "The full cost of care-driven absenteeism and attrition, net of the federal \u00a745F credit \u2014 with executive briefs for Finance, Operations, and HR.",
    status: "LIVE"
  },
  {
    href: "/tools/sales-productivity",
    name: "Sales Productivity Model",
    desc: "What rep turnover, empty seats, and ramp time cost a revenue plan \u2014 with briefs written for the CRO, the CFO, and RevOps.",
    status: "LIVE"
  },
  {
    href: "/tools/saas-spend",
    name: "SaaS Spend Model",
    desc: "Shelfware, redundant tooling, and renewal leakage, sized from two inputs \u2014 with briefs for the CFO, the CIO, and Procurement.",
    status: "LIVE"
  },
  {
    href: "#contact",
    name: "Tax Credit Stacking Tool",
    desc: "Multi-jurisdictional model stacking federal \u00a745F with state-level employer credits to drive net program cost toward zero.",
    status: "IN BUILD"
  },
  {
    href: "#contact",
    name: "Cost-of-Vacancy Calculator",
    desc: "What every open requisition costs per day in lost output, overtime backfill, and team drag \u2014 by role and industry.",
    status: "IN BUILD"
  }
];

const SERVICES = [
  {
    name: "Business case development",
    desc: "I take a complex investment decision — a benefit program, a platform purchase, a workforce initiative — and build the financial case that survives a CFO's scrutiny: model, sensitivity analysis, and a one-page brief per stakeholder."
  },
  {
    name: "Interactive ROI tools",
    desc: "Custom calculators your sales or finance team can put in front of a buyer or a board. Benchmarked defaults for speed, every assumption overridable for credibility."
  },
  {
    name: "Tax-advantaged program design",
    desc: "Modeling federal and state credit stacking (§45F and successors) so the net cost of a program is what gets presented — not the sticker price."
  },
  {
    name: "Fractional value engineering",
    desc: "Embedded support for sales teams selling complex, multi-stakeholder deals: discovery frameworks, deal-specific models, and executive-ready collateral."
  }
];

export default function Home() {
  return (
    <main>
      {/* NAV */}
      <nav className="flex items-baseline justify-between px-6 sm:px-12 py-8 max-w-6xl mx-auto">
        <span className="font-serif text-xl">Aaron Cannata</span>
        <div className="flex gap-6 font-mono text-[12px] tracking-wider uppercase">
          <a href="#work" className="hover:text-green">Tools</a>
          <a href="#services" className="hover:text-green">Services</a>
          <a href="#about" className="hover:text-green">About</a>
          <a href="#contact" className="text-green">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto pt-16 pb-24">
        <p className="eyebrow mb-8">Value engineering · Business cases · ROI instrumentation</p>
        <HeroModel />
        
      </section>

      {/* TOOLS */}
      <section id="work" className="hairline-top px-6 sm:px-12 py-20 max-w-6xl mx-auto">
        <p className="eyebrow mb-3">Working instruments</p>
        <h2 className="font-serif text-3xl sm:text-4xl mb-12 max-w-2xl">
          Not screenshots of past work. Live models you can interrogate.
        </h2>
        <div className="space-y-0">
          {TOOLS.map((t) => (
            <Link
              key={t.name}
              href={t.href}
              className="group hairline-top grid sm:grid-cols-[1fr_2fr_auto] gap-2 sm:gap-8 py-7 items-baseline hover:bg-tint transition-colors px-2 -mx-2"
            >
              <span className="font-serif text-xl group-hover:text-green transition-colors">
                {t.name}
              </span>
              <span className="text-slate text-[15px] leading-relaxed">{t.desc}</span>
              <span
                className={`font-mono text-[11px] tracking-widest ${
                  t.status === "LIVE" ? "text-green" : "text-slate"
                }`}
              >
                {t.status}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="hairline-top px-6 sm:px-12 py-20 max-w-6xl mx-auto">
        <p className="eyebrow mb-3">Services</p>
        <h2 className="font-serif text-3xl sm:text-4xl mb-12 max-w-2xl">
          The work between &ldquo;interesting&rdquo; and &ldquo;approved.&rdquo;
        </h2>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
          {SERVICES.map((s) => (
            <div key={s.name} className="hairline-top pt-5">
              <h3 className="font-serif text-xl mb-2">{s.name}</h3>
              <p className="text-slate text-[15px] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="hairline-top px-6 sm:px-12 py-20 max-w-6xl mx-auto">
        <p className="eyebrow mb-3">About</p>
        <div className="grid sm:grid-cols-[2fr_1fr] gap-12">
          <div className="space-y-5 text-[17px] leading-relaxed max-w-2xl">
            <p>
              I specialize in translating complex financial and operational data into
              C-suite business cases — ROI models, tax-optimized cost analyses, and
              executive briefs that help Finance, Operations, and HR leaders make the
              case for strategic investments.
            </p>
            <p className="text-slate">
              The foundation is a decade in financial services — multi-generational
              planning for ultra-high-net-worth families at LPL, MetLife, and
              Scottrade — followed by enterprise sales of workforce programs, where I
              built the modeling tools my own deals ran on: BLS-integrated ROI
              calculators, multi-state tax credit frameworks, and CFO-ready briefs
              that turned a benefits conversation into a margin conversation.
            </p>
            <p className="text-slate">
              I also build software. Renewd.io — a SaaS product I designed and
              shipped — is the same discipline applied to product: find the economic
              core of a problem, instrument it, make it legible.
            </p>
          </div>
          <div className="font-mono text-[12px] space-y-3 text-slate">
            <p className="hairline-top pt-3">SAN DIEGO, CA</p>
            <p className="hairline-top pt-3">UC SANTA CRUZ</p>
            <p className="hairline-top pt-3">SERIES-LICENSED FINANCIAL BACKGROUND</p>
            <p className="hairline-top pt-3">10K+ LINKEDIN AUDIENCE</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="hairline-top bg-ink text-paper px-6 sm:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="eyebrow mb-3">Start a conversation</p>
          <h2 className="font-serif text-3xl sm:text-4xl mb-6 max-w-2xl">
            Have a deal, a program, or a decision that needs a number on it?
          </h2>
          <p className="text-paper/70 max-w-xl mb-10 text-[15px] leading-relaxed">
            The fastest way to see if this is a fit: send the decision you&rsquo;re
            trying to make and who has to approve it. I&rsquo;ll tell you what the
            model would look like.
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-block bg-green text-paper font-mono text-[13px] tracking-wider uppercase px-6 py-3 hover:bg-paper hover:text-ink transition-colors"
          >
            hello@example.com
          </a>
          <p className="font-mono text-[11px] text-paper/40 mt-16 tracking-wider">
            © {new Date().getFullYear()} AARON CANNATA · BUILT BY HAND, MODELED IN PUBLIC
          </p>
        </div>
      </section>
    </main>
  );
}
