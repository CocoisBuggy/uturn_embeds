import { createElement } from "lucide";
import type { Annotations } from "./annotations";
import { activeLabel, current, type Label } from "./state";

const BLANK = (): HTMLElement => document.createElement("div");

const iconWrap = document.createElement("div");
iconWrap.className = "fa-icon";

const nameEl = document.createElement("span");
nameEl.className = "fa-name";

const dotEl = document.createElement("span");
dotEl.className = "fa-dot";

const typeEl = document.createElement("span");
typeEl.className = "fa-type";

export function renderFile(): void {
  const entry = current.value;
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
}

export function createGrid(annotations: Annotations): GridElements {
  const { filename, dot, filetype } = annotations;

  const grid = document.createElement("div");
  grid.className = "fa-grid";

  grid.append(
    BLANK(),
    filename,
    dot,
    BLANK(),
    iconWrap,
    nameEl,
    dotEl,
    typeEl,
    BLANK(),
    BLANK(),
    BLANK(),
    filetype,
  );

  return { grid, iconWrap, nameEl, dotEl, typeEl };
}

export function bindHover(item: HTMLElement, label: Label): void {
  item.addEventListener("mouseenter", () => (activeLabel.value = label));
  item.addEventListener("mouseleave", () => {
    if (activeLabel.value === label) activeLabel.value = null;
  });
}
