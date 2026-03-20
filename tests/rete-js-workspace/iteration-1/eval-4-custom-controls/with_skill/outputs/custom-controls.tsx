import React from "react";
import { createRoot } from "react-dom/client";
import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin";
import { ReactPlugin, Presets, ReactArea2D } from "rete-react-plugin";

// ---------------------------------------------------------------------------
// 1. SliderControl — standalone class (does NOT extend ClassicPreset.InputControl)
// ---------------------------------------------------------------------------

export class SliderControl {
  readonly id: string = Math.random().toString(36).slice(2);

  constructor(
    public min: number,
    public max: number,
    public value: number
  ) {}

  setValue(v: number): void {
    this.value = Math.min(this.max, Math.max(this.min, v));
  }
}

// ---------------------------------------------------------------------------
// 2. VolumeNode — uses a SliderControl (0–100, initial 50) + text InputControl
// ---------------------------------------------------------------------------

const socket = new ClassicPreset.Socket("audio");

export class VolumeNode extends ClassicPreset.Node<
  Record<string, never>,
  { out: ClassicPreset.Socket },
  { volume: SliderControl; label: ClassicPreset.InputControl<"text"> }
> {
  constructor() {
    super("Volume");
    this.addControl("volume", new SliderControl(0, 100, 50));
    this.addControl(
      "label",
      new ClassicPreset.InputControl("text", { initial: "Channel 1" })
    );
    this.addOutput("out", new ClassicPreset.Output(socket, "Signal"));
  }
}

// ---------------------------------------------------------------------------
// TypeScript scheme types
// ---------------------------------------------------------------------------

type Schemes = GetSchemes<
  VolumeNode,
  ClassicPreset.Connection<VolumeNode, VolumeNode>
>;
type AreaExtra = ReactArea2D<Schemes>;

// ---------------------------------------------------------------------------
// 3 & 4. createEditor — full plugin stack + render preset with customize.control
// ---------------------------------------------------------------------------

export async function createEditor(container: HTMLElement) {
  // Data layer
  const editor = new NodeEditor<Schemes>();

  // 2D canvas
  const area = new AreaPlugin<Schemes, AreaExtra>(container);

  // Connection interaction
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  connection.addPreset(ConnectionPresets.classic.setup());

  // Render plugin — requires createRoot for React 19
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });

  render.addPreset(
    Presets.classic.setup({
      customize: {
        // 4. Control customization callback
        control(context) {
          // SliderControl → custom <input type="range">
          if (context.payload instanceof SliderControl) {
            return ({ data }: { data: SliderControl }) => (
              <input
                type="range"
                min={data.min}
                max={data.max}
                value={data.value}
                // stopPropagation prevents AreaPlugin from treating this as a node drag
                onPointerDown={(e) => e.stopPropagation()}
                onChange={(e) => data.setValue(Number(e.target.value))}
                style={{ width: "100%", cursor: "pointer" }}
              />
            );
          }

          // ClassicPreset.InputControl → keep the default Rete control
          if (context.payload instanceof ClassicPreset.InputControl) {
            return Presets.classic.Control;
          }

          // Fallback: let Rete decide
          return undefined;
        },
      },
    })
  );

  // Plugin wiring order: editor → area → connection / render
  editor.use(area);
  area.use(connection);
  area.use(render);

  // Useful extensions
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });
  AreaExtensions.simpleNodesOrder(area);

  // Add a VolumeNode to the canvas
  const volumeNode = new VolumeNode();
  await editor.addNode(volumeNode);
  await area.translate(volumeNode.id, { x: 200, y: 150 });

  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    editor,
    area,
    destroy: () => area.destroy(),
  };
}
