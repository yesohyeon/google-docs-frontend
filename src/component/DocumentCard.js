import { useState, useEffect } from "react";
import styled from "styled-components";

import useSocket from "../hooks/useSocket";

export default function DocumentCard({ documentId, handleClick, textBody, createdAt }) {
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
    <>
      <Wrapper onClick={handleClick} data-testid="documentCard">
        <div>{textBody}</div>
        <small>{createdAt}</small>
        <div>{isWriting && "Writing...."}</div>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  margin: 5px;
  padding: 5px;
`;
