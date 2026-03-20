import { UndirectedGraph } from 'graphology';
import random from 'graphology-layout/random';
import louvain from 'graphology-communities-louvain';
import Sigma from 'sigma';

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------
type NodeAttr = {
  label: string;
  size: number;
  x?: number;
  y?: number;
  color?: string;
  community?: number;
};

// ---------------------------------------------------------------------------
// 1. Build the undirected friendship graph
// ---------------------------------------------------------------------------
const graph = new UndirectedGraph<NodeAttr>();

const friends = ['alice', 'bob', 'carol', 'dave', 'eve', 'frank'] as const;

for (const name of friends) {
  graph.addNode(name, { label: name, size: 10 });
}

const friendships: [string, string][] = [
  ['alice', 'bob'],
  ['alice', 'carol'],
  ['bob',   'dave'],
  ['carol', 'dave'],
  ['dave',  'eve'],
  ['eve',   'frank'],
  ['frank', 'alice'],
];

for (const [a, b] of friendships) {
  graph.addEdge(a, b);
}

// ---------------------------------------------------------------------------
// 2. Random initial layout — populates x and y on every node
// ---------------------------------------------------------------------------
random.assign(graph);

// ---------------------------------------------------------------------------
// 3. Louvain community detection — writes 'community' attribute onto every node
// ---------------------------------------------------------------------------
louvain.assign(graph);

// ---------------------------------------------------------------------------
// 4. Assign a colour to each node based on its detected community
// ---------------------------------------------------------------------------
const COMMUNITY_PALETTE: Record<number, string> = {
  0: '#e63946',
  1: '#457b9d',
  2: '#2a9d8f',
};

graph.updateEachNodeAttributes((_: string, attr: NodeAttr) => ({
  ...attr,
  color: COMMUNITY_PALETTE[attr.community ?? -1] ?? '#aaa',
}));

// ---------------------------------------------------------------------------
// 5. Hand the populated graph to a Sigma renderer
// ---------------------------------------------------------------------------
const container = document.getElementById('sigma-container') as HTMLElement;
const renderer = new Sigma(graph, container);
