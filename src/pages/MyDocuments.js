import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import NavBar from "../components/NavBar";
import DocumentCard from "../components/DocumentCard";

import { UserContext } from "../context/userContext";
import axiosInstance from "../api/axiosInstance";
import { ERROR } from "../constants/error";

export default function MyDocuments() {
  const [documents, setDocuments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    loggedInUser: { reloadUserInfo: { localId } }
  } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getDocuments = async () => {
      try {
        const {
          data: { documents }
        } = await axiosInstance.get(`/documents/${localId}`);

        setDocuments(documents);
      } catch (err) {
        setErrorMessage(ERROR.FAIL_GET_DOCUMENTS);
      }
    }

    if (localId) {
      getDocuments();
    }
  }, [localId]);

  return (
    <Wrapper>
      <div>{errorMessage}</div>
      <NavBar />
      <DocumentWrapper>
        {documents.map((document) => {
          return (
            <DocumentCard
              key={document._id}
              documentId={document._id}
              handleClick={() => navigate(`/documents/${document._id}`)}
              textBody={document.body.ops[0].insert || ""}
              updatedAt={document.updatedAt.split("T", 1)[0]}
            />
          );
        })}
      </DocumentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DocumentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 35px;
`;
