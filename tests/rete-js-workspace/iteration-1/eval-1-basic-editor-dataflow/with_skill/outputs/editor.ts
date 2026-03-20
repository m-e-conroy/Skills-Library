import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { ReactPlugin, Presets, ReactArea2D } from "rete-react-plugin";
import { DataflowEngine } from "rete-engine";
import { createRoot } from "react-dom/client";

// ---------------------------------------------------------------------------
// Shared socket — all ports use the same type so any output can connect to
// any input. Swap for multiple socket types if you need type-safe wiring.
// ---------------------------------------------------------------------------
const socket = new ClassicPreset.Socket("number");

// ---------------------------------------------------------------------------
// NumberNode
// One numeric InputControl + one output port.
// data() reads the control's current value and emits it as output "value".
// ---------------------------------------------------------------------------
class NumberNode extends ClassicPreset.Node {
  constructor(initialValue: number = 0) {
    super("Number");
    this.addControl(
      "value",
      new ClassicPreset.InputControl("number", { initial: initialValue })
    );
    this.addOutput("value", new ClassicPreset.Output(socket, "Value"));
  }

  data(): { value: number } {
    const ctrl = this.controls[
      "value"
    ] as ClassicPreset.InputControl<"number">;
    return { value: ctrl.value ?? 0 };
  }
}

// ---------------------------------------------------------------------------
// AddNode
// Two number inputs (left, right) + one output (value = left + right).
// DataflowEngine calls data() and passes already-resolved upstream values as
// nested arrays: inputs.left[connectionIndex][valueIndex].
// ---------------------------------------------------------------------------
class AddNode extends ClassicPreset.Node {
  constructor() {
    super("Add");
    this.addInput("left", new ClassicPreset.Input(socket, "Left"));
    this.addInput("right", new ClassicPreset.Input(socket, "Right"));
    this.addOutput("value", new ClassicPreset.Output(socket, "Value"));
  }

  data(inputs: { left?: number[][]; right?: number[][] }): { value: number } {
    // inputs.port is an array of connections; each connection yields an array
    // of values. We want the first value from the first connection.
    const left = inputs.left?.[0]?.[0] ?? 0;
    const right = inputs.right?.[0]?.[0] ?? 0;
    return { value: left + right };
  }
}

// ---------------------------------------------------------------------------
// TypeScript schema — tells Rete about the union of all node types and the
// connections that may exist between them.
// ---------------------------------------------------------------------------
type MyNode = NumberNode | AddNode;
type Schemes = GetSchemes<
  MyNode,
  ClassicPreset.Connection<MyNode, MyNode>
>;
type AreaExtra = ReactArea2D<Schemes>;

// ---------------------------------------------------------------------------
// Editor factory
// Returns { destroy, compute } so callers can clean up and trigger evaluation.
// ---------------------------------------------------------------------------
export async function createEditor(container: HTMLElement) {
  // ---- Core layers --------------------------------------------------------
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  const engine = new DataflowEngine<Schemes>();

  // ---- Configure presets before wiring ------------------------------------
  connection.addPreset(ConnectionPresets.classic.setup());
  render.addPreset(Presets.classic.setup());

  // ---- Wire layers (ORDER MATTERS) ----------------------------------------
  // editor → area → connection / render
  // engine is attached to editor (not area) so it sees all graph mutations.
  editor.use(area);
  area.use(connection);
  area.use(render);
  editor.use(engine);

  // ---- Useful area extensions ---------------------------------------------
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });
  AreaExtensions.simpleNodesOrder(area); // hoist selected node above others

  // ---- Create initial nodes -----------------------------------------------
  const numA = new NumberNode(2);
  const numB = new NumberNode(3);
  const add = new AddNode();

  // addNode / addConnection are async — always await
  await editor.addNode(numA);
  await editor.addNode(numB);
  await editor.addNode(add);

  // ---- Wire nodes -----------------------------------------------------------
  await editor.addConnection(
    new ClassicPreset.Connection(numA, "value", add, "left")
  );
  await editor.addConnection(
    new ClassicPreset.Connection(numB, "value", add, "right")
  );

  // ---- Position nodes on the canvas ----------------------------------------
  await area.translate(numA.id, { x: 40, y: 40 });
  await area.translate(numB.id, { x: 40, y: 220 });
  await area.translate(add.id, { x: 380, y: 120 });

  // Fit viewport to show all nodes
  AreaExtensions.zoomAt(area, editor.getNodes());

  // ---- Compute helper -------------------------------------------------------
  // engine.reset() clears the result cache so we always get a fresh evaluation
  // even when node control values change between calls.
  async function compute(): Promise<{ value: number }> {
    engine.reset();
    return (await engine.fetch(add.id)) as { value: number };
  }

  return {
    destroy: () => area.destroy(),
    compute,
  };
}
