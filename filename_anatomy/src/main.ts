import "../../src/styles.css";
import "./components.css";
import { effect } from "@preact/signals-core";
import { createAnnotations } from "./annotations";
import { files } from "./data";
import { bindHover, createGrid, renderFile } from "./layout";
import { activeLabel, currentIndex, type Label } from "./state";

const floor = document.querySelector<HTMLElement>(".floor")!;

const annotations = createAnnotations();
const { grid, iconWrap, nameEl, dotEl, typeEl } = createGrid(annotations);

floor.appendChild(grid);

bindHover(iconWrap, "filetype");
bindHover(nameEl, "filename");
bindHover(annotations.filename, "filename");
bindHover(dotEl, "dot");
bindHover(annotations.dot, "dot");
bindHover(typeEl, "filetype");
bindHover(annotations.filetype, "filetype");

effect(() => {
  const label = activeLabel.value;
  (Object.entries(annotations) as [Label, HTMLElement][]).forEach(([key, el]) => {
    el.classList.toggle("hlt", label === key);
  });
});

effect(() => renderFile());

const targets = [nameEl, dotEl, typeEl, iconWrap];

function animateSwap(): void {
  targets.forEach((t) => t.classList.add("swap-out"));

  window.setTimeout(() => {
    currentIndex.value = (currentIndex.value + 1) % files.length;

    targets.forEach((t) => {
      t.classList.remove("swap-out");
      t.classList.add("swap-in");
    });

    window.setTimeout(() => {
      targets.forEach((t) => t.classList.remove("swap-in"));
    }, 700);
  }, 200);
}

window.setInterval(animateSwap, 4000);

export {};
