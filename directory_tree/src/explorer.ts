import { classNames } from "../../src/classNames";
import { makeDraggable, wireFolderDrop } from "./drag";
import { current, currentPath, invalidate, navbar } from "./state";
import { type FileEntry, type FolderEntry, isFolder, joinPath } from "./treeData";

export interface Explorer {
  navigate: (folder: FolderEntry) => void;
  render: () => void;
}

export function createExplorer(
  breadcrumb: HTMLElement,
  grid: HTMLElement,
  mainTitle: HTMLElement,
): Explorer {
  function navigate(folder: FolderEntry): void {
    const parent = navbar.value[navbar.value.length - 1];
    navbar.value = [...navbar.value, { folder, path: joinPath(parent.path, folder.name) }];
    current.value = folder;
    invalidate();
  }

  function renderBreadcrumb(): void {
    breadcrumb.replaceChildren();
    for (const [i, nav] of navbar.value.entries()) {
      if (i > 0) {
        const sep = document.createElement("span");
        sep.textContent = "/";
        sep.className = "text-green-400";
        breadcrumb.appendChild(sep);
      }
      const crumb = document.createElement("button");
      crumb.type = "button";
      crumb.className = classNames(
        "dt-crumb",
        i === navbar.value.length - 1 ? "font-bold text-green-700" : "text-slate-500",
      );
      crumb.textContent = nav.folder.name;
      crumb.addEventListener("click", () => {
        navbar.value = navbar.value.slice(0, i + 1);
        current.value = nav.folder;
        invalidate();
      });
      breadcrumb.appendChild(crumb);
    }
  }

  function showEmpty(): void {
    const wrap = document.createElement("div");
    wrap.className = "dt-empty";
    const icon = document.createElement("span");
    icon.dataset.lucide = "folder-open";
    icon.className = "dt-empty-icon";
    const text = document.createElement("p");
    text.className = "text-sm text-slate-500";
    text.textContent = "This folder is empty";
    wrap.append(icon, text);
    grid.appendChild(wrap);
  }

  function makeTileContent(icon: string, name: string): HTMLElement {
    const tile = document.createElement("div");
    tile.className = "dt-tile";

    const iconWrap = document.createElement("span");
    iconWrap.className = "dt-tile-icon";
    const iconEl = document.createElement("span");
    iconEl.dataset.lucide = icon;
    iconWrap.appendChild(iconEl);

    const nameEl = document.createElement("span");
    nameEl.className = "dt-tile-name";
    nameEl.textContent = name;

    tile.append(iconWrap, nameEl);
    return tile;
  }

  function makeFolderTile(folder: FolderEntry, path: string): HTMLElement {
    const tile = makeTileContent("folder", folder.name);
    tile.dataset.path = path;
    tile.classList.add("cursor-pointer");
    tile.addEventListener("click", () => navigate(folder));
    makeDraggable(tile, folder, path);
    wireFolderDrop(tile, folder, path);
    return tile;
  }

  function makeFileTile(file: FileEntry, path: string): HTMLElement {
    const tile = makeTileContent(file.icon, file.name);
    tile.dataset.path = path;
    makeDraggable(tile, file, path);
    return tile;
  }

  function renderGrid(): void {
    grid.replaceChildren();
    mainTitle.textContent = current.value.name;
    const currentFolderPath = currentPath.value;

    for (const child of current.value.children) {
      const path = joinPath(currentFolderPath, child.name);
      const tile = isFolder(child)
        ? makeFolderTile(child, path)
        : makeFileTile(child, path);
      grid.appendChild(tile);
    }

    if (current.value.children.length === 0) showEmpty();
  }

  function render(): void {
    renderBreadcrumb();
    renderGrid();
  }

  return { navigate, render };
}
