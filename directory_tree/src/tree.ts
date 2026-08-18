import { classNames } from "../../src/classNames";
import { makeDraggable, wireFolderDrop } from "./drag";
import { currentPath } from "./state";
import { type FileNode, type FolderEntry, isFolder, joinPath, root, ROOT_PATH } from "./treeData";

const LEVEL_W = 150;
const LEVEL_H = 46;
const MARGIN = 24;

interface LayoutNode {
  node: FileNode;
  path: string;
  depth: number;
  rank: number;
  parents: LayoutNode[];
  children: LayoutNode[];
}

function buildTree(): { layouts: LayoutNode[]; leaves: number; depth: number } {
  const all: LayoutNode[] = [];
  let counter = 0;
  let maxDepth = 0;

  function walk(folder: FileNode, depth: number, path: string): LayoutNode {
    const layout: LayoutNode = {
      node: folder,
      path,
      depth,
      rank: 0,
      parents: [],
      children: [],
    };
    all.push(layout);
    maxDepth = Math.max(maxDepth, depth + 1);
    if (isFolder(folder) && folder.children.length > 0) {
      for (const child of folder.children) {
        const childLayout = walk(child, depth + 1, joinPath(path, child.name));
        childLayout.parents.push(layout);
        layout.children.push(childLayout);
      }
    } else {
      layout.rank = counter++;
    }
    return layout;
  }

  walk(root, 0, ROOT_PATH);
  for (let i = all.length - 1; i >= 0; i--) {
    if (all[i].children.length === 0) continue;
    const ys = all[i].children.map((c) => c.rank);
    all[i].rank = (ys[0] + ys[ys.length - 1]) / 2;
  }
  return { layouts: all, leaves: counter, depth: maxDepth };
}

export interface Tree {
  render: () => void;
}

export function createTree(
  pane: HTMLElement,
  navigate: (folder: FolderEntry) => void,
): Tree {
  function render(): void {
    pane.replaceChildren();
    const { layouts, leaves, depth } = buildTree();
    const width = MARGIN * 2 + (depth - 1) * LEVEL_W;
    const height = MARGIN * 2 + Math.max(leaves - 1, 0) * LEVEL_H;

    const inner = document.createElement("div");
    inner.className = "relative";
    inner.style.width = `${width}px`;
    inner.style.height = `${height}px`;
    pane.appendChild(inner);

    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width", String(width));
    svgElement.setAttribute("height", String(height));
    svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svgElement.className.baseVal = "absolute left-0 top-0 h-full w-full";
    svgElement.setAttribute("aria-hidden", "true");
    inner.appendChild(svgElement);

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgElement.appendChild(g);

    function point(l: LayoutNode): { x: number; y: number } {
      return {
        x: MARGIN + l.depth * LEVEL_W,
        y: MARGIN + l.rank * LEVEL_H,
      };
    }

    function addConnector(parent: LayoutNode, child: LayoutNode): void {
      const p = point(parent);
      const c = point(child);
      const mid = (p.y + c.y) / 2;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute(
        "d",
        `M ${p.x} ${p.y} C ${p.x} ${mid}, ${c.x} ${mid}, ${c.x} ${c.y}`,
      );
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "rgb(187 247 208)");
      path.setAttribute("stroke-width", "2");
      g.appendChild(path);
    }

    for (const layout of layouts) {
      for (const parent of layout.parents) addConnector(parent, layout);
    }

    const chips = document.createElement("div");
    chips.className = "pointer-events-none absolute inset-0";
    inner.appendChild(chips);

    for (const layout of layouts) {
      const { x, y } = point(layout);
      const chip = document.createElement("div");
      chip.dataset.path = layout.path;
      chip.className = classNames(
        "dt-chip",
        layout.path === currentPath.value && "bg-green-50",
      );
      chip.style.left = `${x}px`;
      chip.style.top = `${y}px`;
      chip.style.transform = "translate(-50%, -50%)";

      const icon = document.createElement("span");
      icon.dataset.lucide = isFolder(layout.node) ? "folder" : layout.node.icon;
      icon.className = "dt-chip-icon";
      chip.appendChild(icon);

      const name = document.createElement("span");
      name.className = "truncate";
      name.textContent = layout.node.name;
      chip.appendChild(name);

      const node = layout.node;
      if (isFolder(node)) {
        chip.addEventListener("click", () => navigate(node));
        wireFolderDrop(chip, node, layout.path);
      }
      makeDraggable(chip, node, layout.path);
      chips.appendChild(chip);
    }

    const pad = document.createElement("div");
    pad.className = "flex min-h-full min-w-full flex-col items-center justify-center p-4";
    pad.appendChild(inner);

    const scroll = document.createElement("div");
    scroll.className = "absolute left-0 top-0 h-full w-full overflow-auto";
    scroll.appendChild(pad);
    pane.appendChild(scroll);
  }

  return { render };
}
