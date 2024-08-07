import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Author from "./components/Author";
import ThemeToggler from "./components/ThemeToggler";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Context Imports
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

import AppRoutes from "./Routes/AppRoutes";
function App() {
  return (
    <Router>
      <AuthProvider>
        <main className="relative w-full h-screen bg-[--bg-color]">
          <ThemeToggler />
          <DataProvider>
            <AppRoutes />
          </DataProvider>
          <Author />
        </main>
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
}
export default App;
