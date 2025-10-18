# PromptCraft — Ready-to-deploy React App

This is a minimal React app prepared for quick deployment to Vercel.

Features:
- PromptCraft component (Prompt generator)
- TailwindCSS-ready setup (you still need to run Tailwind build steps locally / Vercel will use postcss)
- Light/Dark theme toggle
- Bilingual UI (English / Indonesian)

How to deploy on Vercel:
1. Upload this repository to GitHub (or skip and use Vercel import).
2. Import project into Vercel and configure build command `npm run build` and output directory `build`.
3. Vercel will run `npm install` and `npm run build` automatically.

Local commands:
- `npm install`
- `npm start` (development)
- `npm run build` (production)

