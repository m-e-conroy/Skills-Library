import { DirectedGraph } from 'graphology';

// Derived data structure: mirrors the graph's out-adjacency
const adjMap = new Map<string, Set<string>>();

const graph = new DirectedGraph();

// ── Event subscriptions ────────────────────────────────────────────────────

graph.on('nodeAdded', ({ key }: { key: string }) => {
  adjMap.set(key, new Set<string>());
});

graph.on('edgeAdded', ({ source, target }: { source: string; target: string }) => {
  adjMap.get(source)?.add(target);
});

graph.on('nodeDropped', ({ key }: { key: string }) => {
  // Remove this node's own entry
  adjMap.delete(key);
  // Remove the node from every other node's neighbor set
  for (const neighbors of adjMap.values()) {
    neighbors.delete(key);
  }
});

graph.on('edgeDropped', ({ source, target }: { source: string; target: string }) => {
  adjMap.get(source)?.delete(target);
});

// ── Build the graph imperatively ───────────────────────────────────────────

graph.addNode('a');
graph.addNode('b');
graph.addNode('c');
graph.addNode('d');

graph.addEdge('a', 'b');
graph.addEdge('a', 'c');
graph.addEdge('b', 'd');
graph.addEdge('c', 'd');

// ── Drop node 'c' (graphology also drops its incident edges) ──────────────

graph.dropNode('c');

// ── Log final state ────────────────────────────────────────────────────────

console.log('Final adjMap:');
for (const [node, neighbors] of adjMap.entries()) {
  console.log(`  ${node} → [${[...neighbors].join(', ')}]`);
}

// Expected output:
//   a → [b]        (c was removed when node 'c' was dropped)
//   b → [d]
//   d → []
