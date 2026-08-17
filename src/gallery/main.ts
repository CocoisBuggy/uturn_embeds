import { embeds } from "./embeds";

const list = document.querySelector("#embed-list")!;
for (const name of embeds) {
  const li = document.createElement("li");
  li.className = "embed-item";

  const head = document.createElement("header");
  head.className = "embed-head";

  const label = document.createElement("span");
  label.className = "embed-name";
  label.textContent = `${name}/`;

  const link = document.createElement("a");
  link.className = "embed-link";
  link.href = `./${name}/`;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "open";

  head.append(label, link);

  const frame = document.createElement("iframe");
  frame.className = "embed-frame";
  frame.src = `./${name}/`;
  frame.title = name;
  frame.loading = "lazy";

  li.append(head, frame);
  list.appendChild(li);
}
