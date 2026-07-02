import RoiCalculator from "./calculator";

// Unlisted per-company template. Duplicate this folder (e.g. app/rain,
// app/cursor) and customize COMPANY plus the calculator assumptions.
// noindex below keeps every copy out of search engines; never link these
// routes from the site navigation.
const COMPANY = "Your Company";

export const metadata = {
  title: `ROI Snapshot for ${COMPANY} | Aaron Cannata`,
  description: "A working ROI snapshot prepared by Aaron Cannata.",
  robots: {
    index: false,
    follow: false
  }
};

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <p className="label text-blue">Prepared for {COMPANY}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        What this could be worth, in one number
      </h1>
      <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-slate">
        Two inputs, one output. Edit the numbers to match your business and the
        model updates live. Assumptions are placeholders until we tune them
        together on a call.
      </p>

      <RoiCalculator />

      <div className="mt-16 border-t border-line pt-8">
        <p className="text-[15px] leading-relaxed text-slate">
          I am Aaron Cannata, an enterprise account executive in San Diego. I
          build models like this to give Finance a number worth signing. If the
          output above is interesting, let&apos;s pressure-test it together.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="mailto:aaroncannata@gmail.com"
            className="rounded-md bg-blue px-5 py-3 text-sm font-semibold text-white hover:bg-navy"
          >
            Email Aaron
          </a>
          <a
            href="https://www.linkedin.com/in/acannata"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-navy px-5 py-3 text-sm font-semibold hover:border-blue hover:text-blue"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </main>
  );
}
