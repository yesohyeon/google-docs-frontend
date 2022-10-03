import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import TextEditor from "../component/TextEditor/TextEditor";

import axiosInstance from "../api/axiosInstance";
import { ERROR } from "../constants/error";

export default function Document() {
  const { documentId } = useParams();
  const [quill, setQuill] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleSaveClick = async () => {
    try {
      const { status } = await axiosInstance.put(`/documents/${documentId}`, { body: quill.getContents() });

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

  return (
    <>
      <div>{errorMessage}</div>
      <button onClick={handleHomeClick}>Home</button>
      <button onClick={handleSaveClick}>Save Document</button>
      <button onClick={handleDeleteClick}>Delete Document</button>
      <TextEditor documentId={documentId} quill={quill} handleQuill={(quill) => setQuill(quill)} />
    </>
  );
}
