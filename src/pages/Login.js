import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";

import axiosInstance from "../api/axiosInstance";

import { auth, provider } from "../config/firebase";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const {
        user:
          {
            displayName,
            reloadUserInfo: { localId }
          }
      } = await signInWithPopup(auth, provider);

      const { data: { error }, status } = await axiosInstance.post(
        "/google/login",
        { username: displayName, googleId: localId }
      );

      if (status === 200) {
        navigate("/");
      } else {
        setErrorMessage(error);
      }
    } catch (err) {
      setErrorMessage(err);
    }
  };

  return (
    <>
      <button onClick={handleClick}>Google Login</button>
      <div>{errorMessage}</div>
    </>
  );
}
