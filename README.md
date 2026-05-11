keep.it.inyoureyes is a high-end digital editorial portfolio built with Next.js App Router, TypeScript, Tailwind CSS, GSAP, and Lenis.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- GSAP
- Lenis
- Local fonts via `next/font/local`

## Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The homepage lives in `src/components/templates/home-page.tsx` and is composed from a simplified Atomic Design structure under `src/components`.

## Motion

GSAP drives the intro and reveal animations. Lenis handles smooth scrolling at the app shell level.

## Fonts

The project uses local font files from `@fontsource/inter` and `@fontsource/playfair-display` through `next/font/local`.

## Notes

If you want to replace the font styling later, update the local font paths in `src/app/layout.tsx`.
