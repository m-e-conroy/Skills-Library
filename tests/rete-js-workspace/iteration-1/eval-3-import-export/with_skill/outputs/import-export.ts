/**
 * Rete.js v2 — Import / Export Demo
 *
 * Demonstrates serializing a node graph (nodes, positions, control values,
 * connections) to plain JSON and restoring it back to a live editor.
 *
 * Dependencies (illustrative — no actual browser/DOM needed here):
 *   npm i rete rete-area-plugin
 */

import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin } from "rete-area-plugin";

// ---------------------------------------------------------------------------
// 1. Shared socket & type aliases
// ---------------------------------------------------------------------------

const socket = new ClassicPreset.Socket("number");

type AppNode = NumberNode | AddNode;
type AppConnection = ClassicPreset.Connection<AppNode, AppNode>;
type Schemes = GetSchemes<AppNode, AppConnection>;
// AreaExtra intentionally left as `any` — swap for ReactArea2D<Schemes> etc.
type AreaExtra = any;

// ---------------------------------------------------------------------------
// 2. Custom node stubs
// ---------------------------------------------------------------------------

/**
 * NumberNode — holds a single numeric value exposed via an InputControl.
 * Output port: "value"
 */
class NumberNode extends ClassicPreset.Node<
  Record<string, never>,
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"number"> }
> {
  constructor(initialValue: number = 0) {
    super("Number");
    this.addControl(
      "value",
      new ClassicPreset.InputControl("number", { initial: initialValue })
    );
    this.addOutput("value", new ClassicPreset.Output(socket, "Value"));
  }
}

/**
 * AddNode — sums two inputs and exposes the result.
 * Input ports: "left", "right"  |  Output port: "value"
 */
class AddNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { result: ClassicPreset.InputControl<"number"> }
> {
  constructor() {
    super("Add");
    this.addInput("left", new ClassicPreset.Input(socket, "Left"));
    this.addInput("right", new ClassicPreset.Input(socket, "Right"));
    this.addOutput("value", new ClassicPreset.Output(socket, "Value"));
    // Read-only display control for the computed result
    this.addControl(
      "result",
      new ClassicPreset.InputControl("number", { initial: 0, readonly: true })
    );
  }
}

// ---------------------------------------------------------------------------
// 3. Serializable data shapes
// ---------------------------------------------------------------------------

interface SavedControl {
  value: number | string | null;
}

interface SavedNode {
  id: string;
  type: string; // constructor name — drives the factory switch
  label: string;
  position: { x: number; y: number };
  controls: Record<string, SavedControl>;
}

interface SavedConnection {
  id: string;
  source: string;
  sourceOutput: string;
  target: string;
  targetInput: string;
}

interface SavedGraph {
  nodes: SavedNode[];
  connections: SavedConnection[];
}

// ---------------------------------------------------------------------------
// 4. Export
// ---------------------------------------------------------------------------

/**
 * Walks the live editor and area to produce a plain, JSON-serializable object.
 * Call this any time you want a snapshot — before the user navigates away,
 * on an auto-save timer, etc.
 */
async function exportGraph(
  editor: NodeEditor<Schemes>,
  area: AreaPlugin<Schemes, AreaExtra>
): Promise<SavedGraph> {
  const nodes: SavedNode[] = editor.getNodes().map((node) => {
    // Capture each control's current value (InputControl only — skip custom controls)
    const controls: Record<string, SavedControl> = {};
    for (const [key, ctrl] of Object.entries(node.controls)) {
      controls[key] = {
        value:
          ctrl instanceof ClassicPreset.InputControl
            ? (ctrl.value as number | string | null) ?? null
            : null,
      };
    }

    return {
      id: node.id,
      type: node.constructor.name, // "NumberNode" | "AddNode"
      label: node.label,
      position: area.nodeViews.get(node.id)?.position ?? { x: 0, y: 0 },
      controls,
    };
  });

  const connections: SavedConnection[] = editor.getConnections().map((c) => ({
    id: c.id,
    source: c.source,
    sourceOutput: c.sourceOutput,
    target: c.target,
    targetInput: c.targetInput,
  }));

  return { nodes, connections };
}

// ---------------------------------------------------------------------------
// 5. Node factory
// ---------------------------------------------------------------------------

/**
 * Re-creates a node instance from its saved type string.
 * Extend this switch when you add new node classes.
 */
function createNodeByType(type: string): AppNode {
  switch (type) {
    case "NumberNode":
      return new NumberNode();
    case "AddNode":
      return new AddNode();
    default:
      throw new Error(`Unknown node type: "${type}". Add it to createNodeByType().`);
  }
}

// ---------------------------------------------------------------------------
// 6. Import
// ---------------------------------------------------------------------------

/**
 * Clears the editor and rebuilds it from a SavedGraph snapshot.
 *
 * Import order: nodes first (all of them), connections second.
 * If your graph has parent-child relationships, sort `data.nodes` so that
 * parents appear before children before calling this function.
 */
