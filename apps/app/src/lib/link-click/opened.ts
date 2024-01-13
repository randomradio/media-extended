import type { Workspace, WorkspaceLeaf } from "obsidian";
import type { MediaEmbedViewState } from "@/media-view/iframe-view";
import type { MediaUrlViewState } from "@/media-view/url-view";
import type { MediaWebpageViewState } from "@/media-view/webpage-view";
import type { UrlMediaInfo } from "./external";
import { isFileMediaInfo, type FileMediaInfo } from "./internal";

function filterFileLeaf(leaf: WorkspaceLeaf, info: FileMediaInfo) {
  const { file: filePath } = leaf.view.getState() as { file: string };
  return filePath === info.file.path;
}

function filterUrlLeaf(leaf: WorkspaceLeaf, info: UrlMediaInfo) {
  const { source } = leaf.view.getState() as
    | MediaEmbedViewState
    | MediaWebpageViewState
    | MediaUrlViewState;
  return source && info.isSameSource(source);
}

export function getLeavesOfMedia(
  info: UrlMediaInfo | FileMediaInfo,
  workspace: Workspace,
) {
  return workspace.getLeavesOfType(info.viewType).filter((leaf) => {
    if (isFileMediaInfo(info)) {
      return filterFileLeaf(leaf, info);
    } else {
      return filterUrlLeaf(leaf, info);
    }
  });
}

export function updateHash(hash: string, leaf: WorkspaceLeaf) {
  leaf.setEphemeralState({ subpath: hash });
}

export function openInOpenedPlayer(
  info: FileMediaInfo | UrlMediaInfo,
  workspace: Workspace,
): boolean {
  const opened = getLeavesOfMedia(info, workspace);
  if (opened.length > 0) {
    updateHash(info.hash, opened[0]);
    return true;
  }
  return false;
}
