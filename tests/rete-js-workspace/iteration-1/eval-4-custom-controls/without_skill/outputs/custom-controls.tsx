import React from "react";
import { NodeEditor, ClassicPreset, GetSchemes } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { ReactPlugin, Presets, ReactArea2D } from "rete-react-plugin";

// ─────────────────────────────────────────────
// 1. SliderControl – standalone, not extending InputControl
// ─────────────────────────────────────────────
export class SliderControl extends ClassicPreset.Control {
  public value: number;

  constructor(
    public readonly min: number,
    public readonly max: number,
    initialValue: number,
    public onChange?: (value: number) => void
  ) {
    super();
    this.value = initialValue;
  }

  setValue(v: number): void {
    this.value = Math.min(this.max, Math.max(this.min, v));
    this.onChange?.(this.value);
  }
}

// ─────────────────────────────────────────────
// Slider React component rendered by the preset
// ─────────────────────────────────────────────
function SliderComponent({ data }: { data: SliderControl }) {
  const [value, setValue] = React.useState<number>(data.value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    setValue(next);
    data.setValue(next);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "4px 0",
        userSelect: "none",
      }}
    >
      <input
        type="range"
        min={data.min}
        max={data.max}
        value={value}
        onChange={handleChange}
        // Prevent the area plugin from interpreting drag events on the slider
        onPointerDown={(e) => e.stopPropagation()}
        style={{ width: 140, cursor: "pointer" }}
      />
      <span style={{ fontSize: 11, textAlign: "center" }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Scheme / type helpers
// ─────────────────────────────────────────────
type Schemes = GetSchemes<
  VolumeNode,
  ClassicPreset.Connection<VolumeNode, VolumeNode>
>;

type AreaExtra = ReactArea2D<Schemes>;

// ─────────────────────────────────────────────
// 2. VolumeNode
// ─────────────────────────────────────────────
const audioSocket = new ClassicPreset.Socket("audio");

export class VolumeNode extends ClassicPreset.Node<
  { input: ClassicPreset.Socket },
  { output: ClassicPreset.Socket },
  {
    slider: SliderControl;
    label: ClassicPreset.InputControl<"text">;
  }
> {
  constructor() {
    super("Volume");

    // SliderControl: range 0–100, initial value 50
    this.addControl(
      "slider",
      new SliderControl(0, 100, 50, (v) => {
        console.log("[VolumeNode] volume changed:", v);
      })
    );

    // Standard text InputControl for the label
    this.addControl(
      "label",
      new ClassicPreset.InputControl("text", {
        initial: "Channel 1",
        readonly: false,
      })
    );

    this.addInput("input", new ClassicPreset.Input(audioSocket, "In"));
    this.addOutput("output", new ClassicPreset.Output(audioSocket, "Out"));
  }
}

// ─────────────────────────────────────────────
// 3. createEditor – full plugin stack
// ─────────────────────────────────────────────
export async function createEditor(container: HTMLElement) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>();

  // ── Plugin order: area → connection + render ──
  editor.use(area);
  area.use(connection);
  area.use(render);

  connection.addPreset(ConnectionPresets.classic.setup());

  // 4. Render preset with customize.control callback
  render.addPreset(
    Presets.classic.setup({
      customize: {
        control(context) {
          // Return custom slider component for SliderControl instances
          if (context.payload instanceof SliderControl) {
            return SliderComponent as React.FC<{ data: SliderControl }>;
          }
          // Fall back to the built-in InputControl renderer for everything else
          if (context.payload instanceof ClassicPreset.InputControl) {
            return Presets.classic.Control;
          }
          return null;
        },
      },
    })
  );

  AreaExtensions.simpleNodesOrder(area);
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  // Seed with a single VolumeNode
  const volumeNode = new VolumeNode();
  await editor.addNode(volumeNode);
  await area.translate(volumeNode.id, { x: 160, y: 120 });

  // Fit the viewport to show all nodes
  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    editor,
    area,
    destroy: () => area.destroy(),
  };
}
