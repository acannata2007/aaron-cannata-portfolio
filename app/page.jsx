const STATS = [
  { value: "$1M+", label: "Annual Quota" },
  { value: "18-Month", label: "Enterprise Cycles Closed" },
  { value: "$0 to $1.5M", label: "ARR Company Built and Sold" },
  { value: "15+", label: "Years in Sales" }
];

const WINS = [
  {
    company: "TSMC",
    tagline: "18-month enterprise cycle, closed from greenfield",
    challenge:
      "Greenfield territory with zero inbound support. Six stakeholders across multiple functions and Legal at one of the most demanding enterprises in the world.",
    action:
      "I self-sourced the entry point, multi-threaded every function over an 18-month cycle, and carried the deal through procurement and legal myself.",
    result: "Closed one of the largest deals in company history."
  },
  {
    company: "Anduril Industries",
    tagline: "Four-vendor RFP won from a cold start",
    challenge:
      "A four-vendor competitive RFP with no incumbent advantage and no existing relationship.",
    action:
      "I opened the account with self-sourced cold outreach, then went high and wide across the buying committee to shape the evaluation.",
    result: "Won the RFP through to selection."
  },
  {
    company: "BISSource Consulting Group",
    tagline: "Built, scaled, and sold",
    challenge: "Build a financial advisory practice from nothing.",
    action:
      "Co-founded the firm and scaled it from $0 to $1.5M ARR with a five-person team.",
    result: "Exited via a seven-figure sale in 2019."
  }
];

const EXPERIENCE = [
  {
    role: "Senior Account Executive, Enterprise",
    company: "TOOTRiS",
    dates: "Feb 2024 to Present",
    points: [
      "B2B workforce and benefits SaaS sold to HR, Total Rewards, Finance, and C-suite buyers. $50K to $150K ACV.",
      "$1M+ annual quota as a perennial top performer with consistent attainment. 27+ months tenure on a team averaging 6 months.",
      "Built a two-input financial ROI model on Bureau of Labor Statistics data that cleared Finance and Procurement."
    ]
  },
  {
    role: "Senior Sales Director",
    company: "S2W Media",
    dates: "Oct 2022 to Apr 2023",
    points: [
      "Recruited to lead a net-new B2B media and demand-generation growth initiative.",
      "Role eliminated in a company-wide reduction in force, followed by a planned family sabbatical abroad."
    ]
  },
  {
    role: "Growth Account Director",
    company: "Spiceworks Ziff Davis",
    dates: "Apr 2021 to Oct 2022",
    points: [
      "Martech/ABM platform with first- and third-party intent data sold to enterprise B2B marketing leaders.",
      "Consistent top performer multi-threading Marketing, Finance, and Procurement."
    ]
  },
  {
    role: "Sales Director",
    company: "Slashdot Media",
    dates: "May 2019 to Apr 2021",
    points: [
      "SourceForge demand-generation with Bombora intent data. Grew the customer base from under 20 to over 500 accounts.",
      "Authored the team's highest-converting outbound sequence, adopted as the standard greenfield playbook."
    ]
  },
  {
    role: "Earlier",
    company: "BISSource Consulting Group and financial services",
    dates: "2009 to 2019",
    points: [
      "Co-Founder, BISSource Consulting Group: built and sold, seven-figure exit in 2019.",
      "A decade in financial services at LPL Financial, MetLife, and Scottrade."
    ]
  }
];

