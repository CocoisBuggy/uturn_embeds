import "../../src/styles.css";

import {
  createElement,
  FileArchive,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Image,
  Music,
} from "lucide";
import { classNames } from "../../src/classNames";

interface FileEntry {
  base: string;
  ext: string;
  icon: typeof FileText;
}

const files: FileEntry[] = [
  { base: "photo-album", ext: "png", icon: Image },
  { base: "annual-report", ext: "pdf", icon: FileText },
  { base: "demo-mix", ext: "mp3", icon: Music },
  { base: "product-tour", ext: "mp4", icon: FileVideo },
  { base: "q2-budget", ext: "xlsx", icon: FileSpreadsheet },
  { base: "source-lib", ext: "ts", icon: FileCode },
  { base: "archives", ext: "zip", icon: FileArchive },
  { base: "voice-note", ext: "wav", icon: FileAudio },
];

const floor = document.querySelector<HTMLElement>(".floor")!;

const grid = document.createElement("div");
grid.className = classNames(
  "grid",
  "grid-cols-[7rem_11rem_2rem_9rem]",
  "grid-rows-[auto_auto_auto]",
  "gap-x-1",
  "gap-y-3",
);

function badge(label: string, side: "above" | "below"): HTMLElement {
  const col = document.createElement("div");
  col.className = "anno-col flex flex-col items-center";

  const pill = document.createElement("span");
  pill.className = classNames(
    "anno-pill",
    "rounded-full",
    "border",
    "border-green-300",
    "bg-white",
    "px-2.5",
    "py-0.5",
    "text-[11px]",
    "font-semibold",
    "tracking-wide",
    "text-green-700",
  );
  pill.textContent = label;

  const tail = document.createElement("div");
  tail.className = "relative flex h-11 w-full items-center justify-center";

  const line = document.createElement("div");
  line.className = "anno-line h-full w-px bg-green-400";
  line.classList.add(side === "above" ? "grow-down" : "grow-up");

  const arrow = document.createElement("div");
  arrow.className = "anno-arrow absolute h-2.5 w-2.5 rounded-[2px] bg-green-400";

  tail.append(line, arrow);

  if (side === "above") {
    col.append(pill, tail);
    arrow.style.top = "100%";
    arrow.style.marginTop = "-4px";
  } else {
    col.append(tail, pill);
    arrow.style.bottom = "100%";
    arrow.style.marginBottom = "-4px";
  }

  return col;
}

const filenameLabel = badge("Filename", "above");
const dotLabel = badge("Dot", "above");
const filetypeLabel = badge("Filetype", "below");
filetypeLabel.classList.add("align-left");

const blank = (): HTMLElement => document.createElement("div");

const iconWrap = document.createElement("div");
iconWrap.className = classNames(
  "flex",
  "h-16",
  "w-20",
  "items-center",
  "justify-center",
  "justify-self-center",
  "rounded-2xl",
  "border-2",
  "border-dashed",
  "border-green-300",
  "bg-white",
  "text-green-600",
  "[&_svg]:h-9",
  "[&_svg]:w-9",
  "[&_svg]:stroke-current",
);

const nameEl = document.createElement("span");
nameEl.className = "self-center truncate font-mono text-lg font-semibold text-slate-800";

const dotEl = document.createElement("span");
dotEl.className = classNames(
  "self-center",
  "text-center",
  "font-mono",
  "text-2xl",
  "font-extrabold",
  "text-rose-500",
);

const typeEl = document.createElement("span");
typeEl.className = classNames(
  "self-center",
  "justify-self-start",
  "min-w-0",
  "truncate",
  "font-mono",
  "text-lg",
  "font-bold",
  "text-green-600",
);

function setFile(entry: FileEntry): void {
  iconWrap.replaceChildren();
  iconWrap.appendChild(createElement(entry.icon));
  nameEl.textContent = entry.base;
  dotEl.textContent = ".";
  typeEl.textContent = entry.ext;
}

grid.append(
  blank(),
  filenameLabel,
  dotLabel,
  blank(),
  iconWrap,
  nameEl,
  dotEl,
  typeEl,
  blank(),
  blank(),
  blank(),
  filetypeLabel,
);

floor.appendChild(grid);

function bindHover(item: HTMLElement, label: HTMLElement): void {
  item.addEventListener("mouseenter", () => label.classList.add("hlt"));
  item.addEventListener("mouseleave", () => label.classList.remove("hlt"));
}

bindHover(iconWrap, filetypeLabel);
bindHover(nameEl, filenameLabel);
bindHover(filenameLabel, filenameLabel);
bindHover(dotEl, dotLabel);
bindHover(dotLabel, dotLabel);
bindHover(typeEl, filetypeLabel);
bindHover(filetypeLabel, filetypeLabel);

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
