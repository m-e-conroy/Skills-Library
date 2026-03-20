import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin";
import { ReactPlugin, Presets, ReactArea2D } from "rete-react-plugin";
import { createRoot } from "react-dom/client";

// ---------------------------------------------------------------------------
// Sockets — one per "type" so the editor knows which ports carry which data
// ---------------------------------------------------------------------------
const numberSocket = new ClassicPreset.Socket("number");
const stringSocket = new ClassicPreset.Socket("string");

// ---------------------------------------------------------------------------
// 1. NumberNode — produces a number on its "value" output
// ---------------------------------------------------------------------------
class NumberNode extends ClassicPreset.Node {
  constructor() {
    super("Number");
    this.addOutput("value", new ClassicPreset.Output(numberSocket, "Value"));
    this.addControl(
      "value",
      new ClassicPreset.InputControl("number", { initial: 0 })
    );
  }
}

// ---------------------------------------------------------------------------
// 2. StringNode — consumes a string on "in", produces a string on "out"
// ---------------------------------------------------------------------------
class StringNode extends ClassicPreset.Node {
  constructor() {
    super("String");
    this.addInput("in", new ClassicPreset.Input(stringSocket, "In"));
    this.addOutput("out", new ClassicPreset.Output(stringSocket, "Out"));
    this.addControl(
      "value",
      new ClassicPreset.InputControl("text", { initial: "" })
    );
  }
}

// ---------------------------------------------------------------------------
// 3. MixedNode — accepts both a number input and a string input
// ---------------------------------------------------------------------------
class MixedNode extends ClassicPreset.Node {
  constructor() {
    super("Mixed");
    this.addInput("numIn", new ClassicPreset.Input(numberSocket, "Number In"));
    this.addInput("strIn", new ClassicPreset.Input(stringSocket, "String In"));
  }
}

// ---------------------------------------------------------------------------
// Scheme types
// ---------------------------------------------------------------------------
type AppNode = NumberNode | StringNode | MixedNode;

type Schemes = GetSchemes<
  AppNode,
  ClassicPreset.Connection<AppNode, AppNode>
>;

type AreaExtra = ReactArea2D<Schemes>;

// ---------------------------------------------------------------------------
// 4. createEditor — full plugin stack
// ---------------------------------------------------------------------------
export async function createEditor(container: HTMLElement) {
  // --- Data layer ---
  const editor = new NodeEditor<Schemes>();

  // --- 2-D canvas ---
  const area = new AreaPlugin<Schemes, AreaExtra>(container);

  // --- Wire interaction ---
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  connection.addPreset(ConnectionPresets.classic.setup());

  // --- React renderer ---
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  render.addPreset(Presets.classic.setup());

  // Wire plugins together (order matters)
  editor.use(area);
  area.use(connection);
  area.use(render);

  // Useful UX extensions
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });
  AreaExtensions.simpleNodesOrder(area);

  // -------------------------------------------------------------------------
  // 5. Connection validation pipe
  //
  // Pipes intercept every signal flowing through the editor.
  // • Returning `context`   → the action is ALLOWED to proceed.
  // • Returning `undefined` → the action is BLOCKED / cancelled.
  // -------------------------------------------------------------------------
  editor.addPipe((context) => {
    if (context.type === "connectioncreate") {
      const { source, target } = context.data;

      const sourceNode = editor.getNode(source);
      const targetNode = editor.getNode(target);

      // Guard: if we can't resolve either node, allow the connection through
      // so we don't silently swallow legitimate actions during initialisation.
      if (!sourceNode || !targetNode) return context;

      // Type-mismatch rule: NumberNode → StringNode is forbidden.
      // A number cannot be fed into a string port — block it and explain why.
      if (sourceNode instanceof NumberNode && targetNode instanceof StringNode) {
        console.warn(
          `[Rete] Connection blocked: cannot connect a NumberNode output ` +
            `to a StringNode input — type mismatch (number → string). ` +
            `Use a MixedNode, or convert the value before connecting.`
        );
        // Returning undefined cancels the connectioncreate action entirely.
        return undefined;
      }

      // All other combinations are permitted — return context to allow them.
      return context;
    }

    // Always pass non-connection signals through unchanged.
    return context;
  });

  // -------------------------------------------------------------------------
  // Add sample nodes so the validation can be exercised interactively
  // -------------------------------------------------------------------------
  const numNode = new NumberNode();
  const strNode = new StringNode();
  const mixNode = new MixedNode();

  await editor.addNode(numNode);
  await editor.addNode(strNode);
  await editor.addNode(mixNode);

  // Position nodes for readability
  await area.translate(numNode.id, { x: 0,   y: 0   });
  await area.translate(strNode.id, { x: 400, y: 0   });
  await area.translate(mixNode.id, { x: 400, y: 200 });

  // This connection is VALID: NumberNode → MixedNode (number input)
  await editor.addConnection(
    new ClassicPreset.Connection(numNode, "value", mixNode, "numIn")
  );

  // This connection is also valid: StringNode → MixedNode (string input)
  await editor.addConnection(
    new ClassicPreset.Connection(strNode, "out", mixNode, "strIn")
  );

  // Attempting to add NumberNode → StringNode would be blocked by the pipe.
  // Uncomment the line below to see the console.warn in action:
  // await editor.addConnection(
  //   new ClassicPreset.Connection(numNode, "value", strNode, "in")
  // );

  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    editor,
    destroy: () => area.destroy(),
  };
}
