export interface FileEntry {
  name: string;
  icon: string;
}

export interface FolderEntry {
  name: string;
  children: FileNode[];
}

export type FileNode = FileEntry | FolderEntry;

export interface NavEntry {
  folder: FolderEntry;
  path: string;
}

export function isFolder(node: FileNode): node is FolderEntry {
  return "children" in node;
}

export function joinPath(base: string, name: string): string {
  return `${base}/${name}`;
}

export const ROOT_PATH = "Home";

export const root: FolderEntry = {
  name: ROOT_PATH,
  children: [
    {
      name: "Documents",
      children: [
        { name: "README.md", icon: "file-text" },
        { name: "notes.txt", icon: "file-text" },
        { name: "resume.pdf", icon: "file-text" },
      ],
    },
    {
      name: "Media",
      children: [
        { name: "photo-collage.png", icon: "image" },
        { name: "theme-song.mp3", icon: "music" },
        { name: "trailer.mp4", icon: "file-video" },
        { name: "notes.wav", icon: "file-audio" },
      ],
    },
    { name: "vacation.jpg", icon: "image" },
    { name: "family-photo.webp", icon: "image" },
    { name: "todo-list.txt", icon: "file-text" },
    { name: "invoice.pdf", icon: "file-text" },
  ],
};

export function nodeAtPath(folder: FolderEntry, segs: string[]): FileNode | null {
  if (segs[0] !== folder.name) return null;
  let node: FileNode = folder;
  for (const seg of segs.slice(1)) {
    if (!isFolder(node)) return null;
    const next: FileNode | undefined = node.children.find((c) => c.name === seg);
    if (!next) return null;
    node = next;
  }
  return node;
}

export function removeAtPath(folder: FolderEntry, segs: string[], node: FileNode): boolean {
  if (segs.length <= 1) return false;
  const childName = segs[segs.length - 1];
  const parent = nodeAtPath(folder, segs.slice(0, -1));
  if (!parent || !isFolder(parent)) return false;
  const idx = parent.children.findIndex((c) => c.name === childName && c === node);
  if (idx >= 0) {
    parent.children.splice(idx, 1);
    return true;
  }
  return false;
}
