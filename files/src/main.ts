import "../../src/styles.css";
import "./components.css";

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
grid.className = "fl-grid";

for (const file of files) {
  const tile = document.createElement("div");
  tile.className = "fl-tile";

  const iconWrap = document.createElement("span");
  iconWrap.className = "fl-tile-icon";
  const icon = document.createElement("span");
  icon.dataset.lucide = file.icon;
  iconWrap.appendChild(icon);

  const nameEl = document.createElement("span");
  nameEl.className = "fl-tile-name";
  const { base, ext } = splitExtension(file.name);

  const baseEl = document.createTextNode(base);
  const extEl = document.createElement("span");
  extEl.className = "fl-tile-ext";
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
