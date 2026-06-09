// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SetupPage from "./pages/SetupPage";
import NotificationsPage from "./pages/NotificationsPage";
import { setAuthToken } from "./middleware/logger";

const App = () => {
  const token = localStorage.getItem("access_token");
  if (token) setAuthToken(token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup" element={<SetupPage />} />
        <Route
          path="/notifications"
          element={
            localStorage.getItem("access_token")
              ? <NotificationsPage />
              : <Navigate to="/setup" replace />
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={localStorage.getItem("access_token") ? "/notifications" : "/setup"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;