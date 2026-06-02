<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This repo uses Next.js 16 with App Router, React 19, TypeScript, Tailwind CSS 4, GSAP, Lenis, and local font loading. Before using unfamiliar Next APIs, read the relevant guide in `node_modules/next/dist/docs/` and follow deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Instructions

This is a high-end editorial portfolio site for keep.it.inyoureyes. The codebase is intentionally motion-heavy and typography-driven, so changes should preserve the polished, minimal, and cinematic feel of the current design.

## Working Rules

- Prefer small, focused changes that fit the existing structure instead of introducing new architecture.
- Reuse the current component split under `src/components/common`, `src/components/layout`, `src/components/providers`, and `src/components/sections`.
- Keep App Router conventions intact: route files live in `src/app`, with `src/app/layout.tsx` as the root shell and `src/app/page.tsx` as the homepage entry.
- Preserve existing motion behavior. GSAP and Lenis are already wired into the app shell and shared helpers; do not add another animation system.
- Keep typography intentional. The project uses locally loaded fonts and custom font variables, so do not replace them with default system fonts.
- Prefer Tailwind utilities for component styling and use global CSS only for shared tokens, resets, and cross-cutting component styles.

## Repository Shape

- `src/app` contains route entry points, metadata, and font setup.
- `src/components/sections` contains the main homepage sections.
- `src/components/layout` contains the page shell, navbar, footer, and related layout pieces.
- `src/components/common` contains reusable UI primitives and overlays.
- `src/lib` contains shared helpers such as the GSAP wrapper.
- `src/styles` contains the global CSS layers, tokens, and component stylesheet imports.
- `src/constants` and `src/data` hold content and configuration.

## Code Style

- Use TypeScript for all new code and keep props explicitly typed.
- Match the existing export style in nearby files: pages often use default exports, while reusable components usually use named exports.
- Follow the current path alias convention with `@/` imports.
- Keep client components client-only and avoid turning server components into client components unless there is a clear need.
- Keep comments brief and only for non-obvious logic.

## UI and Motion

- Match the current editorial style: strong typography, tight spacing, deliberate contrast, and visually expressive motion.
- When editing motion flows, check the surrounding scroll, resize, and cleanup behavior carefully.
- Prefer preserving current animation timing and interaction patterns over redesigning them.
- If you introduce new visual treatment, make sure it still works on both desktop and mobile.

## Validation

- Use `npm run lint` for quick verification.
- Use `npm run build` for broader validation after structural changes.
- Use `npm run dev` to check motion, layout, and responsive behavior in the browser.

## Editing Notes

- Keep changes consistent with the existing file organization and naming.
- Avoid introducing new dependencies unless they clearly solve a real need already present in the repo.
- When changing Next.js behavior or APIs, verify against the official docs for the exact version bundled here.
