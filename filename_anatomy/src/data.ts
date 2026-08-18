import { FileArchive, FileAudio, FileCode, FileSpreadsheet, FileText, FileVideo, Image, Music } from "lucide";

export type FileIcon = typeof FileText;

export interface FileEntry {
  base: string;
  ext: string;
  icon: FileIcon;
}

export const files: FileEntry[] = [
  { base: "photo-album", ext: "png", icon: Image },
  { base: "annual-report", ext: "pdf", icon: FileText },
  { base: "demo-mix", ext: "mp3", icon: Music },
  { base: "product-tour", ext: "mp4", icon: FileVideo },
  { base: "q2-budget", ext: "xlsx", icon: FileSpreadsheet },
  { base: "source-lib", ext: "ts", icon: FileCode },
  { base: "archives", ext: "zip", icon: FileArchive },
  { base: "voice-note", ext: "wav", icon: FileAudio },
];
