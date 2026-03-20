import { UndirectedGraph } from 'graphology';
import { write, parse } from 'graphology-gexf';
import random from 'graphology-layout/random';
import forceAtlas2 from 'graphology-layout-forceatlas2';

// ─── 1. Build the undirected graph ───────────────────────────────────────────

const graph = new UndirectedGraph();

graph.addNode('a', { label: 'Node A', weight: 1.0 });
graph.addNode('b', { label: 'Node B', weight: 2.0 });
graph.addNode('c', { label: 'Node C', weight: 1.5 });
graph.addNode('d', { label: 'Node D', weight: 3.0 });
graph.addNode('e', { label: 'Node E', weight: 0.5 });

graph.addEdge('a', 'b');
graph.addEdge('b', 'c');
graph.addEdge('c', 'd');
graph.addEdge('d', 'e');
graph.addEdge('e', 'a');
graph.addEdge('a', 'c');

console.log('Original graph — nodes:', graph.order, '| edges:', graph.size);

// ─── 2. Serialize to GEXF ────────────────────────────────────────────────────

const gexfString = write(graph);
console.log('\n--- GEXF serialization ---');
console.log(gexfString);

// ─── 3. Parse back from GEXF into a new graph instance ───────────────────────

const parsed = parse(UndirectedGraph, gexfString);
console.log('--- Round-trip complete ---');
console.log('Parsed graph node count:', parsed.order); // Expected: 5

// ─── 4. Random layout → ForceAtlas2 (iterative raw call) ─────────────────────

// Give every node an initial x/y so FA2 has a starting position
random.assign(parsed);

// Infer sensible FA2 settings from the graph's structure
const inferredSettings = forceAtlas2.inferSettings(parsed);
console.log('\nInferred FA2 settings:', inferredSettings);

// Raw call — returns a { [nodeKey]: { x, y } } positions map without mutating
const positions = forceAtlas2(parsed, {
  iterations: 50,
  settings: inferredSettings,
});

// Apply the computed positions back onto the graph nodes in-place
parsed.updateEachNodeAttributes((node, attr) => ({
  ...attr,
  x: positions[node].x,
  y: positions[node].y,
}));

// ─── 5. Log final node positions ─────────────────────────────────────────────

console.log('\nNode positions after 50 ForceAtlas2 iterations:');
parsed.forEachNode((node, attr) => {
  const x = (attr as Record<string, number>).x;
  const y = (attr as Record<string, number>).y;
  console.log(`  ${node}: x = ${x.toFixed(6)},  y = ${y.toFixed(6)}`);
});

// ─── 6. emptyCopy — same graph options, no nodes/edges ───────────────────────
//   Repopulate with all nodes/edges but strip position attributes (x, y).

const stripped = parsed.emptyCopy();

parsed.forEachNode((node, attr) => {
  // Destructure out layout attributes; keep domain attributes only
  const { x, y, ...domainAttrs } = attr as Record<string, unknown>;
  stripped.addNode(node, domainAttrs);
});

parsed.forEachEdge((_edge, edgeAttr, source, target) => {
  stripped.addEdge(source, target, edgeAttr);
});

console.log('\nemptyCopy (no positions):');
console.log('  node count:', stripped.order); // 5
console.log('  edge count:', stripped.size);  // 6
