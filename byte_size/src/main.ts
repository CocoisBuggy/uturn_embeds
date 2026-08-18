import "../../src/styles.css";
import "./components.css";

import { effect } from "@preact/signals-core";
import { createIcons, FileAudio, FileText, FileVideo, Film, Gamepad2, Image, Tv } from "lucide";
import { items, maxBytes, selected, toggle } from "./state";

const icons: Record<string, string> = {
  "small text file": "file-text",
  "voice note": "file-audio",
  "small image": "image",
  "big image": "image",
  "short video": "file-video",
  "TV episode": "tv",
  movie: "film",
  "video game": "gamepad-2",
};

function formatBytes(bytes: number): string {
  if (bytes < 1_000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  if (bytes < 1_000_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`;
  return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
}

function formatRawBytes(bytes: number): string {
  return bytes.toLocaleString("en-US");
}

const floor = document.querySelector<HTMLElement>(".floor")!;

const wrap = document.createElement("div");
wrap.className = "flex h-full w-full flex-col items-center gap-8 px-8 py-12";

const chips = document.createElement("div");
chips.className = "bs-chips";

const chart = document.createElement("div");
chart.className = "bs-chart";

const chipEls: Record<string, HTMLElement> = {};
const rowEls: Record<string, HTMLElement> = {};
const barEls: Record<string, HTMLElement> = {};

for (const item of items) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "bs-chip";

  const icon = document.createElement("span");
  icon.dataset.lucide = icons[item.label];

  chip.append(icon, document.createTextNode(item.label));
  chip.addEventListener("click", () => toggle(item.label));
  chips.appendChild(chip);
  chipEls[item.label] = chip;

  const row = document.createElement("div");
  row.className = "bs-row";

  const label = document.createElement("span");
  label.className = "bs-row-label";
  label.textContent = item.label;

  const track = document.createElement("div");
  track.className = "bs-row-track";

  const bar = document.createElement("div");
  bar.className = "bs-bar";
  track.appendChild(bar);

  const barValue = document.createElement("span");
  barValue.className = "bs-bar-value";
  barValue.textContent = `${formatRawBytes(item.bytes)} bytes`;
  track.appendChild(barValue);

  const value = document.createElement("span");
  value.className = "bs-row-value";
  value.textContent = formatBytes(item.bytes);

  row.append(label, track, value);
  chart.appendChild(row);
  rowEls[item.label] = row;
  barEls[item.label] = bar;
}

wrap.append(chips, chart);
floor.appendChild(wrap);

effect(() => {
  const set = selected.value;
  const max = maxBytes.value;
  for (const item of items) {
    const on = set.has(item.label);
    chipEls[item.label].classList.toggle("is-selected", on);
    rowEls[item.label].classList.toggle("is-show", on);
    rowEls[item.label].classList.toggle("is-idle", !on);
    barEls[item.label].style.width = on ? `${(item.bytes / max) * 100}%` : "0";
  }
});

createIcons({
  icons: {
    FileAudio,
    FileText,
    FileVideo,
    Film,
    Gamepad2,
    Image,
    Tv,
  },
});

export {};
