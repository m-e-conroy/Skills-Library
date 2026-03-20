import { MultiDirectedGraph } from 'graphology';

// 1. Create a MultiDirectedGraph
const graph = new MultiDirectedGraph<
  { name: string; population: number },
  { airline: string; duration: number }
>();

// 2. Add 4 city nodes with name and population attributes
graph.addNode('nyc',    { name: 'New York City', population: 8_336_817 });
graph.addNode('london', { name: 'London',        population: 9_002_488 });
graph.addNode('paris',  { name: 'Paris',         population: 2_161_000 });
graph.addNode('tokyo',  { name: 'Tokyo',         population: 13_960_000 });

// 3. Add airline routes with predictable edge keys
graph.addEdgeWithKey('delta-nyc-london',     'nyc',    'london', { airline: 'Delta',     duration: 420 });
graph.addEdgeWithKey('united-nyc-london',    'nyc',    'london', { airline: 'United',    duration: 435 });
graph.addEdgeWithKey('airfrance-paris-london','paris', 'london', { airline: 'Air France', duration: 80 });
graph.addEdgeWithKey('jal-tokyo-london',     'tokyo',  'london', { airline: 'JAL',       duration: 720 });
graph.addEdgeWithKey('delta-london-paris',   'london', 'paris',  { airline: 'Delta',     duration: 75  });

// 4. List all routes from nyc → london and print their details
console.log('Routes from NYC to London:');
const nycToLondon = graph.edges('nyc', 'london');
for (const edgeKey of nycToLondon) {
  const { airline, duration } = graph.getEdgeAttributes(edgeKey);
  console.log(`  [${edgeKey}] ${airline} — ${duration} min`);
}

// 5. Update the duration of 'delta-nyc-london' to 415
graph.setEdgeAttribute('delta-nyc-london', 'duration', 415);
console.log(
  '\nUpdated delta-nyc-london duration:',
  graph.getEdgeAttribute('delta-nyc-london', 'duration')
);

// 6. Verify the edge exists
console.log('\ngraph.hasEdge("delta-nyc-london"):', graph.hasEdge('delta-nyc-london'));
