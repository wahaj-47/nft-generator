import { ChonkyActions, FileHelper, FullFileBrowser } from "chonky";
import { useProjectInfoContext } from "../../providers/ProjectInfoProvider";
import { useCallback, useMemo, useRef, useState } from "react";

const useFiles = (currentFolderId) => {
  const { fileMap } = useProjectInfoContext();

  return useMemo(() => {
    let currentFolder = fileMap[currentFolderId];

    if (!currentFolder) currentFolder = fileMap.root;

    const files = currentFolder.childrenIds
      ? currentFolder.childrenIds.map((fileId) => fileMap[fileId] ?? null)
      : [];
    return files;
  }, [currentFolderId, fileMap]);
};

export const useFolderChain = (currentFolderId) => {
  const { fileMap } = useProjectInfoContext();

  return useMemo(() => {
    let currentFolder = fileMap[currentFolderId];

    if (!currentFolder) currentFolder = fileMap.root;

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
  const { removeFiles } = useProjectInfoContext();

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
      if (data.id === ChonkyActions.DeleteFiles.id) {
        const selectedFiles = data.state.selectedFiles;
        removeFiles(selectedFiles);
      }
    },
    [setCurrentFolderId, fileInputRef, removeFiles]
  );
};

export default function Explorer() {
  const { addFiles } = useProjectInfoContext();
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
    addFiles(e.target.files, currentFolderId, resetFileInput);
  };

  const resetFileInput = () => {
    fileInputRef.current.value = "";
  };

  return (
    <div className={`module`}>
      <h1>Files</h1>
      <FullFileBrowser
        files={files}
        folderChain={folderChain}
        fileActions={myFileActions}
        onFileAction={handleFileAction}
        darkMode
        clearSelectionOnOutsideClick
      ></FullFileBrowser>
      <input
        value={null}
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        style={{ display: "none" }}
        accept="image/png"
        multiple
      />
    </div>
  );
}
