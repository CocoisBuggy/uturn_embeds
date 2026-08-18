import { createElement } from "lucide";
import type { Annotations } from "./annotations";
import type { FileEntry } from "./data";

const BLANK = (): HTMLElement => document.createElement("div");

const iconWrap = document.createElement("div");
iconWrap.className = "fa-icon";

const nameEl = document.createElement("span");
nameEl.className = "fa-name";

const dotEl = document.createElement("span");
dotEl.className = "fa-dot";

const typeEl = document.createElement("span");
typeEl.className = "fa-type";

function setFile(entry: FileEntry): void {
  iconWrap.replaceChildren();
  iconWrap.appendChild(createElement(entry.icon));
  nameEl.textContent = entry.base;
  dotEl.textContent = ".";
  typeEl.textContent = entry.ext;
}

export interface GridElements {
  grid: HTMLElement;
  iconWrap: HTMLElement;
  nameEl: HTMLElement;
  dotEl: HTMLElement;
  typeEl: HTMLElement;
  setFile: (entry: FileEntry) => void;
}

export function createGrid(annotations: Annotations): GridElements {
  const { filenameLabel, dotLabel, filetypeLabel } = annotations;

  const grid = document.createElement("div");
  grid.className = "fa-grid";

  grid.append(
    BLANK(),
    filenameLabel,
    dotLabel,
    BLANK(),
    iconWrap,
    nameEl,
    dotEl,
    typeEl,
    BLANK(),
    BLANK(),
    BLANK(),
    filetypeLabel,
  );

  return { grid, iconWrap, nameEl, dotEl, typeEl, setFile };
}

export function bindHover(item: HTMLElement, label: HTMLElement): void {
  item.addEventListener("mouseenter", () => label.classList.add("hlt"));
  item.addEventListener("mouseleave", () => label.classList.remove("hlt"));
}
