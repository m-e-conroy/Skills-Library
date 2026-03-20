import { DirectedGraph } from 'graphology';
import pagerank from 'graphology-metrics/centrality/pagerank';
import { bidirectional } from 'graphology-shortest-path';

// ── 1. Create a DirectedGraph ────────────────────────────────────────────────
type NodeAttr = { name: string; followerCount: number; pagerank?: number };
type EdgeAttr = { type: string };

const graph = new DirectedGraph<NodeAttr, EdgeAttr>();

// ── 2. Add 5 users as nodes ──────────────────────────────────────────────────
graph.addNode('alice', { name: 'Alice',  followerCount: 820 });
graph.addNode('bob',   { name: 'Bob',    followerCount: 450 });
graph.addNode('carol', { name: 'Carol',  followerCount: 310 });
graph.addNode('dave',  { name: 'Dave',   followerCount: 980 });
graph.addNode('eve',   { name: 'Eve',    followerCount: 120 });

// ── 3. Add 'follows' edges ───────────────────────────────────────────────────
graph.addDirectedEdge('alice', 'bob',   { type: 'follows' });
graph.addDirectedEdge('bob',   'carol', { type: 'follows' });
graph.addDirectedEdge('carol', 'dave',  { type: 'follows' });
graph.addDirectedEdge('alice', 'dave',  { type: 'follows' });
graph.addDirectedEdge('bob',   'dave',  { type: 'follows' });
graph.addDirectedEdge('eve',   'alice', { type: 'follows' });

// ── 4. Compute PageRank and write scores back onto each node ─────────────────
// pagerank.assign writes a 'pagerank' attribute onto every node
pagerank.assign(graph, { alpha: 0.85 });

console.log('PageRank scores:');
graph.forEachNode((node: string, attrs: NodeAttr) => {
  console.log(`  ${attrs.name}: ${attrs.pagerank?.toFixed(6)}`);
});

// ── 5. Shortest follow-path (directed) from 'eve' to 'dave' ─────────────────
// bidirectional performs an unweighted BFS; respects edge direction in a DirectedGraph
const shortestPath = bidirectional(graph, 'eve', 'dave');

console.log('\nShortest follow-path from eve → dave:');
if (shortestPath) {
  console.log(' ', shortestPath.join(' → '));
} else {
  console.log('  No directed path found.');
}

// ── 6. Export the graph to JSON ──────────────────────────────────────────────
const exported = graph.export();
const json = JSON.stringify(exported, null, 2);

console.log('\nGraph JSON export:');
console.log(json);
