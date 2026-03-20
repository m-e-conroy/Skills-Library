import { MultiDirectedGraph } from 'graphology';

// Typed attribute shapes
type CityAttr = { name: string; population: number };
type RouteAttr = { airline: string; duration: number };

const graph = new MultiDirectedGraph<CityAttr, RouteAttr>();

// 1. Add city nodes
graph.addNode('nyc',    { name: 'New York City', population: 8_336_817 });
graph.addNode('london', { name: 'London',        population: 9_002_488 });
graph.addNode('paris',  { name: 'Paris',         population: 2_161_000 });
graph.addNode('tokyo',  { name: 'Tokyo',         population: 13_960_000 });

// 2. Add airline routes with predictable keys
graph.addEdgeWithKey('delta-nyc-london',     'nyc',    'london', { airline: 'Delta',     duration: 420 });
graph.addEdgeWithKey('united-nyc-london',    'nyc',    'london', { airline: 'United',    duration: 435 });
graph.addEdgeWithKey('airfrance-paris-london','paris', 'london', { airline: 'Air France', duration: 80  });
graph.addEdgeWithKey('jal-tokyo-london',     'tokyo',  'london', { airline: 'JAL',       duration: 720 });
graph.addEdgeWithKey('delta-london-paris',   'london', 'paris',  { airline: 'Delta',     duration: 75  });

// 3. List all routes from nyc → london
console.log('Routes from NYC to London:');
const nycToLondon = graph.edges('nyc', 'london');
for (const edgeKey of nycToLondon) {
  const { airline, duration } = graph.getEdgeAttributes(edgeKey);
  console.log(`  [${edgeKey}] ${airline} — ${duration} min`);
}

// 4. Update duration for 'delta-nyc-london'
graph.setEdgeAttribute('delta-nyc-london', 'duration', 415);
console.log(
  '\nUpdated delta-nyc-london duration:',
  graph.getEdgeAttribute('delta-nyc-london', 'duration'),
  'min'
);

// 5. Verify the edge exists
const exists = graph.hasEdge('delta-nyc-london');
console.log("graph.hasEdge('delta-nyc-london'):", exists);
