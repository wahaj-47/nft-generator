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
import { useCallback, useMemo, useRef, useState } from "react";

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

export const useFileActionHandler = ({ setCurrentFolderId, fileInputRef }) => {
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
      if (data.id === ChonkyActions.UploadFiles.id) {
        fileInputRef.current.click();
      }
    },
    [setCurrentFolderId, fileInputRef]
  );
};

export default function Explorer() {
  const { addFile } = useProjectInfoContext();
  const fileInputRef = useRef(null);

  const [currentFolderId, setCurrentFolderId] = useState("root");
  const folderChain = useFolderChain(currentFolderId);
  const files = useFiles(currentFolderId);
  const handleFileAction = useFileActionHandler({
    setCurrentFolderId,
    fileInputRef,
  });

  const myFileActions =
    folderChain.length < 3
      ? []
      : [ChonkyActions.UploadFiles, ChonkyActions.DeleteFiles];

  const onFileChange = (e) => {
    addFile(e.target.files[0], currentFolderId);
  };

  return (
    <div className={`module ${styles.container}`}>
      <h1>Files</h1>
      <FullFileBrowser
        files={files}
        folderChain={folderChain}
        fileActions={myFileActions}
        onFileAction={handleFileAction}
        darkMode
        clearSelectionOnOutsideClick
      >
        <FileNavbar />
        <FileToolbar />
        <FileList />
        <FileContextMenu />
      </FullFileBrowser>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        style={{ display: "none" }}
        accept="image/png"
      />
    </div>
  );
}
