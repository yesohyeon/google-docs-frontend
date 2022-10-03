import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";

import { UserContext } from "./context/userContext";

function App() {
  const { loggedInUser } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={loggedInUser ? <Home /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
