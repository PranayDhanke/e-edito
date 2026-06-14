"use client";
import Editor from "@monaco-editor/react";

const MonacoEditor = ({
  code,
  language,
  height = "60vh",
}: {
  code: string;
  language: string;
  height?: string;
}) => {
  return (
    <Editor
      height={height}
      width="100%"
      language={language}
      defaultValue="// Start coding..."
      value={code}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        scrollBeyondLastLine: false,
        padding: {
          top: 18,
        },
        roundedSelection: true,
        automaticLayout: true,
      }}
    />
  );
};

export default MonacoEditor;
