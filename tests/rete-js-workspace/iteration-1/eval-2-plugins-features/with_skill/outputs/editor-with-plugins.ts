/*
 * npm install:
 *   rete rete-area-plugin rete-connection-plugin rete-render-utils
 *   rete-react-plugin styled-components react@19 react-dom@19
 *   rete-context-menu-plugin
 *   rete-minimap-plugin
 *   rete-history-plugin
 */

import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin";
import { ReactPlugin, Presets, ReactArea2D } from "rete-react-plugin";
import { ContextMenuPlugin, ContextMenuExtra, Presets as ContextMenuPresets } from "rete-context-menu-plugin";
import { MinimapPlugin, MinimapExtra } from "rete-minimap-plugin";
import { HistoryPlugin, HistoryExtensions, Presets as HistoryPresets } from "rete-history-plugin";
import { createRoot } from "react-dom/client";

// ---------------------------------------------------------------------------
// Socket
// ---------------------------------------------------------------------------

const socket = new ClassicPreset.Socket("socket");

// ---------------------------------------------------------------------------
// Node classes — simple stubs with one input and one output each
// ---------------------------------------------------------------------------

export class FilterNode extends ClassicPreset.Node {
  constructor() {
    super("Filter");
    this.addInput("in", new ClassicPreset.Input(socket, "In"));
    this.addOutput("out", new ClassicPreset.Output(socket, "Out"));
  }
}

export class TransformNode extends ClassicPreset.Node {
  constructor() {
    super("Transform");
    this.addInput("in", new ClassicPreset.Input(socket, "In"));
    this.addOutput("out", new ClassicPreset.Output(socket, "Out"));
  }
}

export class OutputNode extends ClassicPreset.Node {
  constructor() {
    super("Output");
    this.addInput("in", new ClassicPreset.Input(socket, "In"));
    this.addOutput("out", new ClassicPreset.Output(socket, "Out"));
  }
}

// ---------------------------------------------------------------------------
// Schemes & AreaExtra — union must cover ALL plugin extras
// ---------------------------------------------------------------------------

type Node = FilterNode | TransformNode | OutputNode;
type Schemes = GetSchemes<Node, ClassicPreset.Connection<Node, Node>>;

type AreaExtra =
  | ReactArea2D<Schemes>
  | ContextMenuExtra
  | MinimapExtra;

// ---------------------------------------------------------------------------
// createEditor
// ---------------------------------------------------------------------------

export async function createEditor(container: HTMLElement) {
  // 1. Data layer
  const editor = new NodeEditor<Schemes>();

  // 2. 2D canvas
  const area = new AreaPlugin<Schemes, AreaExtra>(container);

  // 3. Connection plugin — handles drawing wires
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  connection.addPreset(ConnectionPresets.classic.setup());

  // 4. Render plugin — draws nodes & controls with React
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  render.addPreset(Presets.classic.setup());

  // 5. Context menu plugin — right-click to add nodes
  //    Category "Data" → Filter, Transform
  //    Category "Sink" → Output
  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: ContextMenuPresets.classic.setup([
      ["Data", [
        ["Filter",    () => new FilterNode()],
        ["Transform", () => new TransformNode()],
      ]],
      ["Sink", [
        ["Output", () => new OutputNode()],
      ]],
    ]),
  });

  // 6. Minimap plugin — overview in the corner
  const minimap = new MinimapPlugin<Schemes>({ boundViewport: true });

  // 7. History plugin — undo/redo
  const history = new HistoryPlugin<Schemes>();
  history.addPreset(HistoryPresets.classic.setup());

  // ---------------------------------------------------------------------------
  // Wire everything together (order matters: render plugins after connection)
  // ---------------------------------------------------------------------------
  editor.use(area);
  area.use(connection);
  area.use(render);
  area.use(contextMenu);      // attach context menu to area
  area.use(minimap);          // attach minimap to area
  area.use(history);          // attach history to area

  // Register render presets for context menu and minimap
  render.addPreset(Presets.contextMenu.setup());
  render.addPreset(Presets.minimap.setup({ size: 200 }));

  // Keyboard shortcuts: Ctrl+Z (undo) / Ctrl+Y (redo)
  HistoryExtensions.keyboard(history);

  // ---------------------------------------------------------------------------
  // Node selection helpers
  // ---------------------------------------------------------------------------
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });
  AreaExtensions.simpleNodesOrder(area);

  // ---------------------------------------------------------------------------
  // Seed the canvas with one of each node
  // ---------------------------------------------------------------------------
  const filterNode    = new FilterNode();
  const transformNode = new TransformNode();
  const outputNode    = new OutputNode();

  await editor.addNode(filterNode);
  await editor.addNode(transformNode);
  await editor.addNode(outputNode);

  // Connect Filter → Transform → Output
  await editor.addConnection(
    new ClassicPreset.Connection(filterNode, "out", transformNode, "in")
  );
  await editor.addConnection(
    new ClassicPreset.Connection(transformNode, "out", outputNode, "in")
  );

  // Lay out nodes left-to-right
  await area.translate(filterNode.id,    { x: 0,   y: 0 });
  await area.translate(transformNode.id, { x: 300, y: 0 });
  await area.translate(outputNode.id,    { x: 600, y: 0 });

  // Fit viewport to show all nodes
  AreaExtensions.zoomAt(area, editor.getNodes());

  // ---------------------------------------------------------------------------
  // Programmatic undo/redo helpers (optional — keyboard shortcuts also work)
  // ---------------------------------------------------------------------------
  async function undo() { await history.undo(); }
  async function redo() { await history.redo(); }

  return {
    destroy: () => area.destroy(),
    undo,
    redo,
  };
}
