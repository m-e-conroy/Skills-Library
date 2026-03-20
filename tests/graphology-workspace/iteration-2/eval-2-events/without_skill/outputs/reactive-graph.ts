import { DirectedGraph } from 'graphology';

const graph = new DirectedGraph();

// Derived adjacency map: nodeKey → Set of out-neighbor keys
const adjMap = new Map<string, Set<string>>();

// ── Event subscriptions ──────────────────────────────────────────────────────

// When a node is added, register an empty out-neighbor set
graph.on('nodeAdded', ({ key }: { key: string }) => {
  console.log(`[event] nodeAdded: "${key}"`);
  adjMap.set(key, new Set<string>());
});

// When a directed edge is added, record target in source's set
graph.on('edgeAdded', ({ source, target }: { source: string; target: string }) => {
  console.log(`[event] edgeAdded: "${source}" → "${target}"`);
  adjMap.get(source)?.add(target);
});

// When an edge is dropped, remove target from source's set
// (graphology fires edgeDropped for every incident edge BEFORE nodeDropped
//  when dropNode is called, so these handlers run first)
graph.on('edgeDropped', ({ source, target }: { source: string; target: string }) => {
  console.log(`[event] edgeDropped: "${source}" → "${target}"`);
  adjMap.get(source)?.delete(target);
});

// When a node is dropped, remove its entry AND scrub it from all other sets
// (acts as a safety net on top of the edgeDropped cleanup above)
graph.on('nodeDropped', ({ key }: { key: string }) => {
  console.log(`[event] nodeDropped: "${key}"`);
  adjMap.delete(key);
  for (const neighbors of adjMap.values()) {
    neighbors.delete(key);
  }
});

// ── Imperative mutations ─────────────────────────────────────────────────────

console.log('\n── Adding nodes ─────────────────────────────────────────');
graph.addNode('a');
graph.addNode('b');
graph.addNode('c');
graph.addNode('d');

console.log('\n── Adding edges ─────────────────────────────────────────');
graph.addDirectedEdge('a', 'b');
graph.addDirectedEdge('a', 'c');
graph.addDirectedEdge('b', 'd');
graph.addDirectedEdge('c', 'd');

// dropNode('c') causes graphology to:
//   1. fire edgeDropped for a→c  (removes 'c' from a's set)
//   2. fire edgeDropped for c→d  (removes 'd' from c's set)
//   3. fire nodeDropped for 'c'  (deletes adjMap entry; scrubs 'c' from any remaining sets)
console.log('\n── Dropping node "c" ────────────────────────────────────');
graph.dropNode('c');

// ── Final state ──────────────────────────────────────────────────────────────

console.log('\n── Final adjMap ─────────────────────────────────────────');
for (const [node, neighbors] of adjMap) {
  console.log(`  "${node}" → [${[...neighbors].join(', ')}]`);
}

// Expected output:
//   "a" → [b]       (a→c was dropped when 'c' was removed)
//   "b" → [d]
//   "d" → []
