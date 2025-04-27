// src/App.jsx
import React from "react";
import { FolderProvider } from "./contexts/FolderContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FileTable from "./components/FileTable";
import StorageUsage from "./components/StorageUsage";

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
