// =============================================================================
// REQUIRED NPM INSTALLS:
// npm install rete rete-area-plugin rete-connection-plugin rete-react-plugin
// npm install rete-context-menu-plugin rete-minimap-plugin rete-history-plugin
// npm install react react-dom
// npm install -D @types/react @types/react-dom typescript
// =============================================================================

import { NodeEditor, GetSchemes, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions, Area2D } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { ReactPlugin, Presets as ReactPresets, ReactArea2D } from 'rete-react-plugin';
import {
  ContextMenuPlugin,
  ContextMenuExtra,
  Presets as ContextMenuPresets,
} from 'rete-context-menu-plugin';
import { MinimapPlugin, MinimapExtra } from 'rete-minimap-plugin';
import {
  HistoryPlugin,
  HistoryActions,
  Presets as HistoryPresets,
} from 'rete-history-plugin';
import { createRoot } from 'react-dom/client';

// =============================================================================
// Shared socket
// =============================================================================

const socket = new ClassicPreset.Socket('data');

// =============================================================================
// Node definitions
// =============================================================================

/** Stub node – filters data (one input, one output) */
export class FilterNode extends ClassicPreset.Node {
  constructor() {
    super('Filter');
    this.addInput('in', new ClassicPreset.Input(socket, 'In'));
    this.addOutput('out', new ClassicPreset.Output(socket, 'Out'));
  }
}

/** Stub node – transforms data (one input, one output) */
export class TransformNode extends ClassicPreset.Node {
  constructor() {
    super('Transform');
    this.addInput('in', new ClassicPreset.Input(socket, 'In'));
    this.addOutput('out', new ClassicPreset.Output(socket, 'Out'));
  }
}

/** Stub node – terminal sink (one input, no output) */
export class OutputNode extends ClassicPreset.Node {
  constructor() {
    super('Output');
    this.addInput('in', new ClassicPreset.Input(socket, 'In'));
  }
}

// =============================================================================
// Schemes & AreaExtra union
// =============================================================================

type AllNodes = FilterNode | TransformNode | OutputNode;

type Schemes = GetSchemes<
  AllNodes,
  ClassicPreset.Connection<AllNodes, AllNodes>
>;

/**
 * AreaExtra must include every plugin extra that uses the area renderer.
 * - ReactArea2D   → base React rendering
 * - ContextMenuExtra → context-menu overlay
 * - MinimapExtra     → minimap overlay
 */
type AreaExtra = ReactArea2D<Schemes> | ContextMenuExtra | MinimapExtra;

// =============================================================================
// createEditor – wires up every plugin and returns control handles
// =============================================================================

export async function createEditor(container: HTMLElement) {
  // ── Core ──────────────────────────────────────────────────────────────────
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });

  // ── Plugin 1 – Right-click context menu ──────────────────────────────────
  //    Two categories:
  //      'Data' → Filter, Transform
  //      'Sink' → Output
  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: ContextMenuPresets.classic.setup([
      [
        'Data',
        [
          ['Filter', () => new FilterNode()],
          ['Transform', () => new TransformNode()],
        ],
      ],
      [
        'Sink',
        [
          ['Output', () => new OutputNode()],
        ],
      ],
    ]),
  });

  // ── Plugin 2 – Minimap ────────────────────────────────────────────────────
  //    boundViewport keeps the minimap viewport indicator clamped to the map.
  const minimap = new MinimapPlugin<Schemes>({ boundViewport: true });

  // ── Plugin 3 – Undo / Redo ────────────────────────────────────────────────
  const history = new HistoryPlugin<Schemes, HistoryActions<Schemes>>();
  history.addPreset(HistoryPresets.classic.setup());

  // ── Render presets (must match every plugin using the React renderer) ─────
  render.addPreset(ReactPresets.classic.setup());
  render.addPreset(ReactPresets.contextMenu.setup());
  render.addPreset(ReactPresets.minimap.setup({ size: 200 }));

  // ── Connection preset ─────────────────────────────────────────────────────
  connection.addPreset(ConnectionPresets.classic.setup());

  // ── Mount all plugins ─────────────────────────────────────────────────────
  editor.use(area);
  area.use(connection);
  area.use(render);
  area.use(contextMenu); // right-click menu
  area.use(minimap);     // corner minimap
  area.use(history);     // undo/redo history

  // ── Area extensions ───────────────────────────────────────────────────────
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulate: { key: 'shift' },
  });
  AreaExtensions.simpleNodesOrder(area);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  //    Ctrl+Z  → undo
  //    Ctrl+Y  → redo  (also Ctrl+Shift+Z for non-Windows convention)
  const handleKeyDown = async (e: KeyboardEvent) => {
    // Guard: only act when focus is inside the editor container
    if (!container.contains(document.activeElement) && document.activeElement !== document.body) {
      return;
    }

    if (e.ctrlKey && !e.shiftKey && e.key === 'z') {
      e.preventDefault();
      await history.undo();
    } else if (
      e.ctrlKey &&
      (e.key === 'y' || (e.shiftKey && e.key === 'z'))
    ) {
      e.preventDefault();
      await history.redo();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  // Make container focusable so keyboard events register when clicking inside
  if (!container.hasAttribute('tabindex')) {
    container.setAttribute('tabindex', '-1');
  }

  // ── Zoom to fit all nodes after initial layout ────────────────────────────
  await AreaExtensions.zoomAt(area, editor.getNodes());

  // ── Cleanup ───────────────────────────────────────────────────────────────
  const destroy = () => {
    document.removeEventListener('keydown', handleKeyDown);
    area.destroy();
  };

  return {
    editor,   // NodeEditor – add/remove nodes & connections programmatically
    area,     // AreaPlugin – pan/zoom control
    history,  // HistoryPlugin – call .undo() / .redo() programmatically
    destroy,  // call when unmounting to remove listeners and clean up DOM
  };
}
