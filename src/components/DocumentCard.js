import { useState, useEffect } from "react";
import styled from "styled-components";

import useSocket from "../hooks/useSocket";

export default function DocumentCard({ documentId, handleClick, textBody, updatedAt }) {
  const [isWriting, setIsWriting] = useState(false);
  const [socket, disconnect] = useSocket(documentId);

  useEffect(() => {
    socket.on("receive_changes", (_, receivingDocumentId) => {
      if (receivingDocumentId === documentId) {
        setIsWriting(true);
      }
    });
  }, [documentId]);

  return (
    <Wrapper onClick={handleClick} data-testid="documentCard">
      <div>{textBody.length > 60 ? textBody.slice(0, 60) + "..." : textBody}</div>
      <small>latest update : {updatedAt}</small>
      <div>{isWriting && "Writing...."}</div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  height: 80px;
  border: none;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  background-color: #d1e7b7;
  
  &>: last-child {
    text-align: right;
  }
`;
