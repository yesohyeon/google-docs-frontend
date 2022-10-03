import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";

import axiosInstance from "../api/axiosInstance";

import { auth, provider } from "../config/firebase";
import { ERROR } from "../constants/error";

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

      const { status } = await axiosInstance.post(
        "/google/login",
        { username: displayName, googleId: localId }
      );

      status === 200 ? navigate("/") : setErrorMessage(ERROR.FAIL_LOGIN);
    } catch (err) {
      setErrorMessage(ERROR.FAIL_LOGIN);
    }
  };

  return (
    <>
      <button onClick={handleClick}>Google Login</button>
      <div>{errorMessage}</div>
    </>
  );
}
