import { NodeEditor, ClassicPreset } from "rete";
import { AreaPlugin } from "rete-area-plugin";

// ── Types ────────────────────────────────────────────────────────────────────

type Schemes = ClassicPreset.Schemes;

interface Position {
  x: number;
  y: number;
}

interface SerializedControl {
  value: number | string | boolean | null;
}

interface SerializedNode {
  id: string;
  type: "NumberNode" | "AddNode";
  label: string;
  position: Position;
  controls: Record<string, SerializedControl>;
}

interface SerializedConnection {
  id: string;
  source: string;
  sourceOutput: string;
  target: string;
  targetInput: string;
}

interface SerializedGraph {
  nodes: SerializedNode[];
  connections: SerializedConnection[];
}

// ── Node stubs ───────────────────────────────────────────────────────────────

class NumberNode extends ClassicPreset.Node {
  width = 180;
  height = 120;

  constructor(public value: number = 0) {
    super("Number");
    this.addControl(
      "value",
      new ClassicPreset.InputControl("number", { initial: value })
    );
    this.addOutput("value", new ClassicPreset.Output(new ClassicPreset.Socket("number"), "Value"));
  }
}

class AddNode extends ClassicPreset.Node {
  width = 180;
  height = 195;

  constructor() {
    super("Add");
    const socket = new ClassicPreset.Socket("number");
    this.addInput("a", new ClassicPreset.Input(socket, "A"));
    this.addInput("b", new ClassicPreset.Input(socket, "B"));
    this.addControl(
      "result",
      new ClassicPreset.InputControl("number", { initial: 0, readonly: true })
    );
    this.addOutput("value", new ClassicPreset.Output(socket, "Result"));
  }
}

// ── Export ───────────────────────────────────────────────────────────────────

async function exportGraph(
  editor: NodeEditor<Schemes>,
  area: AreaPlugin<Schemes, any>
): Promise<SerializedGraph> {
  const serializedNodes: SerializedNode[] = [];

  for (const node of editor.getNodes()) {
    // Resolve position from the area plugin's view map
    const view = area.nodeViews.get(node.id);
    const position: Position = view
      ? { x: view.position.x, y: view.position.y }
      : { x: 0, y: 0 };

    // Collect every InputControl value on this node
    const controls: Record<string, SerializedControl> = {};
    for (const [key, control] of Object.entries(node.controls)) {
      if (control instanceof ClassicPreset.InputControl) {
        controls[key] = { value: control.value ?? null };
      }
    }

    // Derive type from constructor name (keep in sync with factory below)
    const type = node.constructor.name as SerializedNode["type"];

    serializedNodes.push({
      id: node.id,
      type,
      label: node.label,
      position,
      controls,
    });
  }

  const serializedConnections: SerializedConnection[] = editor
    .getConnections()
    .map((c) => ({
      id: c.id,
      source: c.source,
      sourceOutput: c.sourceOutput,
      target: c.target,
      targetInput: c.targetInput,
    }));

  return { nodes: serializedNodes, connections: serializedConnections };
}

// ── Import ───────────────────────────────────────────────────────────────────

/** Factory: maps a serialized node back to a concrete class instance. */
function createNodeFromType(serialized: SerializedNode): ClassicPreset.Node {
  switch (serialized.type) {
    case "NumberNode": {
      const initialValue =
        (serialized.controls["value"]?.value as number | undefined) ?? 0;
      return new NumberNode(initialValue);
    }
    case "AddNode": {
      return new AddNode();
    }
    default: {
      // Exhaustive check — TypeScript will warn if a new type is added
      const _exhaustive: never = serialized.type;
      throw new Error(`Unknown node type: ${(_exhaustive as any)}`);
    }
  }
}

