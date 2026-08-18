export interface Shell {
  mainTitle: HTMLElement;
  breadcrumb: HTMLElement;
  grid: HTMLElement;
  explorerPane: HTMLElement;
  treePane: HTMLElement;
}

export function createShell(): Shell {
  const floor = document.querySelector<HTMLElement>(".floor")!;

  const main = document.createElement("div");
  main.className = "relative flex h-full w-full flex-col p-4";

  const header = document.createElement("div");
  header.className = "flex items-baseline justify-between gap-4";
  main.appendChild(header);

  const mainTitle = document.createElement("h1");
  mainTitle.className = "dt-title";
  header.appendChild(mainTitle);

  const treeLabel = document.createElement("div");
  treeLabel.className = "dt-tree-label";
  const treeDot = document.createElement("span");
  treeDot.className = "dt-tree-dot";
  treeDot.setAttribute("aria-hidden", "true");
  treeLabel.append(treeDot, document.createTextNode("Tree graph"));
  header.appendChild(treeLabel);

  const panes = document.createElement("div");
  panes.className = "dt-panes";

  const explorerPane = document.createElement("section");
  explorerPane.className = "dt-explorer";
  explorerPane.setAttribute("aria-label", "File explorer");
  panes.appendChild(explorerPane);

  const treePane = document.createElement("section");
  treePane.className = "dt-tree-pane";
  treePane.setAttribute("aria-label", "Tree graph");
  panes.appendChild(treePane);

  main.appendChild(panes);
  floor.appendChild(main);

  const breadcrumb = document.createElement("nav");
  breadcrumb.className = "dt-breadcrumb";
  breadcrumb.setAttribute("aria-label", "Breadcrumb");
  explorerPane.appendChild(breadcrumb);

  const grid = document.createElement("div");
  grid.className = "dt-grid";
  explorerPane.appendChild(grid);

  return { mainTitle, breadcrumb, grid, explorerPane, treePane };
}
