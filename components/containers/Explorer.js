import styles from "../../styles/Explorer.module.css";
import {
  ChonkyActions,
  FileContextMenu,
  FileHelper,
  FileList,
  FileNavbar,
  FileToolbar,
  FullFileBrowser,
} from "chonky";
import { useProjectInfoContext } from "../../providers/ProjectInfoProvider";
import { useCallback, useMemo, useState } from "react";

const useFiles = (currentFolderId) => {
  const { fileMap } = useProjectInfoContext();

  return useMemo(() => {
    const currentFolder = fileMap[currentFolderId];
    const files = currentFolder.childrenIds
      ? currentFolder.childrenIds.map((fileId) => fileMap[fileId] ?? null)
      : [];
    return files;
  }, [currentFolderId, fileMap]);
};

export const useFolderChain = (currentFolderId) => {
  const { fileMap } = useProjectInfoContext();

  return useMemo(() => {
    const currentFolder = fileMap[currentFolderId];

    const folderChain = [currentFolder];

    let parentId = currentFolder.parentId;
    while (parentId) {
      const parentFile = fileMap[parentId];
      if (parentFile) {
        folderChain.unshift(parentFile);
        parentId = parentFile.parentId;
      } else {
        parentId = null;
      }
    }

    return folderChain;
  }, [currentFolderId, fileMap]);
};

export const useFileActionHandler = (setCurrentFolderId) => {
  return useCallback(
    (data) => {
      if (data.id === ChonkyActions.OpenFiles.id) {
        const { targetFile, files } = data.payload;
        const fileToOpen = targetFile ?? files[0];
        if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
          setCurrentFolderId(fileToOpen.id);
          return;
        }
      }
    },
    [setCurrentFolderId]
  );
};

export default function Explorer() {
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const folderChain = useFolderChain(currentFolderId);
  const files = useFiles(currentFolderId);
  const handleFileAction = useFileActionHandler(setCurrentFolderId);

  return (
    <div className={`module ${styles.container}`}>
      <h1>Files</h1>
      <FullFileBrowser
        files={files}
        folderChain={folderChain}
        onFileAction={handleFileAction}
      >
        <FileNavbar />
        <FileToolbar />
        <FileList />
        <FileContextMenu />
      </FullFileBrowser>
    </div>
  );
}