async function importGraph(
  data: SavedGraph,
  editor: NodeEditor<Schemes>,
  area: AreaPlugin<Schemes, AreaExtra>
): Promise<void> {
  // Wipe existing content before restoring
  await editor.clear();

  // --- Nodes ---
  for (const saved of data.nodes) {
    const node = createNodeByType(saved.type);

    // Preserve the original ID so connections reference the right nodes
    node.id = saved.id;

    // Restore control values
    for (const [key, savedCtrl] of Object.entries(saved.controls)) {
      const ctrl = node.controls[key];
      if (
        ctrl instanceof ClassicPreset.InputControl &&
        savedCtrl.value !== null &&
        !ctrl.readonly
      ) {
        ctrl.setValue(savedCtrl.value as never);
      }
    }

    await editor.addNode(node);
    await area.translate(node.id, saved.position);
  }

  // --- Connections ---
  for (const c of data.connections) {
    await editor.addConnection({
      id: c.id,
      source: c.source,
      sourceOutput: c.sourceOutput,
      target: c.target,
      targetInput: c.targetInput,
    } as AppConnection);
  }
}

// ---------------------------------------------------------------------------
// 7. Database helpers (stubs — replace with real DB calls)
// ---------------------------------------------------------------------------

/**
 * Persist a graph snapshot as a JSON string.
 * In production: replace the body with an HTTP POST / IndexedDB put / etc.
 */
async function saveToDatabase(graph: SavedGraph): Promise<void> {
  const json = JSON.stringify(graph, null, 2);
  // --- stub: swap this line for a real persistence call ---
  console.log("[saveToDatabase] Saving graph (%d nodes, %d connections):",
    graph.nodes.length, graph.connections.length);
  console.log(json);
}

/**
 * Retrieve the most-recently saved graph snapshot.
 * In production: replace the body with an HTTP GET / IndexedDB get / etc.
 */
async function loadFromDatabase(): Promise<SavedGraph> {
  // --- stub: swap this with a real fetch / DB read ---
  const stored = globalThis.__GRAPH_STORE__ as string | undefined;
  if (!stored) {
    throw new Error("No saved graph found in the stub store.");
  }
  return JSON.parse(stored) as SavedGraph;
}

// Tiny in-memory store used by the stubs above
declare global {
  // eslint-disable-next-line no-var
  var __GRAPH_STORE__: string | undefined;
}

/** Wires the stubs to an in-memory string so the round-trip demo works. */
function enableInMemoryStore() {
  const _save = saveToDatabase;
  // Override saveToDatabase to also write to globalThis
  (globalThis as any).saveToDatabase = async (graph: SavedGraph) => {
    globalThis.__GRAPH_STORE__ = JSON.stringify(graph, null, 2);
    await _save(graph);
  };
}

// ---------------------------------------------------------------------------
// 8. Round-trip demo — main()
// ---------------------------------------------------------------------------

/**
 * Creates a small graph (NumberNode → AddNode ← NumberNode),
 * exports it, persists it, then rebuilds it from the saved data.
 *
 * NOTE: AreaPlugin requires a real HTMLElement in a browser context.
 * For a Node.js unit-test environment you would mock `container`.
 */
async function main() {
  enableInMemoryStore();

  // ── Setup ────────────────────────────────────────────────────────────────
  const container = document.createElement("div"); // browser only
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  editor.use(area);

  // ── Build initial graph ───────────────────────────────────────────────────
  const numA = new NumberNode(10);
  const numB = new NumberNode(32);
  const add  = new AddNode();

  await editor.addNode(numA);
  await editor.addNode(numB);
  await editor.addNode(add);

  // Position nodes on canvas
  await area.translate(numA.id, { x: 0,   y: 0   });
  await area.translate(numB.id, { x: 0,   y: 150 });
  await area.translate(add.id,  { x: 300, y: 75  });

  // Wire: numA.value → add.left,  numB.value → add.right
  await editor.addConnection(
    new ClassicPreset.Connection(numA, "value", add, "left")
  );
  await editor.addConnection(
    new ClassicPreset.Connection(numB, "value", add, "right")
  );

  console.log("=== BEFORE EXPORT ===");
  console.log("Nodes:", editor.getNodes().map((n) => `${n.label}(${n.id})`));
  console.log("Connections:", editor.getConnections().length);

  // ── Export ────────────────────────────────────────────────────────────────
  const snapshot = await exportGraph(editor, area);
  console.log("\n=== EXPORTED SNAPSHOT ===");
  console.log(JSON.stringify(snapshot, null, 2));

  // ── Persist ───────────────────────────────────────────────────────────────
  // Write to in-memory stub store
  globalThis.__GRAPH_STORE__ = JSON.stringify(snapshot, null, 2);
  await (globalThis as any).saveToDatabase?.(snapshot) ?? saveToDatabase(snapshot);

  // ── Clear editor to simulate a fresh load ────────────────────────────────
  await editor.clear();
  console.log("\n=== EDITOR CLEARED ===");
  console.log("Nodes after clear:", editor.getNodes().length); // → 0

  // ── Load & Import ─────────────────────────────────────────────────────────
  const loaded = await loadFromDatabase();
  await importGraph(loaded, editor, area);

  console.log("\n=== AFTER IMPORT ===");
  const restoredNodes = editor.getNodes();
  console.log("Nodes:", restoredNodes.map((n) => `${n.label}(${n.id})`));
  console.log("Connections:", editor.getConnections().length);

  // Verify control values survived the round-trip
  for (const node of restoredNodes) {
    for (const [key, ctrl] of Object.entries(node.controls)) {
      if (ctrl instanceof ClassicPreset.InputControl) {
        console.log(`  ${node.label}.${key} = ${ctrl.value}`);
      }
    }
  }

  area.destroy();
}

main().catch(console.error);
