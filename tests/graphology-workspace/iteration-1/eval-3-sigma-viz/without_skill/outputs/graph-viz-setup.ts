import { UndirectedGraph } from 'graphology';
import random from 'graphology-layout/random';
import louvain from 'graphology-communities-louvain';
import Sigma from 'sigma';

// ---------------------------------------------------------------------------
// 1. Build the friendship graph
// ---------------------------------------------------------------------------
type NodeAttr = {
  label: string;
  size: number;
  x: number;
  y: number;
  community: number;
  color: string;
};

const graph = new UndirectedGraph<NodeAttr>();

const friends = ['alice', 'bob', 'carol', 'dave', 'eve', 'frank'];

for (const name of friends) {
  graph.addNode(name, { label: name, size: 10, x: 0, y: 0, community: -1, color: '#aaa' });
}

const edges: [string, string][] = [
  ['alice', 'bob'],
  ['alice', 'carol'],
  ['bob',   'dave'],
  ['carol', 'dave'],
  ['dave',  'eve'],
  ['eve',   'frank'],
  ['frank', 'alice'],
];

for (const [a, b] of edges) {
  graph.addEdge(a, b);
}

// ---------------------------------------------------------------------------
// 2. Assign a random initial layout (writes x, y onto every node)
// ---------------------------------------------------------------------------
random.assign(graph);

// ---------------------------------------------------------------------------
// 3. Louvain community detection — writes 'community' attribute onto each node
// ---------------------------------------------------------------------------
louvain.assign(graph);

// ---------------------------------------------------------------------------
// 4. Color nodes by community
// ---------------------------------------------------------------------------
const COMMUNITY_COLORS: Record<number, string> = {
  0: '#e63946',
  1: '#457b9d',
  2: '#2a9d8f',
};

graph.updateEachNodeAttributes((_, attr) => ({
  ...attr,
  color: COMMUNITY_COLORS[attr.community] ?? '#aaa',
}));

// ---------------------------------------------------------------------------
// 5. Hand the graph to a Sigma renderer
//    (container is the DOM element that Sigma will render into)
// ---------------------------------------------------------------------------
const container = document.getElementById('sigma-container') as HTMLElement;
const renderer = new Sigma(graph, container);
