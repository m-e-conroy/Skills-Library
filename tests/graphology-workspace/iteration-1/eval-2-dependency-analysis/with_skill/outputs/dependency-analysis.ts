import { DirectedGraph } from 'graphology';
import { dfsFromNode } from 'graphology-traversal';
import betweennessCentrality from 'graphology-metrics/centrality/betweenness';
import { bidirectional } from 'graphology-shortest-path';

// ── Types ────────────────────────────────────────────────────────────────────

type NodeAttr = {
  betweennessCentrality?: number;
};

// ── 1. Build the DAG ─────────────────────────────────────────────────────────

const graph = new DirectedGraph<NodeAttr>();

// mergeNode is idempotent — safe to call even if a node is added multiple times
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

// Directed edges: source → dependency
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

// ── 2. DFS Traversal from 'app' ───────────────────────────────────────────────

console.log('=== DFS Traversal from "app" ===');
dfsFromNode(graph, 'app', (node, _attrs, depth) => {
  const indent = '  '.repeat(depth);
  console.log(`${indent}${node}  (depth: ${depth})`);
});

// ── 3. Betweenness Centrality → node attributes ───────────────────────────────

// .assign() writes the 'betweennessCentrality' key directly onto every node's
// attribute object — idiomatic Graphology pattern for rendering pipelines.
betweennessCentrality.assign(graph);

console.log('\n=== Betweenness Centrality (per node) ===');
graph.forEachNode((node, attrs) => {
  const score = attrs.betweennessCentrality ?? 0;
  console.log(`  ${node.padEnd(20)} ${score.toFixed(6)}`);
});

// ── 4. Node with highest betweenness centrality ───────────────────────────────

let topNode = '';
let topScore = -Infinity;

graph.forEachNode((node, attrs) => {
  const score = attrs.betweennessCentrality ?? 0;
  if (score > topScore) {
    topScore = score;
    topNode = node;
  }
});

console.log('\n=== Highest Betweenness Centrality ===');
console.log(`  ${topNode}  (score: ${topScore.toFixed(6)})`);
console.log(`  → "${topNode}" is the most bridge-like package in the dependency graph.`);

// ── 5. Shortest path from 'app' to 'scheduler' ───────────────────────────────

const path = bidirectional(graph, 'app', 'scheduler');

console.log('\n=== Shortest Path: app → scheduler ===');
if (path) {
  console.log(`  ${path.join(' → ')}`);
  console.log(`  Path length: ${path.length - 1} hop(s)`);
} else {
  console.log('  No path found.');
}
