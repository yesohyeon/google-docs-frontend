import { io } from "socket.io-client";
import { useCallback } from "react";

const sockets = {};
const backUrl = process.env.REACT_APP_BACK_URL;

const useSocket = (documentId) => {
  const disconnect = useCallback(() => {
    if (documentId) {
      sockets[documentId]?.disconnect();

      delete sockets[documentId];
    }
  }, [documentId]);

  if (!documentId) {
    return [undefined, disconnect];
  }

  if (!sockets[documentId]) {
    sockets[documentId] = io(`${backUrl}`, {
      transports: [`websocket`],
    });
  }

  return [sockets[documentId], disconnect];
};

export default useSocket;
