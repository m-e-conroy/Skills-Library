import { ClassicPreset, NodeEditor, GetSchemes } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import {
  ReactPlugin,
  Presets as ReactPresets,
  ReactArea2D,
} from "rete-react-plugin";
import { DataflowEngine } from "rete-engine";

// ------------------------------------------------------------------
// Shared socket – all ports in this graph carry "number" data
// ------------------------------------------------------------------
const socket = new ClassicPreset.Socket("number");

// ------------------------------------------------------------------
// NumberNode
//   • one InputControl (editable number field)
//   • one output port "value"
// ------------------------------------------------------------------
export class NumberNode extends ClassicPreset.Node {
  width = 180;
  height = 120;

  constructor(initialValue = 0) {
    super("Number");
    this.addControl(
      "value",
      new ClassicPreset.InputControl("number", { initial: initialValue })
    );
    this.addOutput("value", new ClassicPreset.Output(socket, "Number"));
  }

  /** Called by DataflowEngine – returns this node's computed output. */
  data(): { value: number } {
    const ctrl = this.controls["value"] as ClassicPreset.InputControl<"number">;
    return { value: ctrl.value ?? 0 };
  }
}

// ------------------------------------------------------------------
// AddNode
//   • two input ports "a" and "b"
//   • one output port "value" = a + b
// ------------------------------------------------------------------
export class AddNode extends ClassicPreset.Node {
  width = 180;
  height = 150;

  constructor() {
    super("Add");
    this.addInput("a", new ClassicPreset.Input(socket, "A"));
    this.addInput("b", new ClassicPreset.Input(socket, "B"));
    this.addOutput("value", new ClassicPreset.Output(socket, "Sum"));
  }

  /**
   * Called by DataflowEngine after dependencies have been resolved.
   * `inputs` is a map of input-key → array of upstream values.
   */
  data(inputs: { a?: number[]; b?: number[] }): { value: number } {
    const a = inputs.a?.[0] ?? 0;
    const b = inputs.b?.[0] ?? 0;
    return { value: a + b };
  }
}

// ------------------------------------------------------------------
// Rete v2 type helpers
// ------------------------------------------------------------------
type Schemes = GetSchemes<
  NumberNode | AddNode,
  ClassicPreset.Connection<NumberNode | AddNode, NumberNode | AddNode>
>;

type AreaExtra = ReactArea2D<Schemes>;

// ------------------------------------------------------------------
// Public interface returned by createEditor
// ------------------------------------------------------------------
export interface EditorInstance {
  /** Remove the editor DOM and tear down all plugins. */
  destroy: () => void;
  /**
   * Resets the engine cache, then walks the graph from the Add node
   * and returns its computed output.
   */
  compute: () => Promise<{ value: number }>;
}

// ------------------------------------------------------------------
// createEditor – mounts a Rete editor into `container`
// ------------------------------------------------------------------
export async function createEditor(
  container: HTMLElement
): Promise<EditorInstance> {
  // Core editor
  const editor = new NodeEditor<Schemes>();

  // Plugins
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>();
  const engine = new DataflowEngine<Schemes>();

  // Configure presets
  render.addPreset(ReactPresets.classic.setup());
  connection.addPreset(ConnectionPresets.classic.setup());

  // Wire plugin pipeline:
  //   editor → area → connection (drag-connect behaviour)
  //                 → render     (React-based rendering)
  //   editor → engine            (dataflow processing)
  editor.use(area);
  area.use(connection);
  area.use(render);
  editor.use(engine);

  // Optional: allow nodes to be selected (single or Ctrl+multi)
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  // ------------------------------------------------------------------
  // Initial graph: NumA(1) ─┐
  //                          ├─ Add ──► output
  //               NumB(2) ─┘
  // ------------------------------------------------------------------
  const numA = new NumberNode(1);
  const numB = new NumberNode(2);
  const add = new AddNode();

  await editor.addNode(numA);
  await editor.addNode(numB);
  await editor.addNode(add);

  // Connect number nodes to the add node's inputs
  await editor.addConnection(
    new ClassicPreset.Connection(numA, "value", add, "a")
  );
  await editor.addConnection(
    new ClassicPreset.Connection(numB, "value", add, "b")
  );

  // Position nodes so they don't overlap
  await area.translate(numA.id, { x: 0, y: 0 });
  await area.translate(numB.id, { x: 0, y: 180 });
  await area.translate(add.id, { x: 320, y: 80 });

  // Fit viewport to all nodes
  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    destroy: () => area.destroy(),

    compute: async () => {
      // Clear stale cached results so every call re-evaluates
      engine.reset();
      const output = await engine.fetch(add.id);
      return output as { value: number };
    },
  };
}
