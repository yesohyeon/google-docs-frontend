import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

import NavBar from "../component/NavBar";
import DocumentCard from "../component/DocumentCard";

import { UserContext } from "../context/userContext";

export default function Home() {
  const { loggedInUser: { reloadUserInfo: { localId } } } = useContext(UserContext);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getDocuments() {
      const { data: { documents } } = await axiosInstance.get(`/documents/${localId}`);

      setDocuments(documents);
    }

    if (localId) {
      getDocuments();
    }
  }, [localId]);

  return (
    <>
      <NavBar />
      {documents.map((document) => {
        return (
          <DocumentCard
            key={document._id}
            handleClick={() => navigate(`/documents/${document._id}`)}
            textBody={document.body.ops[0].insert || ""}
            createdAt={document.createdAt}
          />
        );
      })}
    </>
  );
}
