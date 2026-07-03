"use client";

import * as Y from "yjs";
import Editor, { OnMount } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useSocket } from "@/socket/socket-provider";
import { SocketEvent } from "@repo/shared-types";
import { Awareness } from "y-protocols/awareness";
import { useUser } from "@clerk/nextjs";

export interface EditorController {
  getCode: () => string;
  replaceCode: (nextCode: string) => void;
}

const toUint8Array = (value: unknown) => {
  if (value instanceof Uint8Array) {
    return value;
  }

  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }

  if (Array.isArray(value)) {
    return Uint8Array.from(value);
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "data" in value &&
    (value as { type?: string }).type === "Buffer" &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return Uint8Array.from((value as { data: number[] }).data);
  }

  return null;
};

const MonacoEditor = ({
  initialCode,
  onReady,
}: {
  initialCode: Uint8Array;
  onReady?: (controller: EditorController) => void;
}) => {
  //socket
  const socket = useSocket();
  const { user, isSignedIn } = useUser();

  const [doc] = useState(() => new Y.Doc());
  const yText = doc.getText("editor");

  const [awareness] = useState(() => new Awareness(doc));

  useEffect(() => {
    if (!user || !isSignedIn) return;

    awareness.setLocalStateField("user", {
      id: user.id,
      name: user.fullName,
      color: "#3b82f6",
    });
  }, [awareness, user, isSignedIn]);

  useEffect(() => {
    if (!initialCode) return;

    const update = toUint8Array(initialCode);

    if (!update) {
      return;
    }

    Y.applyUpdate(doc, update, "initial-sync");
  }, [doc, initialCode]);

  const handleAwarenessChange = () => {
  };

  useEffect(() => {
    if (!onReady) {
      return;
    }

    onReady({
      getCode: () => yText.toString(),
      replaceCode: (nextCode: string) => {
        doc.transact(() => {
          yText.delete(0, yText.length);
          yText.insert(0, nextCode);
        }, "restore-version");
      },
    });
  }, [doc, onReady, yText]);

  useEffect(() => {
    if (!socket) return;

    const handleRemoteUpdate = (code: unknown) => {
      const update = toUint8Array(code);

      if (!update) {
        return;
      }

      Y.applyUpdate(doc, update, "remote-sync");
    };

    const handleUpdate = (code: Uint8Array, origin: unknown) => {
      if (
        origin === "initial-sync" ||
        origin === "remote-sync"
      ) {
        return;
      }

      socket.emit(SocketEvent.CODE_CHANGE, code);
    };

    doc.on("update", handleUpdate);

    socket.on(SocketEvent.REMOTE_CODE_CHANGE, handleRemoteUpdate);

    awareness.on("change", handleAwarenessChange);

    return () => {
      doc.off("update", handleUpdate);
      socket.off(SocketEvent.REMOTE_CODE_CHANGE, handleRemoteUpdate);
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

  return (
    <Editor
      onMount={handleEditorMount}
      height="100%"
      theme="vs-dark"
      options={{
        minimap: { enabled: true },
        fontSize: 14,
        fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: {
          top: 16,
        },
      }}
    />
  );
};

export default MonacoEditor;