const NAV = [
  { href: "#what-i-do", label: "What I Do" },
  { href: "#wins", label: "Wins" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" }
];

export default function Home() {
  return (
    <main>
      {/* NAV */}
      <nav className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="#top" className="font-bold tracking-tight">
            Aaron Cannata
          </a>
          <div className="flex items-center gap-5 text-sm font-medium text-slate sm:gap-7">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`hover:text-blue ${
                  item.href === "#contact" ? "text-blue" : "hidden sm:inline"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" className="mx-auto max-w-5xl px-6 pb-16 pt-14 sm:pt-20">
        <div className="flex flex-col-reverse items-start gap-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="label text-blue">San Diego, CA</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Aaron Cannata
            </h1>
            <p className="mt-2 text-xl font-semibold text-blue sm:text-2xl">
              Enterprise Account Executive
            </p>
            <p className="mt-5 text-lg leading-relaxed text-slate">
              I build pipeline from zero, close complex enterprise deals, and
              translate business value into numbers a CFO will sign.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/resume/Aaron_Cannata_Resume.pdf"
                download
                className="rounded-md bg-blue px-5 py-3 text-sm font-semibold text-white hover:bg-navy"
              >
                Download Resume
              </a>
              <a
                href="https://www.linkedin.com/in/acannata"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-navy px-5 py-3 text-sm font-semibold hover:border-blue hover:text-blue"
              >
                LinkedIn
              </a>
              <a
                href="mailto:aaroncannata@gmail.com"
                className="rounded-md border border-navy px-5 py-3 text-sm font-semibold hover:border-blue hover:text-blue"
              >
                Email
              </a>
            </div>
            <p className="mt-5 text-sm text-slate">
              <a href="tel:+19494227146" className="hover:text-blue">
                (949) 422-7146
              </a>
            </p>
          </div>
          {/* Headshot placeholder: replace with real photo later */}
          <div
            aria-hidden="true"
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-tint text-2xl font-bold text-slate ring-1 ring-line sm:h-40 sm:w-40 sm:text-3xl"
          >
            AC
          </div>
        </div>
      </section>

      {/* STAT BAR */}
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 px-6 py-12 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold sm:text-4xl">{s.value}</p>
              <p className="label mt-2 text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT I DO */}
      <section id="what-i-do" className="mx-auto max-w-5xl px-6 py-20">
        <p className="label text-blue">What I Do</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Two sides of the same motion
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-line p-7">
            <h3 className="text-lg font-bold">Enterprise Sales (Hunter)</h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-slate">
              <li className="border-l-2 border-blue pl-4">
                Net-new logo acquisition through self-sourced outbound.
              </li>
              <li className="border-l-2 border-blue pl-4">
                Full-cycle ownership from first touch through procurement and
                legal.
              </li>
              <li className="border-l-2 border-blue pl-4">
                Multi-threading C-suite, Finance, HR, and technical
                stakeholders.
              </li>
              <li className="border-l-2 border-blue pl-4">
                Methodologies: Challenger, Miller-Heiman, SPIN, MEDDPICC.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-line p-7">
            <h3 className="text-lg font-bold">
              Value Engineering and Enablement
            </h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-slate">
              <li className="border-l-2 border-blue pl-4">
                ROI models and CFO-ready business cases that clear Finance and
                Procurement.
              </li>
              <li className="border-l-2 border-blue pl-4">
                Built a Bureau of Labor Statistics-driven ROI calculator used to
                close enterprise logos.
              </li>
              <li className="border-l-2 border-blue pl-4">
                Authored outbound playbooks adopted across sales teams.
              </li>
              <li className="border-l-2 border-blue pl-4">
                Builds internal tools and demos with AI-assisted, agentic
                coding.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SIGNATURE WINS */}
      <section id="wins" className="border-y border-line bg-tint">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="label text-blue">Signature Wins</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Deals that tell the story
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {WINS.map((w) => (
              <div
                key={w.company}
                className="rounded-lg border border-line bg-white p-7"
              >
                <h3 className="text-lg font-bold">{w.company}</h3>
                <p className="mt-1 text-sm font-medium text-blue">
                  {w.tagline}
                </p>
                <dl className="mt-5 space-y-4 text-[15px] leading-relaxed text-slate">
                  <div>
                    <dt className="label text-navy">Challenge</dt>
                    <dd className="mt-1">{w.challenge}</dd>
                  </div>
                  <div>
                    <dt className="label text-navy">Action</dt>
                    <dd className="mt-1">{w.action}</dd>
                  </div>
                  <div>
                    <dt className="label text-navy">Result</dt>
                    <dd className="mt-1 font-medium text-navy">{w.result}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="mx-auto max-w-5xl px-6 py-20">
        <p className="label text-blue">Experience</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Where I have carried the number
        </h2>
        <div className="mt-10 space-y-10">
          {EXPERIENCE.map((job) => (
            <div
              key={`${job.role}-${job.company}`}
              className="border-t border-line pt-7"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-lg font-bold">
                  {job.role}{" "}
                  <span className="font-medium text-slate">
                    | {job.company}
                  </span>
                </h3>
                <p className="label text-slate">{job.dates}</p>
              </div>
              <ul className="mt-3 max-w-3xl space-y-2 text-[15px] leading-relaxed text-slate">
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* I BUILD WITH AI */}
      <section id="ai" className="border-y border-line bg-tint">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="label text-blue">I Build With AI</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            A seller who ships
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-[17px] leading-relaxed text-slate">
            <p>
              I shipped Renewd.io, a customer success platform built from
              scratch using AI-assisted, agentic coding.
            </p>
            <p>
              I use AI daily across account research, discovery prep, and
              pipeline workflow. No hype: it is a tool, and I know how to work
              it.
            </p>
          </div>
        </div>
      </section>

      {/* EDUCATION AND TOOLKIT */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-12 sm:grid-cols-2">
          <div>
            <p className="label text-blue">Education</p>
            <p className="mt-3 text-lg font-bold">BA Economics</p>
            <p className="text-[15px] text-slate">UC Santa Cruz</p>
          </div>
          <div>
            <p className="label text-blue">Toolkit</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Salesforce", "Outreach", "LinkedIn Sales Navigator"].map(
                (tool) => (
                  <span
                    key={tool}
                    className="rounded-md border border-line bg-tint px-3 py-1.5 text-sm font-medium text-navy"
                  >
                    {tool}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER / CTA */}
      <footer id="contact" className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight">
            Open to enterprise AE and value-engineering conversations.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:aaroncannata@gmail.com"
              className="rounded-md bg-blue px-5 py-3 text-sm font-semibold text-white hover:bg-white hover:text-navy"
            >
              aaroncannata@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/acannata"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/40 px-5 py-3 text-sm font-semibold hover:border-white"
            >
              LinkedIn
            </a>
            <a
              href="tel:+19494227146"
              className="rounded-md border border-white/40 px-5 py-3 text-sm font-semibold hover:border-white"
            >
              (949) 422-7146
            </a>
          </div>
          <p className="mt-14 text-sm text-white/50">
            This site was designed and shipped by me, with AI as my pair
            programmer.
          </p>
        </div>
      </footer>
    </main>
  );
}
