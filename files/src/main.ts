import "../../src/styles.css";

import {
  createIcons,
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
  name: string;
  icon: string;
}

const files: FileEntry[] = [
  { name: "README.md", icon: "file-text" },
  { name: "photo-collage.png", icon: "image" },
  { name: "theme-song.mp3", icon: "music" },
  { name: "trailer.mp4", icon: "file-video" },
  { name: "budget-2026.xlsx", icon: "file-spreadsheet" },
  { name: "notes.wav", icon: "file-audio" },
  { name: "source.zip", icon: "file-archive" },
  { name: "build.sh", icon: "file-code" },
];

function splitExtension(filename: string): { base: string; ext: string } {
  const i = filename.lastIndexOf(".");
  return i > 0 ? { base: filename.slice(0, i), ext: filename.slice(i) } : { base: filename, ext: "" };
}

const floor = document.querySelector<HTMLElement>(".floor")!;

const grid = document.createElement("div");
grid.className = "grid h-full grid-cols-2 grid-rows-3 gap-3 p-4";

for (const file of files) {
  const tile = document.createElement("div");
  tile.className = classNames(
    "flex",
    "min-w-0",
    "items-center",
    "gap-3",
    "overflow-hidden",
    "rounded-xl",
    "border",
    "border-green-200",
    "bg-white",
    "p-3",
  );

  const iconWrap = document.createElement("span");
  iconWrap.className = classNames(
    "flex",
    "h-16",
    "w-16",
    "shrink-0",
    "items-center",
    "justify-center",
    "rounded-lg",
    "bg-green-100",
    "text-green-700",
    "[&_svg]:h-9",
    "[&_svg]:w-9",
    "[&_svg]:stroke-current",
  );
  const icon = document.createElement("span");
  icon.dataset.lucide = file.icon;
  iconWrap.appendChild(icon);

  const nameEl = document.createElement("span");
  nameEl.className = "truncate text-sm text-slate-700";
  const { base, ext } = splitExtension(file.name);

  const baseEl = document.createTextNode(base);
  const extEl = document.createElement("span");
  extEl.className = "font-bold text-green-600";
  extEl.textContent = ext;

  nameEl.append(baseEl, extEl);
  tile.append(iconWrap, nameEl);
  grid.appendChild(tile);
}

floor.appendChild(grid);

createIcons({
  icons: {
    FileAudio,
    FileArchive,
    FileCode,
    FileSpreadsheet,
    FileText,
    FileVideo,
    Image,
    Music,
  },
});

export {};
