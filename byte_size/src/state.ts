import { computed, signal } from "@preact/signals-core";

export interface Item {
  label: string;
  bytes: number;
}

export const items: Item[] = [
  { label: "small text file", bytes: 2_000 },
  { label: "voice note", bytes: 250_000 },
  { label: "small image", bytes: 1_000_000 },
  { label: "big image", bytes: 5_000_000 },
  { label: "short video", bytes: 50_000_000 },
  { label: "TV episode", bytes: 500_000_000 },
  { label: "movie", bytes: 1_500_000_000 },
  { label: "video game", bytes: 60_000_000_000 },
];

export const selected = signal<Set<string>>(new Set());

export const maxBytes = computed(() => {
  let max = 0;
  for (const item of items) {
    if (selected.value.has(item.label) && item.bytes > max) max = item.bytes;
  }
  return max;
});

export function toggle(label: string): void {
  const next = new Set(selected.value);
  if (next.has(label)) {
    next.delete(label);
  } else {
    next.add(label);
  }
  selected.value = next;
}
