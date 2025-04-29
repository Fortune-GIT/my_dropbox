import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { FolderProvider } from "./contexts/FolderContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FileTable from "./components/FileTable";
import StorageUsage from "./components/StorageUsage";

import SignUp from "./components/SignUp";
import Login from "./components/Login";

import "./styles/Sidebar.css";
import "./styles/Topbar.css";
import "./styles/FileTable.css";
import "./styles/StorageUsage.css";
import "./styles/CreateFolderModal.css";
import "./styles/ContextMenu.css";
import "./styles/PreviewModal.css";
import "./styles/Auth.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Main App */}
        <Route
          path="/*"
          element={
            user ? (
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
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
