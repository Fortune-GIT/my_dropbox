// src/App.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FileTable from "./components/FileTable";
import StorageUsage from "./components/StorageUsage";
import "./styles/Sidebar.css";
import "./styles/Topbar.css";
import "./styles/FileTable.css";
import "./styles/StorageUsage.css";

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <FileTable />
        <StorageUsage />
      </div>
    </div>
  );
}
