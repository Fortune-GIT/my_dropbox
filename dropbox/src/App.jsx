// src/App.jsx
import React from "react";
import { FolderProvider } from "./contexts/FolderContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FileTable from "./components/FileTable";
import StorageUsage from "./components/StorageUsage";

import "./styles/Sidebar.css";
import "./styles/Topbar.css";
import "./styles/FileTable.css";
import "./styles/StorageUsage.css";
import "./styles/CreateFolderModal.css";
import "./styles/ContextMenu.css";
import "./styles/PreviewModal.css"; /* (optional if you use a separate Preview Modal CSS) */

export default function App() {
  return (
    <FolderProvider>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Topbar />
          <FileTable />
          <StorageUsage />
        </div>
      </div>
    </FolderProvider>
  );
}
