import React, { useState } from "react";
import { useRete } from "rete-react-plugin";
import { createEditor } from "./editor";

// ---------------------------------------------------------------------------
// App
// Mounts the Rete.js editor via the useRete hook and exposes a "Compute"
// button that evaluates the current graph and displays the Add node's result.
// ---------------------------------------------------------------------------
export default function App() {
  // useRete handles create / cleanup automatically.
  // `ref`    – attach to the container <div> so Rete knows where to render.
  // `editor` – resolved return value of createEditor ({ destroy, compute }).
  //            Undefined until the async factory resolves.
  const [ref, editor] = useRete(createEditor);

  const [result, setResult] = useState<number | null>(null);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCompute() {
    if (!editor) return;
    setComputing(true);
    setError(null);
    try {
      const output = await editor.compute();
      setResult(output.value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Computation failed");
    } finally {
      setComputing(false);
    }
  }

  return (
    <div style={styles.root}>
      {/* ---- Toolbar ------------------------------------------------------- */}
      <div style={styles.toolbar}>
        <h2 style={styles.title}>Rete.js — Number + Add demo</h2>

        <button
          onClick={handleCompute}
          disabled={!editor || computing}
          style={styles.button}
        >
          {computing ? "Computing…" : "Compute"}
        </button>

        {result !== null && !error && (
          <span style={styles.result}>
            Result: <strong>{result}</strong>
          </span>
        )}

        {error && <span style={styles.errorText}>Error: {error}</span>}
      </div>

      {/* ---- Editor canvas -------------------------------------------------- */}
      {/* ref must be a plain HTMLDivElement ref — useRete manages it internally */}
      <div ref={ref} style={styles.canvas} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline styles (no dependencies beyond React)
// ---------------------------------------------------------------------------
const styles = {
  root: {
    display: "flex",
    flexDirection: "column" as const,
    height: "100vh",
    fontFamily: "system-ui, sans-serif",
    background: "#13131a",
    color: "#cdd6f4",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "10px 20px",
    background: "#1e1e2e",
    borderBottom: "1px solid #313244",
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 600,
    color: "#89b4fa",
  },
  button: {
    padding: "6px 20px",
    borderRadius: "6px",
    border: "none",
    background: "#89b4fa",
    color: "#1e1e2e",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
  },
  result: {
    fontSize: "14px",
    color: "#a6e3a1",
  },
  errorText: {
    fontSize: "14px",
    color: "#f38ba8",
  },
  canvas: {
    flex: 1,
    // Rete's AreaPlugin sizes itself to fill the container, so we just need
    // a block element with explicit dimensions.
    minHeight: 0,
  },
} satisfies Record<string, React.CSSProperties>;
