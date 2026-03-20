import { UndirectedGraph } from 'graphology';
import { write, parse } from 'graphology-gexf';
import random from 'graphology-layout/random';
import forceAtlas2 from 'graphology-layout-forceatlas2';

// ─── Types ────────────────────────────────────────────────────────────────────
type NodeAttr = { label: string; weight: number; x?: number; y?: number };

// ─── Step 1: Build an UndirectedGraph of 5 nodes with attributes ──────────────
const graph = new UndirectedGraph<NodeAttr>();

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

console.log(`Built graph: ${graph.order} nodes, ${graph.size} edges`);

// ─── Step 2: Serialize to GEXF string ─────────────────────────────────────────
const gexfString = write(graph);
console.log('\n--- GEXF Output ---');
console.log(gexfString);

// ─── Step 3: Parse back into a NEW graph instance ─────────────────────────────
const parsedGraph = parse(UndirectedGraph, gexfString) as UndirectedGraph<NodeAttr>;
console.log(`Parsed graph node count (round-trip confirmed): ${parsedGraph.order}`);

// ─── Step 4: Random layout seed, then ForceAtlas2 iteratively ────────────────
// Seed x/y via random layout — FA2 requires initial positions
random.assign(parsedGraph);

// Infer sensible FA2 settings based on graph size and structure
const inferredSettings = forceAtlas2.inferSettings(parsedGraph);
console.log('\nFA2 inferred settings:', inferredSettings);

// Raw call — returns a positions map { nodeKey: { x, y } } without mutating graph
const positions = forceAtlas2(parsedGraph, {
  iterations: 50,
  settings: inferredSettings,
});

// Apply computed positions back to the graph in-place
parsedGraph.updateEachNodeAttributes((node: string, attr: NodeAttr) => ({
  ...attr,
  x: positions[node].x,
  y: positions[node].y,
}));

// ─── Step 5: Log each node's final x, y after ForceAtlas2 ────────────────────
console.log('\n--- Final Node Positions after ForceAtlas2 (50 iterations) ---');
parsedGraph.forEachNode((node: string, attrs: NodeAttr) => {
  const x = attrs.x ?? 0;
  const y = attrs.y ?? 0;
  console.log(`  ${node}: x=${x.toFixed(4)}, y=${y.toFixed(4)}`);
});

// ─── Step 6: Structural copy via emptyCopy() — nodes/edges, no position attrs ─
// emptyCopy() creates a same-options graph with zero nodes/edges
const structuralCopy = parsedGraph.emptyCopy();

// Manually copy nodes without x/y, and copy all edges
parsedGraph.forEachNode((node: string, attrs: NodeAttr) => {
  const { x: _x, y: _y, ...coreAttrs } = attrs;
  structuralCopy.addNode(node, coreAttrs);
});

parsedGraph.forEachEdge((_edge: string, attrs: Record<string, unknown>, source: string, target: string) => {
  structuralCopy.addEdge(source, target, attrs);
});

console.log(`\nStructural copy node count: ${structuralCopy.order}`);
console.log(`Structural copy edge count: ${structuralCopy.size}`);
