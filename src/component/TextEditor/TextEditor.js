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

  useEffect(() => {
    if (!cursor) {
      return;
    }

    socket.on("show_my_cursor", (socket) => {
      cursor.createCursor(socket.id, socket.nickname, randomColor());
    });

    socket.on("show_other_cursors", (sockets) => {
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

    const updateContents = (delta) => {
      quill.updateContents(delta);
    };

    const sendChanges = (delta, oldDelta, source) => {
      if (source !== "user") {
        return;
      }

      socket.emit("send_changes", delta);
    };

    socket.emit("get_document", documentId, username);

    socket.once("load_document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

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
  }, [quill, documentId, username]);


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
