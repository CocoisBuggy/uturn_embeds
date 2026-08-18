import "../../src/styles.css";

import {
  createIcons,
  FileArchive,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  FolderOpen,
  Image,
  Music,
} from "lucide";

type FileIcon = string;

interface FileEntry {
  name: string;
  icon: FileIcon;
}

interface FolderEntry {
  name: string;
  children: FileNode[];
}

type FileNode = FileEntry | FolderEntry;

function isFolder(node: FileNode): node is FolderEntry {
  return "children" in node;
}

const root: FolderEntry = {
  name: "Home",
  children: [
    {
      name: "Documents",
      children: [
        { name: "README.md", icon: "file-text" },
        { name: "notes.txt", icon: "file-text" },
        { name: "resume.pdf", icon: "file-text" },
      ],
    },
    {
      name: "Media",
      children: [
        { name: "photo-collage.png", icon: "image" },
        { name: "theme-song.mp3", icon: "music" },
        { name: "trailer.mp4", icon: "file-video" },
        { name: "notes.wav", icon: "file-audio" },
      ],
    },
    { name: "vacation.jpg", icon: "image" },
    { name: "family-photo.webp", icon: "image" },
    { name: "todo-list.txt", icon: "file-text" },
    { name: "invoice.pdf", icon: "file-text" },
  ],
};

const floor = document.querySelector<HTMLElement>(".floor")!;

const main = document.createElement("div");
main.className = "relative flex h-full w-full flex-col p-4";

const mainTitle = document.createElement("h1");
mainTitle.className = "mb-3 text-xl font-bold text-green-700";
main.appendChild(mainTitle);

const breadcrumb = document.createElement("nav");
breadcrumb.className = "mb-3 flex min-w-0 flex-wrap items-center gap-1 text-sm text-slate-500";
breadcrumb.setAttribute("aria-label", "Breadcrumb");
main.appendChild(breadcrumb);

const grid = document.createElement("div");
grid.className = "grid h-full auto-rows-max grid-cols-2 gap-3 overflow-y-auto";
grid.addEventListener("dragover", (e: DragEvent) => e.preventDefault());
grid.addEventListener("drop", (e: DragEvent) => {
  e.preventDefault();
  const name = e.dataTransfer?.getData("text/plain");
  if (name) moveNodeByName(name, current);
});
main.appendChild(grid);

floor.appendChild(main);

let current: FolderEntry = root;
const currentPath: FolderEntry[] = [root];

function navigate(folder: FolderEntry): void {
  current = folder;
  currentPath.push(folder);
  render();
}

function renderBreadcrumb(): void {
  breadcrumb.replaceChildren();
  for (const [i, folder] of currentPath.entries()) {
    if (i > 0) {
      const sep = document.createElement("span");
      sep.textContent = "/";
      sep.className = "text-green-400";
      breadcrumb.appendChild(sep);
    }
    const crumb = document.createElement("button");
    crumb.type = "button";
    crumb.className = "rounded px-1 transition-colors hover:text-green-700"
      + (i === currentPath.length - 1 ? " font-bold text-green-700" : " text-slate-500");
    crumb.textContent = folder.name;
    crumb.addEventListener("click", () => {
      currentPath.length = i + 1;
      current = folder;
      render();
    });
    breadcrumb.appendChild(crumb);
  }
}

function showEmpty(state: string, iconName: string): void {
  const wrap = document.createElement("div");
  wrap.className = "col-span-2 flex flex-col items-center gap-2 py-10 text-green-400";
  const icon = document.createElement("span");
  icon.dataset.lucide = iconName;
  icon.className = "[&_svg]:h-12 [&_svg]:w-12 [&_svg]:stroke-current";
  const text = document.createElement("p");
  text.className = "text-sm text-slate-500";
  text.textContent = state;
  wrap.append(icon, text);
  grid.appendChild(wrap);
}

function renderGrid(): void {
  grid.replaceChildren();
  mainTitle.textContent = current.name;

  for (const child of current.children) {
    grid.appendChild(isFolder(child) ? makeFolderTile(child) : makeFileTile(child));
  }

  if (current.children.length === 0) showEmpty("This folder is empty", "folder-open");
}

function makeTileContent(icon: string, name: string): HTMLElement {
  const tile = document.createElement("div");
  tile.className = "flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-green-200 bg-white p-3";

  const iconWrap = document.createElement("span");
  iconWrap.className =
    "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700 [&_svg]:h-9 [&_svg]:w-9 [&_svg]:stroke-current";
  const iconEl = document.createElement("span");
  iconEl.dataset.lucide = icon;
  iconWrap.appendChild(iconEl);

  const nameEl = document.createElement("span");
  nameEl.className = "truncate text-sm text-slate-700";
  nameEl.textContent = name;

  tile.append(iconWrap, nameEl);
  return tile;
}

function makeFolderTile(folder: FolderEntry): HTMLElement {
  const tile = makeTileContent("folder", folder.name);
  tile.classList.add("cursor-pointer");
  tile.addEventListener("click", () => navigate(folder));
  makeDraggable(tile, folder);
  wireDropTarget(tile, folder);
  return tile;
}

function makeFileTile(file: FileEntry): HTMLElement {
  const tile = makeTileContent(file.icon, file.name);
  makeDraggable(tile, file);
  return tile;
}

function makeDraggable(tile: HTMLElement, node: FileNode): void {
  tile.draggable = true;
  tile.addEventListener("dragstart", (e: DragEvent) => {
    e.dataTransfer?.setData("text/plain", node.name);
    tile.classList.add("opacity-50");
  });
  tile.addEventListener("dragend", () => tile.classList.remove("opacity-50"));
}

function wireDropTarget(element: HTMLElement, targetFolder: FolderEntry): void {
  element.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    element.classList.add("ring-2", "ring-green-500");
  });
  element.addEventListener("dragleave", () => element.classList.remove("ring-2", "ring-green-500"));
  element.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    element.classList.remove("ring-2", "ring-green-500");
    const name = e.dataTransfer?.getData("text/plain");
    if (name) moveNodeByName(name, targetFolder);
  });
}

function moveNodeByName(name: string, target: FolderEntry): void {
  const removed = removeFirstByName(current, name);
  if (!removed) return;
  if (target === current) {
    current.children.push(removed);
  } else {
    target.children.push(removed);
  }
  render();
}

function removeFirstByName(folder: FolderEntry, name: string): FileNode | null {
  const idx = folder.children.findIndex((c) => c.name === name);
  if (idx >= 0) return folder.children.splice(idx, 1)[0];
  for (const child of folder.children) {
    if (isFolder(child)) {
      const found = removeFirstByName(child, name);
      if (found) return found;
    }
  }
  return null;
}

function render(): void {
  renderBreadcrumb();
  renderGrid();
  createIcons({
    icons: {
      FileArchive,
      FileAudio,
      FileCode,
      FileSpreadsheet,
      FileText,
      FileVideo,
      Folder,
      FolderOpen,
      Image,
      Music,
    },
  });
}

render();

export {};
