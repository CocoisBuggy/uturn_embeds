# AGENTS.md

Vite multipage static site where each top-level directory is a self-contained "embed" page, plus a root gallery that iframes them all. Deployed to GitHub Pages.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — per-page `vite build` via `scripts/build.mjs`; `vite-plugin-singlefile` inlines every asset into one self-contained HTML per page (output to `dist/`). Uses Vite 8 (Rolldown). Build is NOT a single `vite build` pass: singlefile can't code-split with multiple HTML inputs, so each page is built separately.
- `npm run typecheck` — `tsc --noEmit`
- `npm run preview` — preview build output
- No test or lint scripts. Formatting (TS/JSON/Markdown/malva/markup) is `dprint fmt` / `dprint check` per `dprint.json`.

## Adding an embed

Create a top-level directory `<name>/` containing `index.html` + `src/main.ts` (import `../../src/styles.css`). Do **not** register it anywhere: `scripts/build.mjs` and `src/gallery/embeds.ts` (`import.meta.glob`) auto-discover any top-level dir with an `index.html`. It will appear as `<name>/` in the root gallery (`index.html` → `src/gallery/main.ts`).

For elements with more than a few Tailwind classes, use the shared `classNames` helper (`src/classNames.ts`, import `../../src/classNames`) and put one class per line so class strings don't run together; pass conditional classes as falsy args (e.g. `classNames(base, cond && "hlt")`) instead of string concatenation.

## Architecture / gotchas

- **Single-file build**: `vite-plugin-singlefile` inlines every asset into one HTML per page, and `base: "./"` is set. Internal links must be relative (e.g. `./${name}/` in the gallery) — no root-absolute paths.
- **Tailwind v4, no config file**: wiring is only the `@tailwindcss/vite` plugin + `@import "tailwindcss";` at the top of `src/styles.css`. No `tailwind.config.*`.
- **`@` alias** in code resolves to repo root.
- **tsconfig `include` is explicit**: `["src", "files/src", "directories/src"]`. A new embed's `src/` is only typechecked if it is added here.
- **Lucide icons**: rendered via `createIcons({ icons })` from `lucide` with `<span data-lucide="...">` placeholders; every used icon must be imported and registered in the `icons` map.
- **Deploy**: `.github/workflows/deploy.yml` — on push to `main`, `npm ci && npm run build`, deploy `dist/` to GitHub Pages.
