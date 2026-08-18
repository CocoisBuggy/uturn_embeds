export function initHover(): void {
  const style = document.createElement("style");
  style.textContent = `
[data-path] { cursor: pointer; }
[data-path].shared-hover {
  outline: 2px solid rgb(34 197 94);
  outline-offset: 2px;
  background-color: rgb(236 253 245);
}
`;
  document.head.appendChild(style);

  let hovered: string | null = null;

  function setHover(path: string): void {
    if (path === hovered) return;
    hovered = path;
    document
      .querySelectorAll<HTMLElement>("[data-path]")
      .forEach((el) => el.classList.toggle("shared-hover", el.dataset.path === path));
  }

  function clearHover(): void {
    if (hovered === null) return;
    hovered = null;
    document
      .querySelectorAll<HTMLElement>("[data-path]")
      .forEach((el) => el.classList.remove("shared-hover"));
  }

  document.addEventListener("pointerover", (e: PointerEvent) => {
    const leaf = (e.target as HTMLElement).closest?.("[data-path]") as
      | HTMLElement
      | null;
    if (!leaf?.dataset.path) {
      clearHover();
      return;
    }
    setHover(leaf.dataset.path);
  });
}
