import { useEffect, useContext, useCallback, useMemo } from "react";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillCursors from "quill-cursors";
import randomColor from "randomcolor";

import { UserContext } from "../../context/userContext";
import useSocket from "../../hooks/useSocket";

import { selectionChangeHandler } from "../../utils/selectionChangeHandler";

import "./styles.css";

const saveInterval = 20000;

export default function TextEditor({ documentId, quill, handleQuill }) {
  const { loggedInUser: { displayName: username } } = useContext(UserContext);
  const [socket, disconnect] = useSocket(documentId);
  const cursor = useMemo(() => {
    return quill ? quill.getModule("cursors") : null;
  }, [quill]);

  const updateContents = (delta) => {
    quill.updateContents(delta);
  };

  const sendChanges = (delta, oldDelta, source) => {
    if (source !== "user") {
      return;
    }

    socket.emit("send_changes", delta);
  };

  useEffect(() => {
    if (!cursor) {
      return;
    }

    socket.on("user_join", (socket) => {
      cursor.createCursor(socket.id, socket.nickname, randomColor());
    });

    socket.on("inform_collaborator", (sockets) => {
      sockets.forEach(socket => {
        cursor.createCursor(socket.id, socket.nickname, randomColor());
      });
    });

    socket.on("receive_selection", ({ range, source, id }) => {
      selectionChangeHandler(cursor, id)(range, null, source);
    });
  }, [cursor]);

  useEffect(() => {
    if (!socket || !quill) {
      return;
    }
    socket.once("load_document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get_document", documentId, username);

    const interval = setInterval(() => {
      socket.emit("save_document", quill.getContents());
    }, saveInterval);

    quill.on("text-change", sendChanges);

    socket.on("receive_changes", updateContents);

    quill.on("selection-change", (range, _, source) => {
      socket.emit("send_selection", { range, source, id: socket.id });
    });

    return () => {
      clearInterval(interval);
      socket.off("receive_changes");
      quill.off("text-change");
    }
  }, [quill, documentId]);


  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) {
      return;
    }

    wrapper.innerHTML = "";

    const editor = document.createElement("div");
    wrapper.append(editor);
    Quill.register("modules/cursors", QuillCursors);
    const quillEditor = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: false,
        cursors: {
          transformOnTextChange: true,
        },
      },
    });

    quillEditor.disable();
    quillEditor.setText("Loading...");
    handleQuill(quillEditor);
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
}