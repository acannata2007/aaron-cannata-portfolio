# aaroncannata.com

Personal resume and portfolio site for Aaron Cannata, enterprise account executive. Next.js 14 (App Router) + Tailwind CSS, deployed on Vercel with auto-deploy from `main`.

## Structure

- `app/page.jsx`: the single-page site (hero, stat bar, what I do, signature wins, experience, AI, education, contact).
- `app/demo/`: unlisted per-company ROI page template. It carries a `noindex` robots tag and is never linked from navigation. To create a company page, copy the folder (e.g. `app/rain/`), then edit `COMPANY` in `page.jsx` and the assumptions in `calculator.jsx`.
- `public/resume/Aaron_Cannata_Resume.pdf`: the downloadable resume. Replace the placeholder with the real file.

## Commands

```bash
npm run dev     # local dev at http://localhost:3000
npm run build   # production build
```

## Style rules

- No em-dashes anywhere in copy. Use commas, colons, or periods.
- No stock photos, no animation gimmicks. Typography and stat callouts carry the design.
