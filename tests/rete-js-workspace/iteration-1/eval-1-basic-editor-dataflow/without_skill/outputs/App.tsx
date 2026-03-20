import React, { useEffect, useRef, useState } from "react";
import { createEditor, EditorInstance } from "./editor";

export default function App() {
  // DOM node that Rete will render into
  const containerRef = useRef<HTMLDivElement>(null);

  // Stable ref to the editor instance – avoids triggering re-renders
  const editorRef = useRef<EditorInstance | null>(null);

  const [result, setResult] = useState<number | null>(null);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mount the editor once on first render, tear it down on unmount
  useEffect(() => {
    if (!containerRef.current) return;

    let instance: EditorInstance | null = null;

    createEditor(containerRef.current)
      .then((ed) => {
        instance = ed;
        editorRef.current = ed;
      })
      .catch((err) => {
        setError(String(err));
      });

    return () => {
      instance?.destroy();
      editorRef.current = null;
    };
  }, []);

  const handleCompute = async () => {
    if (!editorRef.current) return;

    setComputing(true);
    setError(null);

    try {
      const output = await editorRef.current.compute();
      setResult(output.value);
    } catch (err) {
      setError(String(err));
    } finally {
      setComputing(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Toolbar */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid #ddd",
          background: "#f8f8f8",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={handleCompute}
          disabled={computing}
          style={{
            padding: "6px 18px",
            fontSize: "14px",
            cursor: computing ? "not-allowed" : "pointer",
          }}
        >
          {computing ? "Computing…" : "Compute"}
        </button>

        {result !== null && !error && (
          <span style={{ fontSize: "14px" }}>
            Result: <strong>{result}</strong>
          </span>
        )}

        {error && (
          <span style={{ fontSize: "14px", color: "red" }}>
            Error: {error}
          </span>
        )}
      </div>

      {/* Rete editor canvas – fills remaining space */}
      <div ref={containerRef} style={{ flex: 1, overflow: "hidden" }} />
    </div>
  );
}
