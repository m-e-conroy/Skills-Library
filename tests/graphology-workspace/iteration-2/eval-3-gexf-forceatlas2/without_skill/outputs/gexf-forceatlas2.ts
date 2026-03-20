import { UndirectedGraph } from 'graphology';
import { write, parse } from 'graphology-gexf';
import random from 'graphology-layout/random';
import forceAtlas2 from 'graphology-layout-forceatlas2';

// ── 1. Build graph ────────────────────────────────────────────────────────────

const graph = new UndirectedGraph<{ label: string; weight: number }>();

const nodes = ['a', 'b', 'c', 'd', 'e'];
nodes.forEach((id) =>
  graph.addNode(id, { label: id.toUpperCase(), weight: Math.random() })
);

const edges: [string, string][] = [
  ['a', 'b'],
  ['b', 'c'],
  ['c', 'd'],
  ['d', 'e'],
  ['e', 'a'],
  ['a', 'c'],
];
edges.forEach(([s, t]) => graph.addEdge(s, t));

console.log('Original graph — nodes:', graph.order, 'edges:', graph.size);

// ── 2. Serialize to GEXF ─────────────────────────────────────────────────────

const gexfString = write(graph);
console.log('\n--- GEXF output (truncated) ---');
console.log(gexfString.slice(0, 400), '...');

// ── 3. Parse back from GEXF ───────────────────────────────────────────────────

const parsed = parse(UndirectedGraph, gexfString);
console.log('\nParsed graph node count (round-trip check):', parsed.order);

// ── 4. Random layout → ForceAtlas2 ────────────────────────────────────────────

// Give every node an initial x, y so FA2 has a starting position
random.assign(parsed);

const inferredSettings = forceAtlas2.inferSettings(parsed);
console.log('\nInferred FA2 settings:', inferredSettings);

// Run FA2 in-place on the parsed graph
forceAtlas2.assign(parsed, { iterations: 50, settings: inferredSettings });

// ── 5. Log final positions ────────────────────────────────────────────────────

console.log('\nNode positions after 50 FA2 iterations:');
parsed.forEachNode((node, attrs) => {
  // x and y are added by the layout; cast to access them
  const { x, y } = attrs as unknown as { x: number; y: number };
  console.log(`  ${node}: x=${x.toFixed(4)}, y=${y.toFixed(4)}`);
});

// ── 6. Structural copy (no position attributes) ───────────────────────────────

const structural = parsed.emptyCopy();

// emptyCopy preserves graph options but copies no nodes or edges
// Re-add all nodes/edges without position attributes
parsed.forEachNode((node, attrs) => {
  const { label, weight } = attrs as unknown as {
    label: string;
    weight: number;
    x: number;
    y: number;
  };
  structural.addNode(node, { label, weight });
});

parsed.forEachEdge((_edge, _attrs, source, target) => {
  structural.addEdge(source, target);
});

console.log(
  '\nStructural copy — nodes:',
  structural.order,
  'edges:',
  structural.size
);

// Confirm no x/y on structural copy
const sampleAttrs = structural.getNodeAttributes('a') as Record<string, unknown>;
console.log(
  'Structural copy node "a" attributes (no x,y):',
  JSON.stringify(sampleAttrs)
);
