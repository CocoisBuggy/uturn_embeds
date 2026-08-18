import { current, currentPath, dragSource, invalidate } from "./state";
import { type FileNode, type FolderEntry, nodeAtPath, removeAtPath, root, ROOT_PATH } from "./treeData";

export function makeDraggable(element: HTMLElement, node: FileNode, path: string): void {
  element.draggable = true;
  element.addEventListener("dragstart", (e: DragEvent) => {
    dragSource.value = path;
    e.dataTransfer?.setData("text/plain", node.name);
    element.classList.add("opacity-50");
  });
  element.addEventListener("dragend", () => element.classList.remove("opacity-50"));
}

export function wireFolderDrop(
  element: HTMLElement,
  folder: FolderEntry,
  path: string,
): void {
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
    dropOnFolder(folder, path);
  });
}

function dropOnFolder(folder: FolderEntry, path: string): void {
  if (!dragSource.value) return;
  const sourcePath = dragSource.value;
  if (sourcePath === ROOT_PATH) return;
  if (sourcePath === path || path.startsWith(`${sourcePath}/`)) return;
  const segs = sourcePath.split("/");
  const source = nodeAtPath(root, segs);
  if (!source || source === folder) return;
  if (!removeAtPath(root, segs, source)) return;
  folder.children.push(source);
  invalidate();
}

export function moveDragTo(target: FolderEntry): void {
  if (!dragSource.value) return;
  const sourcePath = dragSource.value;
  dragSource.value = null;
  if (sourcePath === ROOT_PATH) return;
  const segs = sourcePath.split("/");

  const targetPath = currentPath.value;
  if (!targetPath) return;
  if (sourcePath === targetPath) return;
  if (targetPath.startsWith(`${sourcePath}/`)) {
    return;
  }

  const source = nodeAtPath(root, segs);
  if (!source) return;
  if (target === source) return;
  if (!removeAtPath(root, segs, source)) return;

  if (target === current.value) {
    current.value.children.push(source);
  } else {
    target.children.push(source);
  }
  invalidate();
}
