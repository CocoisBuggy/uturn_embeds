import "./style.css";

const files = [
  "README.md",
  "package.json",
  "vite.config.js",
];

const list = document.querySelector("#file-list");
for (const file of files) {
  const li = document.createElement("li");
  li.textContent = file;
  list.appendChild(li);
}
