import { computed, signal } from "@preact/signals-core";
import { files } from "./data";

export type Label = "filename" | "dot" | "filetype";

export const currentIndex = signal(0);

export const current = computed(() => files[currentIndex.value]);

export const activeLabel = signal<Label | null>(null);
