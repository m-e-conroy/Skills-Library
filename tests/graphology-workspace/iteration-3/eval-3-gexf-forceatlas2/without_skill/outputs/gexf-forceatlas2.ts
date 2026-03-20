import { UndirectedGraph } from 'graphology';
import { write, parse } from 'graphology-gexf';
import random from 'graphology-layout/random';
import forceAtlas2 from 'graphology-layout-forceatlas2';

// 1. Build an UndirectedGraph with 5 nodes and 6 edges
const graph = new UndirectedGraph();

const nodeData: Record<string, { label: string; weight: number }> = {
  a: { label: 'Node A', weight: 1.0 },
  b: { label: 'Node B', weight: 2.0 },
  c: { label: 'Node C', weight: 1.5 },
  d: { label: 'Node D', weight: 3.0 },
  e: { label: 'Node E', weight: 0.8 },
};

for (const [id, attrs] of Object.entries(nodeData)) {
  graph.addNode(id, attrs);
}

graph.addEdge('a', 'b');
graph.addEdge('b', 'c');
graph.addEdge('c', 'd');
graph.addEdge('d', 'e');
graph.addEdge('e', 'a');
graph.addEdge('a', 'c');

// 2. Serialize the graph to a GEXF string
const gexfString = write(graph);
console.log('--- GEXF Output ---');
console.log(gexfString);

// 3. Parse the GEXF string back into a new graph instance
const parsedGraph = parse(UndirectedGraph, gexfString);
console.log('--- Round-trip Confirmation ---');
console.log('Parsed graph node count:', parsedGraph.order);

// 4. Run random layout to assign initial x, y positions
random.assign(parsedGraph);

// Use forceAtlas2.inferSettings for sensible defaults, then call the raw function
const inferredSettings = forceAtlas2.inferSettings(parsedGraph);
const positions = forceAtlas2(parsedGraph, {
  iterations: 50,
  settings: inferredSettings,
});

// Apply the returned positions back onto the graph in-place
parsedGraph.updateEachNodeAttributes((node, attr) => ({
  ...attr,
  x: positions[node].x,
  y: positions[node].y,
}));

// 5. Log each node's final x and y positions
console.log('\n--- ForceAtlas2 Node Positions (50 iterations) ---');
parsedGraph.forEachNode((node, attrs) => {
  const x = (attrs as any).x as number;
  const y = (attrs as any).y as number;
  console.log(`  ${node}: x=${x.toFixed(6)}, y=${y.toFixed(6)}`);
});

// 6. Make a structural copy using emptyCopy() — same graph options, no nodes/edges
const structuralCopy = parsedGraph.emptyCopy();
console.log('\n--- emptyCopy() of parsed graph ---');
console.log('Node count:', structuralCopy.order);
console.log('Edge count:', structuralCopy.size);
