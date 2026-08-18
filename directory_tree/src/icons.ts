import {
  createIcons,
  FileArchive,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  FolderOpen,
  Image,
  Music,
} from "lucide";

export function renderIcons(): void {
  createIcons({
    icons: {
      FileArchive,
      FileAudio,
      FileCode,
      FileSpreadsheet,
      FileText,
      FileVideo,
      Folder,
      FolderOpen,
      Image,
      Music,
    },
  });
}
