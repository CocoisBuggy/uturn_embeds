import "../styles.css";

import { embeds } from "./embeds";

const list = document.querySelector("#embed-list")!;
for (const name of embeds) {
  const li = document.createElement("li");
  li.className = "flex flex-col gap-2 rounded-xl border border-green-200 bg-white p-3";

  const head = document.createElement("header");
  head.className = "flex items-center justify-between gap-2";

  const label = document.createElement("span");
  label.className = "truncate font-mono text-sm text-slate-600";
  label.textContent = `${name}/`;

  const link = document.createElement("a");
  link.className = "text-sm text-green-600 underline hover:text-green-500";
  link.href = `./${name}/`;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "open";

  head.append(label, link);

  const frame = document.createElement("iframe");
  frame.className = "aspect-video w-full rounded-md border border-green-100 bg-white";
  frame.src = `./${name}/`;
  frame.title = name;
  frame.loading = "lazy";

  li.append(head, frame);
  list.appendChild(li);
}
