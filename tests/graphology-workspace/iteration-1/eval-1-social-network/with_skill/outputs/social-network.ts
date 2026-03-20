import { DirectedGraph } from 'graphology';
import pagerank from 'graphology-metrics/centrality/pagerank';
import { bidirectional } from 'graphology-shortest-path';

// ── Type definitions ──────────────────────────────────────────────────────────

type NodeAttr = {
  name: string;
  followerCount: number;
  pagerank?: number;
};

type EdgeAttr = {
  type: 'follows';
};

// ── 1. Create a DirectedGraph ─────────────────────────────────────────────────

const graph = new DirectedGraph<NodeAttr, EdgeAttr>();

// ── 2. Add 5 users as nodes ───────────────────────────────────────────────────

graph.addNode('alice', { name: 'Alice', followerCount: 1200 });
graph.addNode('bob',   { name: 'Bob',   followerCount: 850  });
graph.addNode('carol', { name: 'Carol', followerCount: 640  });
graph.addNode('dave',  { name: 'Dave',  followerCount: 2300 });
graph.addNode('eve',   { name: 'Eve',   followerCount: 310  });

// ── 3. Add 'follows' directed edges ──────────────────────────────────────────

graph.addEdge('alice', 'bob',   { type: 'follows' });
graph.addEdge('bob',   'carol', { type: 'follows' });
graph.addEdge('carol', 'dave',  { type: 'follows' });
graph.addEdge('alice', 'dave',  { type: 'follows' });
graph.addEdge('bob',   'dave',  { type: 'follows' });
graph.addEdge('eve',   'alice', { type: 'follows' });

// ── 4. Compute PageRank and write scores back onto each node ──────────────────

// .assign() is the idiomatic pattern: writes the 'pagerank' attribute
// directly onto every node, ready for inspection or rendering.
pagerank.assign(graph);

console.log('=== PageRank scores ===');
graph.forEachNode((node, attrs) => {
  console.log(`  ${node}: ${attrs.pagerank?.toFixed(6)}`);
});

// ── 5. Shortest directed follow-path from 'eve' to 'dave' ────────────────────

// bidirectional() respects directed edges; returns null if unreachable.
const path = bidirectional(graph, 'eve', 'dave');

console.log('\n=== Shortest follow-path: eve → dave ===');
if (path) {
  console.log(path.join(' → '));
} else {
  console.log('No directed path found.');
}

// ── 6. Export the graph to JSON ───────────────────────────────────────────────

const exported = graph.export();
const json = JSON.stringify(exported, null, 2);

console.log('\n=== Graph JSON ===');
console.log(json);
