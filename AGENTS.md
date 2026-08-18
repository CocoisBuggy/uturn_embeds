# AGENTS.md

Vite multipage static site where each top-level directory is a self-contained "embed" page, plus a root gallery that iframes them all. Deployed to GitHub Pages.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — Vite build (output to `dist/`)
- `npm run typecheck` — `tsc --noEmit`
- `npm run preview` — preview build output
- No test or lint scripts. Formatting (TS/JSON/Markdown/malva/markup) is `dprint fmt` / `dprint check` per `dprint.json`.

## Adding an embed

Create a top-level directory `<name>/` containing `index.html` + `src/main.ts` (import `../../src/styles.css`). Do **not** register it anywhere: `vite.config.js` and `src/gallery/embeds.ts` (`import.meta.glob`) auto-discover any top-level dir with an `index.html`. It will appear as `<name>/` in the root gallery (`index.html` → `src/gallery/main.ts`).

## Architecture / gotchas

- **Single-file build**: `vite-plugin-singlefile` inlines every asset into one HTML per page, and `base: "./"` is set. Internal links must be relative (e.g. `./${name}/` in the gallery) — no root-absolute paths.
- **Tailwind v4, no config file**: wiring is only the `@tailwindcss/vite` plugin + `@import "tailwindcss";` at the top of `src/styles.css`. No `tailwind.config.*`.
- **`@` alias** in code resolves to repo root.
- **tsconfig `include` is explicit**: `["src", "files/src", "directories/src"]`. A new embed's `src/` is only typechecked if it is added here.
- **Lucide icons**: rendered via `createIcons({ icons })` from `lucide` with `<span data-lucide="...">` placeholders; every used icon must be imported and registered in the `icons` map.
- **Deploy**: `.github/workflows/deploy.yml` — on push to `main`, `npm ci && npm run build`, deploy `dist/` to GitHub Pages.
