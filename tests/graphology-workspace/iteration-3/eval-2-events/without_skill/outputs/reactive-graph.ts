import { DirectedGraph } from 'graphology';

const graph = new DirectedGraph();

// Derived data structure: node → set of out-neighbor IDs
const adjMap = new Map<string, Set<string>>();

// --- Event subscriptions ---

graph.on('nodeAdded', ({ key }: { key: string }) => {
  adjMap.set(key, new Set<string>());
});

graph.on('edgeAdded', ({ source, target }: { source: string; target: string }) => {
  adjMap.get(source)?.add(target);
});

// When a node is dropped, graphology fires edgeDropped for all incident edges
// first, then fires nodeDropped. The edgeDropped handler cleans up adjacency
// entries; the nodeDropped handler removes the node's own entry and does a
// final sweep to remove it from any remaining Sets (safety net).
graph.on('nodeDropped', ({ key }: { key: string }) => {
  adjMap.delete(key);
  for (const neighbors of adjMap.values()) {
    neighbors.delete(key);
  }
});

graph.on('edgeDropped', ({ source, target }: { source: string; target: string }) => {
  adjMap.get(source)?.delete(target);
});

// --- Imperatively build the graph ---

graph.addNode('a');
graph.addNode('b');
graph.addNode('c');
graph.addNode('d');

graph.addEdge('a', 'b'); // nodeAdded × 4 already fired; now edgeAdded fires 4×
graph.addEdge('a', 'c');
graph.addEdge('b', 'd');
graph.addEdge('c', 'd');

// --- Drop node 'c' ---
// Graphology will fire edgeDropped for a→c and c→d before firing nodeDropped for 'c'.
graph.dropNode('c');

// --- Log final adjMap ---
console.log('Final adjMap (out-adjacency):');
for (const [node, neighbors] of adjMap) {
  console.log(`  ${node} → { ${[...neighbors].join(', ')} }`);
}

// Expected output:
//   a → { b }        (c was removed when the a→c edge was dropped)
//   b → { d }
//   d → { }
