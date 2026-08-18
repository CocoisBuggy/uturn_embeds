import "../../src/styles.css";
import "./components.css";
import { createAnnotations } from "./annotations";
import { files } from "./data";
import { bindHover, createGrid } from "./layout";

const floor = document.querySelector<HTMLElement>(".floor")!;

const annotations = createAnnotations();
const { grid, iconWrap, nameEl, dotEl, typeEl, setFile } = createGrid(annotations);

floor.appendChild(grid);

bindHover(iconWrap, annotations.filetypeLabel);
bindHover(nameEl, annotations.filenameLabel);
bindHover(annotations.filenameLabel, annotations.filenameLabel);
bindHover(dotEl, annotations.dotLabel);
bindHover(annotations.dotLabel, annotations.dotLabel);
bindHover(typeEl, annotations.filetypeLabel);
bindHover(annotations.filetypeLabel, annotations.filetypeLabel);

let index = 0;

function animateSwap(): void {
  const targets = [nameEl, dotEl, typeEl, iconWrap];

  targets.forEach((t) => t.classList.add("swap-out"));

  window.setTimeout(() => {
    index = (index + 1) % files.length;
    setFile(files[index]);

    targets.forEach((t) => {
      t.classList.remove("swap-out");
      t.classList.add("swap-in");
    });

    window.setTimeout(() => {
      targets.forEach((t) => t.classList.remove("swap-in"));
    }, 700);
  }, 200);
}

setFile(files[index]);
window.setInterval(animateSwap, 4000);

export {};
