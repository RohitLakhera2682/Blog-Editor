import React from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AllBlogsPage from "./pages/AllBlogsPage";
import EditorPage from "./pages/EditorPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import BlogViewer from "./pages/BlogViewer";

// Optional: Protect routes that require authentication
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? children : <Navigate to="/signin" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/blogs" />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <AllBlogsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />

          <Route
          path="/blog/:id"
          element={
            <ProtectedRoute>
              <BlogViewer/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<p className="text-center mt-20 text-gray-600">404 | Page not found</p>} />
      </Routes>
       <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;
