import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MyDocuments from "./pages/MyDocuments";
import Login from "./pages/Login";
import Document from "./pages/Document";
import NotFound from "./components/NotFound";

import { UserContext } from "./context/userContext";

export default function Pages() {
  const { loggedInUser } = useContext(UserContext);

  return (
    <Routes>
      <Route
        path="/"
        element={loggedInUser ? <MyDocuments /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/documents/:documentId"
        element={loggedInUser ? <Document /> : <Navigate to="/login" />}
      />
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

