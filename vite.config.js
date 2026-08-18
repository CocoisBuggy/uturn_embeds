import tailwindcss from "@tailwindcss/vite";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const root = resolve(import.meta.dirname);

const embedDirs = readdirSync(root, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .filter((e) => !e.name.startsWith(".") && e.name !== "node_modules" && e.name !== "dist")
  .filter((e) => existsSync(resolve(root, e.name, "index.html")))
  .map((e) => e.name);

const inputs = {
  index: resolve(root, "index.html"),
  ...Object.fromEntries(embedDirs.map((name) => [name, resolve(root, name, "index.html")])),
};

export default defineConfig({
  base: "./",
  build: {
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      input: inputs,
    },
  },
  resolve: {
    alias: {
      "@": root,
    },
  },
  plugins: [
    tailwindcss(),
    viteSingleFile({
      useRecommendedBuildConfig: false,
    }),
  ],
});
