// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FolderProvider } from "./contexts/FolderContext";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FileTable from "./components/FileTable";
import StorageUsage from "./components/StorageUsage";

import SignUp from "./components/SignUp";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute"; 

import "./styles/Sidebar.css";
import "./styles/Topbar.css";
import "./styles/FileTable.css";
import "./styles/StorageUsage.css";
import "./styles/CreateFolderModal.css";
import "./styles/ContextMenu.css";
import "./styles/PreviewModal.css";
import "./styles/Auth.css";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected App Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute> 
              <FolderProvider>
                <div className="app">
                  <Sidebar />
                  <div className="main">
                    <div className="main-inner">
                      <Topbar />
                      <FileTable />
                    </div>
                    <StorageUsage />
                  </div>
                </div>
              </FolderProvider>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
