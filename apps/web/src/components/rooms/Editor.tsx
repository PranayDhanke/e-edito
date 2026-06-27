"use client";

import * as Y from "yjs";
import Editor, { OnMount } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { editor } from "monaco-editor";
import { useSocket } from "@/socket/socket-provider";
import { SocketEvent } from "@repo/shared-types";
import { Awareness } from "y-protocols/awareness";
import { useUser } from "@clerk/nextjs";

const MonacoEditor = () => {
  //socket
  const socket = useSocket();
  const { user, isSignedIn } = useUser();

  //creating yjs docs
  const doc = useRef(new Y.Doc()).current;
  const yText = doc.getText("editor");

  //awareness instance
  const awareness = useRef(new Awareness(doc)).current;

  useEffect(() => {
    if (!user || !isSignedIn) return;

    awareness.setLocalStateField("user", {
      id: user.id,
      name: user.fullName,
      color: "#3b82f6",
    });
  }, [user, isSignedIn]);

  const handleRemoteUpdate = (code: any) => {
    const update = new Uint8Array(code);

    Y.applyUpdate(doc, update);
  };

  const handleInitialCode = (update: Uint8Array) => {
    Y.applyUpdate(doc, new Uint8Array(update));
  };

  const handleAwarenessChange = () => {
    
  };

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (code: Uint8Array) => {
      socket.emit(SocketEvent.CODE_CHANGE, code);
    };

    doc.on("update", handleUpdate);

    socket.on(SocketEvent.INITIAL_CODE, handleInitialCode);
    socket.on(SocketEvent.REMOTE_CODE_CHANGE, handleRemoteUpdate);

    awareness.on("change", handleAwarenessChange);

    return () => {
      doc.off("update", handleUpdate);
      socket.off(SocketEvent.REMOTE_CODE_CHANGE, handleRemoteUpdate);
      socket.off(SocketEvent.INITIAL_CODE, handleInitialCode);
      awareness.off("change", handleAwarenessChange);
    };
  }, [socket, doc, awareness]);

  //creating a function to handle the editor mount
  const handleEditorMount: OnMount = async (editor) => {
    const model = editor.getModel();

    if (!model) return;

    const { MonacoBinding } = await import("y-monaco");

    new MonacoBinding(yText, model, new Set([editor]), awareness);
  };

  return <Editor onMount={handleEditorMount} height={"60vh"} />;
};

export default MonacoEditor;
