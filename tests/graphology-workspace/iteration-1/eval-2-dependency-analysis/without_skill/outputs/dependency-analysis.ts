import { DirectedGraph } from 'graphology';
import { dfsFromNode } from 'graphology-traversal';
import betweennessCentrality from 'graphology-metrics/centrality/betweenness';
import { bidirectional } from 'graphology-shortest-path';

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeAttr = {
  betweennessCentrality?: number;
};

type EdgeAttr = Record<string, never>;

// ─── 1. Build the dependency DAG ─────────────────────────────────────────────

const graph = new DirectedGraph<NodeAttr, EdgeAttr>();

// Packages
const packages = [
  'app',
  'react',
  'lodash',
  'axios',
  'react-dom',
  'scheduler',
  'follow-redirects',
];
for (const pkg of packages) {
  graph.mergeNode(pkg);
}

// Dependencies (source → target means "source depends on target")
const deps: [string, string][] = [
  ['app', 'react'],
  ['app', 'lodash'],
  ['app', 'axios'],
  ['react', 'react-dom'],
  ['react', 'scheduler'],
  ['axios', 'follow-redirects'],
  ['react-dom', 'scheduler'],
];
for (const [from, to] of deps) {
  graph.mergeEdge(from, to);
}

console.log(`Graph built: ${graph.order} nodes, ${graph.size} edges\n`);

// ─── 2. DFS from 'app' — print node + depth ───────────────────────────────────

console.log('=== DFS Dependency Order from "app" ===');
dfsFromNode(graph, 'app', (node, _attrs, depth) => {
  const indent = '  '.repeat(depth);
  console.log(`${indent}${node} (depth ${depth})`);
});
console.log();

// ─── 3. Betweenness centrality — written onto node attributes ─────────────────

// betweennessCentrality.assign writes 'betweennessCentrality' onto each node.
// For a DAG we disable normalization so raw path counts are visible.
betweennessCentrality.assign(graph, {
  getEdgeWeight: null, // unweighted
  normalized: true,
});

console.log('=== Betweenness Centrality (per node) ===');
graph.forEachNode((node, attrs) => {
  const score = (attrs.betweennessCentrality ?? 0).toFixed(4);
  console.log(`  ${node.padEnd(18)} ${score}`);
});
console.log();

// ─── 4. Node with the highest betweenness centrality ─────────────────────────

let topNode = '';
let topScore = -Infinity;

graph.forEachNode((node, attrs) => {
  const score = attrs.betweennessCentrality ?? 0;
  if (score > topScore) {
    topScore = score;
    topNode = node;
  }
});

console.log('=== Most Central (Bridge-Like) Node ===');
console.log(`  ${topNode} — betweenness centrality: ${topScore.toFixed(4)}\n`);

// ─── 5. Shortest path from 'app' to 'scheduler' ───────────────────────────────

const path = bidirectional(graph, 'app', 'scheduler');

console.log('=== Shortest Path: app → scheduler ===');
if (path) {
  console.log(`  ${path.join(' → ')}`);
  console.log(`  Length: ${path.length - 1} hop(s)`);
} else {
  console.log('  No path found.');
}
