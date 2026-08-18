import tailwindcss from "@tailwindcss/vite";
import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { build } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const root = resolve(import.meta.dirname, "..");
const DIST = resolve(root, "dist");
const TMP = resolve(root, ".tmp-build");

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

const pages = [
  { name: "index", html: resolve(root, "index.html"), dest: resolve(DIST, "index.html") },
];

const entries = await readdir(root, { withFileTypes: true });
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "dist") continue;
  const html = resolve(root, entry.name, "index.html");
  if (!(await exists(html))) continue;
  pages.push({ name: entry.name, html, dest: resolve(DIST, entry.name, "index.html") });
}

await rm(DIST, { recursive: true, force: true });
await rm(TMP, { recursive: true, force: true });

for (const page of pages) {
  const outDir = resolve(TMP, page.name);
  await build({
    root,
    base: "./",
    resolve: {
      alias: { "@": root },
    },
    plugins: [
      tailwindcss(),
      viteSingleFile(),
    ],
    build: {
      outDir,
      emptyOutDir: true,
      modulePreload: { polyfill: false },
      rollupOptions: { input: page.html },
    },
  });
  // Vite mirrors a non-root HTML input's relative path into outDir, so an embed
  // builds to outDir/<name>/index.html (the name appears twice: outDir itself is
  // already TMP/<name>). The root page outputs to outDir/index.html.
  const source = resolve(outDir, page.name === "index" ? "index.html" : `${page.name}/index.html`);
  const destDir = dirname(page.dest);
  await mkdir(destDir, { recursive: true });
  await copyFile(source, page.dest);
}

await rm(TMP, { recursive: true, force: true });
console.log(`Built ${pages.length} pages into ${DIST}`);
