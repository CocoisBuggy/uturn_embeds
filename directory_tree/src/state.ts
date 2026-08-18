import { computed, signal } from "@preact/signals-core";
import { type FolderEntry, type NavEntry, root, ROOT_PATH } from "./treeData";

export const current = signal<FolderEntry>(root);

export const navbar = signal<NavEntry[]>([{ folder: root, path: ROOT_PATH }]);

export const currentPath = computed(
  () => navbar.value[navbar.value.length - 1].path,
);

export const dragSource = signal<string | null>(null);

// The tree lives in nested, non-reactive objects (mutated via children.push),
// so a manual bump is still needed to invalidate the DOM render.
const version = signal(0);

export const invalidate = (): void => {
  version.value++;
};

export { version };
