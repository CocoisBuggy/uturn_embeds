import "../../src/styles.css";

import { effect, signal } from "@preact/signals-core";
import { classNames } from "../../src/classNames";

const GRID = 32;

const NAMES = ["byte", "KB", "MB", "GB"];

interface Level {
  name: string;
  value: number;
  equiv: string;
}

const LEVELS: Level[] = [
  { name: "byte", value: 1, equiv: "1 byte" },
  { name: "KB", value: 1024, equiv: "1024 bytes = 1 KB" },
  { name: "MB", value: 1024 ** 2, equiv: "1024 KB = 1 MB" },
  { name: "GB", value: 1024 ** 3, equiv: "1024 MB = 1 GB" },
];

const canvas = document.querySelector<HTMLCanvasElement>("#grid")!;
const ctx = canvas.getContext("2d")!;
const selector = document.querySelector<HTMLElement>("#selector")!;
const countEl = document.querySelector<HTMLElement>("#count")!;
const equivEl = document.querySelector<HTMLElement>("#equiv")!;
const cellLabelEl = document.querySelector<HTMLElement>("#cell-label")!;
const gridLabelEl = document.querySelector<HTMLElement>("#grid-label")!;
const stage = document.querySelector<HTMLElement>(".bs-stage")!;

const CSS = getComputedStyle(document.documentElement);
const cellColors = [
  CSS.getPropertyValue("--bs-cell-1").trim(),
  CSS.getPropertyValue("--bs-cell-2").trim(),
  CSS.getPropertyValue("--bs-cell-3").trim(),
  CSS.getPropertyValue("--bs-cell-4").trim(),
];
const gridColor = CSS.getPropertyValue("--bs-grid").trim();
const boxColor = CSS.getPropertyValue("--bs-box").trim();

const index = signal(0);
const progress = signal(1);
const pinned = signal(false);

function pp(n: number): string {
  return n.toLocaleString("en-US");
}

