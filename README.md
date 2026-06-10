# Aaron Cannata — Portfolio & Consulting Site

Editorial-minimal Next.js site built around live value-engineering instruments:
interactive ROI calculators that generate stakeholder-specific executive briefs.

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
```

## Deploy (Vercel)
1. Push this repo to GitHub (`aaron-cannata-portfolio`).
2. vercel.com → Add New Project → import the repo → Deploy (zero config).
3. Add your custom domain under Settings → Domains.

## Before launch
- Replace `hello@example.com` in `app/page.jsx` (two places) with your real email.
- Review the About section copy in `app/page.jsx`.

## Architecture
- `lib/model.js` — all benchmarks, calculator math, and brief templates. One file
  to audit; calculators are thin UI over it.
- `components/calculators/` — one component per instrument. To add a calculator:
  add its math to a lib file, a component here, and a page under `app/tools/`.
- Executive briefs are deterministic templates populated from the live model and
  printed via CSS (`@media print` in `globals.css`). A future upgrade can route
  the model output through the Claude API for fully narrative briefs.

## Roadmap
1. Tax Credit Stacking Tool (multi-state §45F)
2. Cost-of-Vacancy Calculator
3. Industry-specific ROI calculators (3–5) sharing the brief generator
4. Renewd.io case study page
5. Booking link + downloadable brief template (lead capture)
