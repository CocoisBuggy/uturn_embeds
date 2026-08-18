export const embeds = Object.keys(
  import.meta.glob(["/*/index.html", "!/dist/**", "!/node_modules/**"]),
)
  .map((p) => p.replace(/^\//, "").replace(/\/index\.html$/, ""));
