import { globSync } from "node:fs";
import { basename, dirname, resolve } from "path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const root = resolve(import.meta.dirname);

const embedHtmls = globSync(resolve(root, "*/index.html"), { ignore: [resolve(root, "node_modules/**")] });

const inputs = {
  index: resolve(root, "index.html"),
};

for (const file of embedHtmls) {
  const embedName = basename(dirname(file));
  inputs[embedName] = file;
}

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
    viteSingleFile({
      useRecommendedBuildConfig: false,
    }),
  ],
});
