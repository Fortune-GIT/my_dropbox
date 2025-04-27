// src/contexts/FolderContext.jsx
import React, { createContext, useState, useContext } from "react";

const FolderContext = createContext();

export function useFolder() {
  return useContext(FolderContext);
}

export function FolderProvider({ children }) {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [currentFolderName, setCurrentFolderName] = useState("Home");

  const openFolder = (folderId, folderName) => {
    setCurrentFolderId(folderId);
    setCurrentFolderName(folderName);
  };

  const goHome = () => {
    setCurrentFolderId(null);
    setCurrentFolderName("Home");
  };

  return (
    <FolderContext.Provider value={{ currentFolderId, currentFolderName, openFolder, goHome }}>
      {children}
    </FolderContext.Provider>
  );
}
