import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";

import axiosInstance from "../api/axiosInstance";
import { auth, authenticate } from "../config/firebase";

import { UserContext } from "../context/userContext";
import { ERROR } from "../constants/error";

export default function NavBar() {
  const [errorMessage, setErrorMessage] = useState("");
  const { setLoggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate("/");
      } else {
        authenticate();
      }
    });
  };
  const handleCreateClick = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const googleId = user?.reloadUserInfo.localId;
        const { status, data: { documentId } } = await axiosInstance.post("/documents", { googleId });

        status === 201 ? navigate(`/documents/${documentId}`) : setErrorMessage(ERROR.FAIL_CREATE_DOCUMENT);
      } else {
        authenticate();
      }
    });
  };

  const handleLogOutClick = async () => {
    try {
      await signOut(auth);

      setLoggedInUser(null);

      navigate("/login");
    } catch (err) {
      setErrorMessage(ERROR.FAIL_LOG_OUT);
    }
  };

  return (
    <>
      <nav>
        <button onClick={handleHomeClick}>Home</button>
        <button onClick={handleCreateClick}>Create document</button>
        <button onClick={handleLogOutClick}>Log out</button>
      </nav>
      <div>{errorMessage}</div>
    </>
  );
}
