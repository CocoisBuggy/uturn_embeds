import "./style.css";

const dirs = [
  "/home/coco/Git/uturn-embeds",
  "/home/coco/Git/uturn-embeds/src",
  "/home/coco/Git/uturn-embeds/public",
];

const list = document.querySelector("#dir-list");
for (const dir of dirs) {
  const li = document.createElement("li");
  li.textContent = dir;
  list.appendChild(li);
}
