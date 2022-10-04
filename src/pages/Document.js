import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

import TextEditor from "../component/TextEditor/TextEditor";

import { UserContext } from "../context/userContext";
import useSocket from "../hooks/useSocket";

import axiosInstance from "../api/axiosInstance";
import { ERROR } from "../constants/error";

export default function Document() {
  const [quill, setQuill] = useState();
  const [creatorId, setCreatorId] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const { documentId } = useParams();
  const { loggedInUser: { reloadUserInfo: { localId } } } = useContext(UserContext);
  const navigate = useNavigate();

  const [socket, disconnect] = useSocket(documentId);

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleSaveClick = async () => {
    try {
      const { status } = await axiosInstance
        .patch(`/documents/${documentId}`, { body: quill.getContents() });

      if (status === 200) {
        navigate("/");
      }
    } catch (err) {
      setErrorMessage(ERROR.FAIL_SAVE_DOCUMENT);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const { status } = await axiosInstance.delete(`/documents/${documentId}`);

      if (status === 200) {
        navigate("/");
      }
    } catch (err) {
      setErrorMessage(ERROR.FAIL_DELETE_DOCUMENT);
    }
  };

  useEffect(() => {
    socket.once("load_document", (_, creatorId) => {
      setCreatorId(creatorId);
      setIsChecking(false);
    });
  }, [documentId])

  return (
    <>
      <div>{errorMessage}</div>
      <ButtonWrapper>
        <button onClick={handleHomeClick}>My documents</button>
        <button onClick={handleSaveClick}>Save</button>
        {!isChecking && localId === creatorId && (
          <button onClick={handleDeleteClick}>Delete</button>
        )}
      </ButtonWrapper>
      <TextEditor
        documentId={documentId}
        quill={quill}
        handleQuill={(quill) => setQuill(quill)}
      />
    </>
  );
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  
  > * {
    margin: 5px;
    padding: 10px;
    border: 4px solid #D3D3D3;
    border-radius: 8px;
    font-size: 16px;
    color: #949494;
  }
`;
