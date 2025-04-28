// src/contexts/FolderContext.jsx
import React, { createContext, useContext, useState } from "react";

const FolderContext = createContext();

export function useFolder() {
  return useContext(FolderContext);
}

export function FolderProvider({ children }) {
  const [path, setPath] = useState([{ id: null, name: "Home" }]);

  const openFolder = (folderId, folderName) => {
    setPath((prev) => [...prev, { id: folderId, name: folderName }]);
  };

  const goBack = () => {
    if (path.length > 1) {
      setPath((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const goHome = () => {
    setPath([{ id: null, name: "Home" }]);
  };

  const currentFolderId = path[path.length - 1]?.id;
  const currentFolderName = path[path.length - 1]?.name;

  return (
    <FolderContext.Provider value={{ path, currentFolderId, currentFolderName, openFolder, goBack, goHome }}>
      {children}
    </FolderContext.Provider>
  );
}
