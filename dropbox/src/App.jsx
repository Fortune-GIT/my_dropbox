// src/App.jsx
import React from "react";
import { FolderProvider } from "./contexts/FolderContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FileTable from "./components/FileTable";
import StorageUsage from "./components/StorageUsage";
// Temporary Fix Component
import FixOldFiles from "./components/FixOldFiles";

import "./styles/Sidebar.css";
import "./styles/Topbar.css";
import "./styles/FileTable.css";
import "./styles/StorageUsage.css";
import "./styles/CreateFolderModal.css";
import "./styles/ContextMenu.css";
import "./styles/PreviewModal.css"; // Optional if you have preview

export default function App() {
  return (
    <FolderProvider>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Topbar />
          <FileTable />
          <StorageUsage />
          <FixOldFiles />
        </div>
      </div>
    </FolderProvider>
  );
}
