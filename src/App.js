import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Document from "./pages/Document";

import { UserContext } from "./context/userContext";

export default function App() {
  const { loggedInUser } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={loggedInUser ? <Home /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/documents/:documentId" element={loggedInUser ? <Document /> : <Navigate to="/login" />} />
    </Routes>
  );
}
