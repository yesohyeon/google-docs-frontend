import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signInWithPopup } from "firebase/auth";
import styled from "styled-components";

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
    <Wrapper>
      <Button onClick={handleClick}>Login</Button>
      <div>{errorMessage}</div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Button = styled.button`
  padding: 15px;
  border: 4px solid #c5e1a5;
  border-radius: 8px;
  font-size: 30px;
  color: #5D8700;
`;