async function importGraph(
  editor: NodeEditor<Schemes>,
  area: AreaPlugin<Schemes, any>,
  graph: SerializedGraph
): Promise<void> {
  // Clear existing graph first
  await editor.clear();

  // A map from the old serialized id → newly created node id
  const idMap = new Map<string, string>();

  // 1. Re-create nodes
  for (const serialized of graph.nodes) {
    const node = createNodeFromType(serialized);

    // Restore InputControl values not set via constructor (e.g. readonly result)
    for (const [key, savedControl] of Object.entries(serialized.controls)) {
      const control = node.controls[key];
      if (
        control instanceof ClassicPreset.InputControl &&
        !control.readonly &&
        savedControl.value !== null
      ) {
        control.setValue(savedControl.value as any);
      }
    }

    await editor.addNode(node);
    idMap.set(serialized.id, node.id);

    // 2. Restore position via the area plugin
    await area.translate(node.id, serialized.position);
  }

  // 3. Re-create connections using remapped ids
  for (const conn of graph.connections) {
    const newSourceId = idMap.get(conn.source);
    const newTargetId = idMap.get(conn.target);

    if (!newSourceId || !newTargetId) {
      console.warn(`Skipping connection ${conn.id}: node not found in idMap`);
      continue;
    }

    const sourceNode = editor.getNode(newSourceId);
    const targetNode = editor.getNode(newTargetId);

    if (!sourceNode || !targetNode) {
      console.warn(`Skipping connection ${conn.id}: node missing from editor`);
      continue;
    }

    await editor.addConnection(
      new ClassicPreset.Connection(
        sourceNode,
        conn.sourceOutput as any,
        targetNode,
        conn.targetInput as any
      )
    );
  }
}

// ── DB helpers (stubs) ───────────────────────────────────────────────────────

async function saveToDatabase(graph: SerializedGraph): Promise<void> {
  // Replace with a real DB/API call (e.g. fetch('/api/graphs', { method: 'POST', body }))
  const serialized = JSON.stringify(graph, null, 2);
  console.log("[saveToDatabase] Saved graph JSON:\n", serialized);
}

async function loadFromDatabase(): Promise<SerializedGraph> {
  // Replace with a real DB/API call (e.g. const res = await fetch('/api/graphs/1'))
  const raw = localStorage?.getItem("rete-graph") ?? "null";
  const parsed: SerializedGraph | null = JSON.parse(raw);
  if (!parsed) throw new Error("No graph found in database");
  return parsed;
}

// ── Round-trip demo ──────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // --- Setup editor & area (minimal, no DOM renderer needed for this demo) ---
  const editor = new NodeEditor<Schemes>();
  // AreaPlugin normally requires a DOM container; we pass a mock here so the
  // demo can run in a Node.js environment without a browser.
  const mockContainer = { addEventListener: () => {} } as unknown as HTMLElement;
  const area = new AreaPlugin<Schemes, any>(mockContainer);
  editor.use(area);

  // --- Build a small graph: NumberNode(5) + NumberNode(3) → AddNode ---
  const numA = new NumberNode(5);
  const numB = new NumberNode(3);
  const add = new AddNode();

  await editor.addNode(numA);
  await editor.addNode(numB);
  await editor.addNode(add);

  // Position nodes so the layout is meaningful after round-trip
  await area.translate(numA.id, { x: 100, y: 100 });
  await area.translate(numB.id, { x: 100, y: 300 });
  await area.translate(add.id, { x: 400, y: 200 });

  // Connect outputs → inputs
  await editor.addConnection(
    new ClassicPreset.Connection(numA, "value", add, "a")
  );
  await editor.addConnection(
    new ClassicPreset.Connection(numB, "value", add, "b")
  );

  // --- Export ---
  const exported = await exportGraph(editor, area);
  console.log("\n[exportGraph] Exported graph:");
  console.log(JSON.stringify(exported, null, 2));

  // Simulate persisting to / loading from a database
  await saveToDatabase(exported);
  const serializedString = JSON.stringify(exported);

  // --- Import into a fresh editor ---
  const editor2 = new NodeEditor<Schemes>();
  const area2 = new AreaPlugin<Schemes, any>(mockContainer);
  editor2.use(area2);

  const graphToLoad: SerializedGraph = JSON.parse(serializedString);
  await importGraph(editor2, area2, graphToLoad);

  // --- Verify round-trip ---
  const nodes2 = editor2.getNodes();
  const connections2 = editor2.getConnections();

  console.log("\n[importGraph] Restored nodes:");
  for (const n of nodes2) {
    const view = area2.nodeViews.get(n.id);
    const pos = view ? view.position : { x: 0, y: 0 };
    const ctrl = n.controls["value"];
    const val =
      ctrl instanceof ClassicPreset.InputControl ? ctrl.value : "(n/a)";
    console.log(`  ${n.label} — pos(${pos.x}, ${pos.y}) — value: ${val}`);
  }

  console.log(`\n[importGraph] Restored ${connections2.length} connection(s).`);
  console.log("\nRound-trip complete ✓");
}

main().catch(console.error);
