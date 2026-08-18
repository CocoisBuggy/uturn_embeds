type Side = "above" | "below";

function badge(label: string, side: Side): HTMLElement {
  const col = document.createElement("div");
  col.className = "anno-col flex flex-col items-center";

  const pill = document.createElement("span");
  pill.className = "anno-pill fa-pill";
  pill.textContent = label;

  const tail = document.createElement("div");
  tail.className = "relative flex h-11 w-full items-center justify-center";

  const line = document.createElement("div");
  line.className = "anno-line h-full w-px bg-green-400";
  line.classList.add(side === "above" ? "grow-down" : "grow-up");

  const arrow = document.createElement("div");
  arrow.className = "anno-arrow absolute h-2.5 w-2.5 rounded-[2px] bg-green-400";

  tail.append(line, arrow);

  if (side === "above") {
    col.append(pill, tail);
    arrow.style.top = "100%";
    arrow.style.marginTop = "-4px";
  } else {
    col.append(tail, pill);
    arrow.style.bottom = "100%";
    arrow.style.marginBottom = "-4px";
  }

  return col;
}

export interface Annotations {
  filename: HTMLElement;
  dot: HTMLElement;
  filetype: HTMLElement;
}

export function createAnnotations(): Annotations {
  const filename = badge("Filename", "above");
  const dot = badge("Dot", "above");
  const filetype = badge("Filetype", "below");
  filetype.classList.add("align-left");
  return { filename, dot, filetype };
}
