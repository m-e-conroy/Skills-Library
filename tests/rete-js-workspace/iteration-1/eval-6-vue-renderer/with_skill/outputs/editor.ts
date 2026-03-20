import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin";
import { VuePlugin, Presets, VueArea2D } from "rete-vue-plugin";

// ── Type definitions ──────────────────────────────────────────────────────────

class NumberNode extends ClassicPreset.Node {
  constructor(socket: ClassicPreset.Socket) {
    super("Number");
    this.addControl(
      "value",
      new ClassicPreset.InputControl("number", { initial: 0 })
    );
    this.addOutput("value", new ClassicPreset.Output(socket, "Value"));
  }
}

class OutputNode extends ClassicPreset.Node {
  constructor(socket: ClassicPreset.Socket) {
    super("Output");
    this.addInput("value", new ClassicPreset.Input(socket, "Value"));
    this.addControl(
      "label",
      new ClassicPreset.InputControl("text", { initial: "result", readonly: true })
    );
  }
}

type Node = NumberNode | OutputNode;
type Schemes = GetSchemes<Node, ClassicPreset.Connection<Node, Node>>;
type AreaExtra = VueArea2D<Schemes>;

// ── createEditor ──────────────────────────────────────────────────────────────

export async function createEditor(container: HTMLElement) {
  const socket = new ClassicPreset.Socket("socket");

  // 1. Data layer
  const editor = new NodeEditor<Schemes>();

  // 2. 2D canvas
  const area = new AreaPlugin<Schemes, AreaExtra>(container);

  // 3. Connection plugin — handles wire drag interactions
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  connection.addPreset(ConnectionPresets.classic.setup());

  // 4. Render plugin — draws nodes using Vue
  const render = new VuePlugin<Schemes, AreaExtra>();
  render.addPreset(Presets.classic.setup());

  // 5. Wire plugins together (order matters)
  editor.use(area);
  area.use(connection);
  area.use(render);

  // 6. Useful area extensions
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });
  AreaExtensions.simpleNodesOrder(area);

  // 7. Add initial nodes
  const numNode = new NumberNode(socket);
  await editor.addNode(numNode);

  const outNode = new OutputNode(socket);
  await editor.addNode(outNode);

  // 8. Connect NumberNode → OutputNode
  await editor.addConnection(
    new ClassicPreset.Connection(numNode, "value", outNode, "value")
  );

  // 9. Position nodes then fit viewport
  await area.translate(numNode.id, { x: 100, y: 200 });
  await area.translate(outNode.id, { x: 450, y: 200 });
  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    destroy: () => area.destroy(),
  };
}
