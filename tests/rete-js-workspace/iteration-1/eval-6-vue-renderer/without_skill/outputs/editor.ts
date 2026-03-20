import { NodeEditor, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { VuePlugin, Presets as VuePresets, VueArea2D } from "rete-vue-plugin";

type Schemes = ClassicPreset.Schemes;
type AreaExtra = VueArea2D<Schemes>;

const socket = new ClassicPreset.Socket("number");

class NumberNode extends ClassicPreset.Node {
  constructor(public value: number) {
    super("Number");
    this.addOutput("value", new ClassicPreset.Output(socket, "Number"));
  }
}

class AddNode extends ClassicPreset.Node {
  constructor() {
    super("Add");
    this.addInput("a", new ClassicPreset.Input(socket, "A"));
    this.addInput("b", new ClassicPreset.Input(socket, "B"));
    this.addOutput("sum", new ClassicPreset.Output(socket, "Sum"));
  }
}

export async function createEditor(container: HTMLElement) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new VuePlugin<Schemes, AreaExtra>();

  // Selectable nodes with Ctrl-click accumulation
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  // Register presets
  render.addPreset(VuePresets.classic.setup());
  connection.addPreset(ConnectionPresets.classic.setup());

  // Plugin order: editor → area → connection/render
  editor.use(area);
  area.use(connection);
  area.use(render);

  AreaExtensions.simpleNodesOrder(area);

  // Create nodes
  const num1 = new NumberNode(1);
  const num2 = new NumberNode(2);
  const add = new AddNode();

  await editor.addNode(num1);
  await editor.addNode(num2);
  await editor.addNode(add);

  // Position nodes on the canvas
  await area.translate(num1.id, { x: 80,  y: 80  });
  await area.translate(num2.id, { x: 80,  y: 280 });
  await area.translate(add.id,  { x: 420, y: 160 });

  // Wire num1 → add.a and num2 → add.b
  await editor.addConnection(
    new ClassicPreset.Connection(num1, "value", add, "a")
  );
  await editor.addConnection(
    new ClassicPreset.Connection(num2, "value", add, "b")
  );

  // Fit-to-view after initial layout tick
  setTimeout(() => {
    AreaExtensions.zoomAt(area, editor.getNodes());
  }, 10);

  return {
    destroy: () => area.destroy(),
  };
}
