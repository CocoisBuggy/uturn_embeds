import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";

const root = resolve(import.meta.dirname);

export default defineConfig({
  resolve: {
    alias: {
      "@": root,
    },
  },
  plugins: [
    tailwindcss(),
  ],
});
