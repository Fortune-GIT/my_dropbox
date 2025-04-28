import React, { createContext, useContext, useState } from "react";

const FolderContext = createContext();

export function useFolder() {
  return useContext(FolderContext);
}

export function FolderProvider({ children }) {
  const [currentFolderId, setCurrentFolderId] = useState(null); // Which folder you're inside
  const [currentFolderName, setCurrentFolderName] = useState("Home"); // Name for display (optional)
  const [folderHistory, setFolderHistory] = useState([]); // For going back
  const [currentView, setCurrentView] = useState("home"); // home, folder, pictures, shared, deleted

  // Go Home
  const goHome = () => {
    setCurrentFolderId(null);
    setCurrentFolderName("Home");
    setCurrentView("home");
    setFolderHistory([]); // Reset history
  };

  // Open a specific folder
  const openFolder = (folderId, folderName = "Folder") => {
    if (currentFolderId) {
      setFolderHistory(prev => [...prev, { id: currentFolderId, name: currentFolderName }]);
    }
    setCurrentFolderId(folderId);
    setCurrentFolderName(folderName);
    setCurrentView("folder");
  };

  // Go back to previous folder
  const openParentFolder = () => {
    if (folderHistory.length > 0) {
      const lastFolder = folderHistory[folderHistory.length - 1];
      setCurrentFolderId(lastFolder.id);
      setCurrentFolderName(lastFolder.name);
      setFolderHistory(prev => prev.slice(0, -1));
    } else {
      // If no history, go home
      goHome();
    }
  };

  // Open special views
  const openPictures = () => {
    setCurrentFolderId(null);
    setCurrentFolderName("Pictures");
    setCurrentView("pictures");
    setFolderHistory([]); // Clear history when switching mode
  };

  const openSharedFiles = () => {
    setCurrentFolderId(null);
    setCurrentFolderName("Shared Files");
    setCurrentView("shared");
    setFolderHistory([]);
  };

  const openDeletedFiles = () => {
    setCurrentFolderId(null);
    setCurrentFolderName("Deleted Files");
    setCurrentView("deleted");
    setFolderHistory([]);
  };

  return (
    <FolderContext.Provider
      value={{
        currentFolderId,
        currentFolderName,
        currentView,
        goHome,
        openFolder,
        openParentFolder,
        openPictures,
        openSharedFiles,
        openDeletedFiles,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
}
