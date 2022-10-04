import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { signOut, onAuthStateChanged } from "firebase/auth";
import styled from "styled-components";

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
        const {
          status,
          data: { documentId }
        } = await axiosInstance.post("/documents", { googleId });

        status === 201 ? (
          navigate(`/documents/${documentId}`)
        ) : (
          setErrorMessage(ERROR.FAIL_CREATE_DOCUMENT)
        );
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
    <Wrapper>
      <nav>
        <Button onClick={handleHomeClick}>My documents</Button>
        <Button onClick={handleCreateClick}>Create document</Button>
        <Button onClick={handleLogOutClick}>Log out</Button>
      </nav>
      <div>{errorMessage}</div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  margin: 5px;
  padding: 10px;
  border: 4px solid #c5e1a5;
  border-radius: 8px;
  font-size: 16px;
  color: #5D8700;
`;
