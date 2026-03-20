import MultiDirectedGraph from 'graphology';

const graph = new MultiDirectedGraph();

// Add city nodes
graph.addNode('nyc', { name: 'New York City', population: 8336817 });
graph.addNode('london', { name: 'London', population: 8982000 });
graph.addNode('paris', { name: 'Paris', population: 2161000 });
graph.addNode('tokyo', { name: 'Tokyo', population: 13960000 });

// Add airline routes with predictable IDs
graph.addEdgeWithKey('delta-nyc-london', 'nyc', 'london', { airline: 'Delta', duration: 420 });
graph.addEdgeWithKey('united-nyc-london', 'nyc', 'london', { airline: 'United', duration: 435 });
graph.addEdgeWithKey('airfrance-paris-london', 'paris', 'london', { airline: 'Air France', duration: 80 });
graph.addEdgeWithKey('jal-tokyo-london', 'tokyo', 'london', { airline: 'JAL', duration: 720 });
graph.addEdgeWithKey('delta-london-paris', 'london', 'paris', { airline: 'Delta', duration: 75 });

// List all routes from nyc to london
console.log('Routes from NYC to London:');
const nycToLondonRoutes = graph.edges('nyc', 'london');
nycToLondonRoutes.forEach((edgeKey) => {
  const attrs = graph.getEdgeAttributes(edgeKey);
  console.log(`  [${edgeKey}] Airline: ${attrs.airline}, Duration: ${attrs.duration} min`);
});

// Update duration of delta-nyc-london
graph.setEdgeAttribute('delta-nyc-london', 'duration', 415);
console.log(
  '\nUpdated delta-nyc-london duration:',
  graph.getEdgeAttribute('delta-nyc-london', 'duration'),
  'min'
);

// Verify edge exists
console.log('\ngraph.hasEdge("delta-nyc-london"):', graph.hasEdge('delta-nyc-london'));
