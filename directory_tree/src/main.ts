import "../../src/styles.css";
import "./components.css";
import { effect } from "@preact/signals-core";
import { moveDragTo } from "./drag";
import { createExplorer } from "./explorer";
import { initHover } from "./hover";
import { renderIcons } from "./icons";
import { createShell } from "./layout";
import { current, version } from "./state";
import { createTree } from "./tree";

const shell = createShell();

const explorer = createExplorer(shell.breadcrumb, shell.grid, shell.mainTitle);
const tree = createTree(shell.treePane, explorer.navigate);

shell.grid.addEventListener("dragover", (e: DragEvent) => e.preventDefault());
shell.grid.addEventListener("drop", (e: DragEvent) => {
  e.preventDefault();
  moveDragTo(current.value);
});

initHover();

effect(() => {
  version.value;
  explorer.render();
  tree.render();
  renderIcons();
});

export {};