function text(
  str: string,
  x: number,
  y: number,
  color: string,
  align: CanvasTextAlign = "left",
  baseline: CanvasTextBaseline = "alphabetic",
  size = 12,
): void {
  ctx.font = `600 ${size}px ui-monospace, monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(str, x, y);
}

function color(level: number): string {
  return cellColors[Math.max(0, Math.min(level, cellColors.length - 1))];
}

function draw(): void {
  const s = index.value;
  const p = progress.value;
  const px = canvas.width;

  ctx.clearRect(0, 0, px, px);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, px, px);

  if (s === 0) {
    const box = 140;
    const o = (px - box) / 2;
    ctx.fillStyle = color(0);
    ctx.fillRect(o, o, box, box);
    ctx.strokeStyle = boxColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(o, o, box, box);
    text("1 byte", px / 2, o - 8, boxColor, "center");
    text("(1 square)", px / 2, o + box + 22, "#64748b", "center");
    return;
  }

  const size = 480;
  const ox = 16;
  const oy = 16;
  const cell = size / GRID;

  // main grid: selected unit split into 1024 squares, each = previous unit.
  const cellFill = color(s - 1);
  ctx.fillStyle = cellFill;
  ctx.fillRect(ox, oy, size, size);

  // lens: magnification inset in the lower-right.
  const lsize = 184;
  const lx = px - 16 - lsize;
  const ly = px - 16 - lsize;
  drawLens(s, lx, ly, lsize);

  // grid wireframe.
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 1; i < GRID; i++) {
    const d = i * cell;
    ctx.moveTo(ox + d + 0.5, oy);
    ctx.lineTo(ox + d + 0.5, oy + size);
    ctx.moveTo(ox, oy + d + 0.5);
    ctx.lineTo(ox + size, oy + d + 0.5);
  }
  ctx.stroke();

  // outer box around the whole selected unit.
  ctx.strokeStyle = boxColor;
  ctx.lineWidth = 3;
  const glow = (Math.sin(p * Math.PI) * 0.5 + 1) * 4;
  ctx.shadowColor = "rgba(22, 163, 74, 0.5)";
  ctx.shadowBlur = glow;
  ctx.strokeRect(ox + 1.5, oy + 1.5, size - 3, size - 3);
  ctx.shadowBlur = 0;

  // highlighted sample square (top-left) + dashed connector to the lens.
  const hx = ox + cell / 2;
  const hy = oy + cell / 2;
  ctx.strokeStyle = "#0f766e";
  ctx.lineWidth = 2;
  ctx.strokeRect(ox + 1, oy + 1, cell - 2, cell - 2);

  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "#34d399";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(hx, hy);
  ctx.lineTo(lx + lsize / 2, ly + lsize / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // captions on top of the grid.
  text(`${LEVELS[s].name} = ${pp(LEVELS[s].value)} bytes`, ox + 6, oy + 4, boxColor, "left", "top");
  text(`each square = 1 ${NAMES[Math.max(0, s - 1)]}`, ox + 6, oy + 20, "#64748b", "left", "top");
}

function drawLens(s: number, lx: number, ly: number, lsize: number): void {
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#16a34a";
  ctx.lineWidth = 2;
  ctx.shadowColor = "rgba(22, 163, 74, 0.25)";
  ctx.shadowBlur = 8;
  ctx.fillRect(lx, ly, lsize, lsize);
  ctx.strokeRect(lx + 0.5, ly + 0.5, lsize - 1, lsize - 1);
  ctx.shadowBlur = 0;

  // lens content: one square of the selected unit, split into 1024 sub-squares.
  if (s === 1) {
    const m = 14;
    ctx.fillStyle = color(0);
    ctx.fillRect(lx + m, ly + m, lsize - m * 2, lsize - m * 2);
    text("1 byte", lx + lsize / 2, ly - 6, boxColor, "center");
    return;
  }

  const sub = GRID;
  const sc = lsize / sub;
  ctx.fillStyle = color(s - 2);
  ctx.fillRect(lx, ly, lsize, lsize);

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 1; i < sub; i++) {
    const d = i * sc;
    ctx.moveTo(lx + d + 0.5, ly);
    ctx.lineTo(lx + d + 0.5, ly + lsize);
    ctx.moveTo(lx, ly + d + 0.5);
    ctx.lineTo(lx + lsize, ly + d + 0.5);
  }
  ctx.stroke();

  const plural = s - 2 === 0 ? "s" : "";
  text(`1 ${NAMES[s - 1]}`, lx + lsize / 2, ly - 6, boxColor, "center");
  text(`= 1024 ${NAMES[s - 2]}${plural}`, lx + lsize / 2, ly + lsize + 16, "#64748b", "center");
}

effect(draw);

effect(() => {
  const s = index.value;
  countEl.textContent = pp(LEVELS[s].value);
  equivEl.textContent = LEVELS[s].equiv;
  cellLabelEl.textContent = s === 0 ? "1 byte" : `each square = 1 ${NAMES[s - 1]}`;
  gridLabelEl.textContent = NAMES[s];
});

selector.replaceChildren();
LEVELS.forEach((level, i) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = level.name;
  btn.className = classNames(
    "rounded-full",
    "px-4",
    "py-1.5",
    "text-sm",
    "font-semibold",
    "transition-colors",
    "focus:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-green-400",
    "text-slate-500 hover:text-green-700",
  );

  btn.addEventListener("click", () => {
    pinned.value = true;
    if (i !== index.value) {
      animateTo(i);
    }
  });

  selector.appendChild(btn);
});

effect(() => {
  (selector.childNodes as NodeListOf<HTMLButtonElement>).forEach((btn, i) => {
    btn.classList.toggle("bg-green-600", i === index.value);
    btn.classList.toggle("text-white", i === index.value);
  });
});

function animateTo(next: number): void {
  stage.classList.remove("bs-in", "bs-out");
  void stage.offsetWidth;
  stage.classList.add("bs-out");

  window.setTimeout(() => {
    index.value = next;

    stage.classList.remove("bs-out");
    void stage.offsetWidth;
    stage.classList.add("bs-in");
    window.setTimeout(() => stage.classList.remove("bs-in"), 460);

    progress.value = 0;
    const start = performance.now();
    const tick = (now: number): void => {
      progress.value = Math.min(1, (now - start) / 600);
      if (progress.value < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, 240);
}

window.setInterval(() => {
  if (!pinned.value) {
    animateTo((index.value + 1) % LEVELS.length);
  }
}, 4000);

export {};
