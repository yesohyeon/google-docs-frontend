import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import MyDocuments from "./pages/MyDocuments";
import Document from "./pages/Document";

import { UserContext } from "./context/userContext";

export default function App() {
  const { loggedInUser } = useContext(UserContext);

  return (
    <Routes>
      <Route
        path="/"
        element={loggedInUser ? <MyDocuments /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/documents/:documentId"
        element={loggedInUser ? <Document /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}
