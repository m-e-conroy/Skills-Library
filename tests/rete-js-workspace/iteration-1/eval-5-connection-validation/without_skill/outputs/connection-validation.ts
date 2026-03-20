import { ClassicPreset, NodeEditor } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { ReactPlugin, Presets, ReactArea2D } from "rete-react-plugin";

// ─── Sockets ────────────────────────────────────────────────────────────────

const numberSocket = new ClassicPreset.Socket("number");
const stringSocket = new ClassicPreset.Socket("string");

// ─── Schemes ─────────────────────────────────────────────────────────────────

type Schemes = ClassicPreset.Schemes;
type AreaExtra = ReactArea2D<Schemes>;

// ─── Node Definitions ────────────────────────────────────────────────────────

/**
 * NumberNode
 * Outputs a number value via the "value" port.
 */
export class NumberNode extends ClassicPreset.Node<
  {},
  { value: ClassicPreset.Output<typeof numberSocket> }
> {
  constructor() {
    super("Number");
    this.addOutput("value", new ClassicPreset.Output(numberSocket, "Value"));
  }
}

/**
 * StringNode
 * Accepts a string on "in" and forwards it on "out".
 */
export class StringNode extends ClassicPreset.Node<
  { in: ClassicPreset.Input<typeof stringSocket> },
  { out: ClassicPreset.Output<typeof stringSocket> }
> {
  constructor() {
    super("String");
    this.addInput("in", new ClassicPreset.Input(stringSocket, "In"));
    this.addOutput("out", new ClassicPreset.Output(stringSocket, "Out"));
  }
}

/**
 * MixedNode
 * Accepts both a number ("numIn") and a string ("strIn") — useful for
 * testing that only the specifically forbidden NumberNode→StringNode
 * connection is blocked, while other valid connections still work.
 */
export class MixedNode extends ClassicPreset.Node<
  {
    numIn: ClassicPreset.Input<typeof numberSocket>;
    strIn: ClassicPreset.Input<typeof stringSocket>;
  },
  {}
> {
  constructor() {
    super("Mixed");
    this.addInput(
      "numIn",
      new ClassicPreset.Input(numberSocket, "Num In")
    );
    this.addInput(
      "strIn",
      new ClassicPreset.Input(stringSocket, "Str In")
    );
  }
}

// ─── Editor Factory ───────────────────────────────────────────────────────────

/**
 * createEditor
 *
 * Builds the full Rete.js plugin stack and registers a pipe that intercepts
 * every `connectioncreate` event.  If the source port carries a "number"
 * socket and the target port expects a "string" socket, the connection is
 * silently rejected with a console.warn explaining why.
 *
 * @param container - The DOM element to mount the editor into.
 */
export async function createEditor(container: HTMLElement) {
  // ── Core editor ──────────────────────────────────────────────────────────
  const editor = new NodeEditor<Schemes>();

  // ── Area plugin (canvas, zoom, pan) ──────────────────────────────────────
  const area = new AreaPlugin<Schemes, AreaExtra>(container);

  // ── Connection plugin (drag-to-connect UI) ────────────────────────────────
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  connection.addPreset(ConnectionPresets.classic.setup());

  // ── Render plugin (React renderer) ───────────────────────────────────────
  const render = new ReactPlugin<Schemes, AreaExtra>();
  render.addPreset(Presets.classic.setup());

  // ── Wire plugins together ─────────────────────────────────────────────────
  editor.use(area);
  area.use(connection);
  area.use(render);

  // ── Auto-zoom helpers ─────────────────────────────────────────────────────
  AreaExtensions.zoomAt(area, editor.getNodes());
  AreaExtensions.simpleNodesOrder(area);

  // ─────────────────────────────────────────────────────────────────────────
  // CONNECTION VALIDATION PIPE
  //
  // editor.addPipe receives every context that passes through the editor's
  // event pipeline.  Returning `undefined` (or nothing) drops the event,
  // effectively cancelling the operation.  Returning `context` lets it
  // through unchanged.
  // ─────────────────────────────────────────────────────────────────────────
  editor.addPipe((context) => {
    // We only care about connection-creation attempts.
    if (context.type !== "connectioncreate") return context;

    const { source, sourceOutput, target, targetInput } = context.data;

    // Look up the actual node instances from the editor.
    const sourceNode = editor.getNode(source);
    const targetNode = editor.getNode(target);

    if (!sourceNode || !targetNode) return context;

    // Retrieve the socket attached to the relevant output / input port.
    const outputPort = sourceNode.outputs[sourceOutput] as
      | ClassicPreset.Output<ClassicPreset.Socket>
      | undefined;

    const inputPort = targetNode.inputs[targetInput] as
      | ClassicPreset.Input<ClassicPreset.Socket>
      | undefined;

    if (!outputPort?.socket || !inputPort?.socket) return context;

    const outSocketName = outputPort.socket.name; // e.g. "number"
    const inSocketName = inputPort.socket.name;   // e.g. "string"

    // ── Type-mismatch guard ───────────────────────────────────────────────
    // Block specifically when a NumberNode output (socket "number") would
    // feed into a StringNode input (socket "string").
    if (
      sourceNode instanceof NumberNode &&
      targetNode instanceof StringNode &&
      outSocketName === "number" &&
      inSocketName === "string"
    ) {
      console.warn(
        `[Rete] Connection rejected: ` +
          `Cannot connect a "${outSocketName}" output (port "${sourceOutput}" ` +
          `on "${sourceNode.label}" node) ` +
          `to a "${inSocketName}" input (port "${targetInput}" ` +
          `on "${targetNode.label}" node). ` +
          `Type mismatch — number → string connections are not allowed.`
      );
      // Returning undefined drops the event, preventing the connection.
      return undefined;
    }

    // All other connections are allowed through.
    return context;
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Demo graph
  // NumberNode ──(number)──► MixedNode.numIn   ✔ allowed
  // StringNode ──(string)──► MixedNode.strIn   ✔ allowed
  // NumberNode ──(number)──► StringNode.in      ✘ BLOCKED  (type mismatch)
  // ─────────────────────────────────────────────────────────────────────────

  const numNode = new NumberNode();
  const strNode = new StringNode();
  const mixNode = new MixedNode();

  await editor.addNode(numNode);
  await editor.addNode(strNode);
  await editor.addNode(mixNode);

  // ── Position nodes on the canvas ─────────────────────────────────────────
  await area.translate(numNode.id, { x: 0, y: 0 });
  await area.translate(strNode.id, { x: 0, y: 180 });
  await area.translate(mixNode.id, { x: 400, y: 80 });

  // ── Valid connections ─────────────────────────────────────────────────────
  // number → MixedNode.numIn
  await editor.addConnection(
    new ClassicPreset.Connection(numNode, "value", mixNode, "numIn")
  );

  // string → MixedNode.strIn
  await editor.addConnection(
    new ClassicPreset.Connection(strNode, "out", mixNode, "strIn")
  );

  // ── Invalid connection (will be blocked by the pipe) ─────────────────────
  // number → StringNode.in  ← should print a console.warn and be rejected
  await editor.addConnection(
    new ClassicPreset.Connection(numNode, "value", strNode, "in")
  );

  // Fit all nodes into view after layout.
  await AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    editor,
    area,
    destroy: () => area.destroy(),
  };
}
