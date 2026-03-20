import { DirectedGraph } from 'graphology';

// Derived data structure: maps each node to its set of out-neighbors
const adjMap = new Map<string, Set<string>>();

const graph = new DirectedGraph();

// --- Event subscriptions ---

graph.on('nodeAdded', ({ key }: { key: string }) => {
  adjMap.set(key, new Set());
});

graph.on('edgeAdded', ({ source, target }: { source: string; target: string }) => {
  adjMap.get(source)?.add(target);
});

// When a node is dropped, graphology fires edgeDropped for each incident edge
// first, then fires nodeDropped. The edgeDropped handlers clean up Sets, then
// nodeDropped deletes the node's own entry and any stale appearances as a target.
graph.on('edgeDropped', ({ source, target }: { source: string; target: string }) => {
  adjMap.get(source)?.delete(target);
});

graph.on('nodeDropped', ({ key }: { key: string }) => {
  // Remove the node's own entry
  adjMap.delete(key);

  // Defensive: remove the dropped node from all neighbor sets (handles any
  // ordering where edgeDropped hasn't already cleaned up 'key' as a target)
  for (const neighbors of adjMap.values()) {
    neighbors.delete(key);
  }
});

// --- Build the graph ---

graph.addNode('a');
graph.addNode('b');
graph.addNode('c');
graph.addNode('d');

graph.addEdge('a', 'b');
graph.addEdge('a', 'c');
graph.addEdge('b', 'd');
graph.addEdge('c', 'd');

// --- Drop node 'c' ---
// Graphology automatically drops edges a→c and c→d, firing edgeDropped for
// each before firing nodeDropped for 'c'.
graph.dropNode('c');

// --- Log final state ---
console.log('Final adjMap after dropping node c:');
for (const [node, neighbors] of adjMap) {
  console.log(`  ${node} -> { ${[...neighbors].join(', ')} }`);
}

// Expected output:
//   a -> { b }
//   b -> { d }
//   d -> {  }
