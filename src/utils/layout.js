import Dagre from '@dagrejs/dagre';

// Estimate node dimensions based on content
export function estimateNodeDimensions(node) {
  const baseWidth = 300;
  const basePadding = 32;
  let height = basePadding;

  const data = node.data;

  // Source badge height
  if (data.source) {
    height += 30;
  }

  // Title height
  if (data.title) {
    height += 28;
  }

  // Description - estimate based on text length
  if (data.description) {
    const charsPerLine = 40;
    const lines = Math.ceil(data.description.length / charsPerLine);
    height += lines * 22;
  }

  // Highlight box (stakeholders)
  if (data.highlight) {
    height += 60;
  }

  // People list
  if (data.people) {
    height += data.people.length * 45;
  }

  // Items (bullet points)
  if (data.items) {
    data.items.forEach((item) => {
      const charsPerLine = 38;
      const lines = Math.ceil(item.length / charsPerLine);
      height += lines * 22 + 6;
    });
  }

  // Tags
  if (data.tags && data.tags.length > 0) {
    height += 40;
  }

  // Buttons
  if (data.buttons && data.buttons.length > 0) {
    height += 50;
  }

  // Set width based on node type
  let width = baseWidth;
  if (node.type === 'opportunity') {
    width = 260;
  } else if (node.type === 'stakeholders' || node.type === 'pitchGuidance') {
    width = 340;
  }

  return { width, height: Math.max(height, 100) };
}

// Get the layout using dagre
export function getLayoutedElements(nodes, edges, direction = 'LR') {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  g.setGraph({
    rankdir: direction,
    nodesep: 80,    // Vertical spacing between nodes
    ranksep: 120,   // Horizontal spacing between ranks (columns)
    marginx: 50,
    marginy: 50,
  });

  // Add nodes with estimated dimensions
  nodes.forEach((node) => {
    const { width, height } = estimateNodeDimensions(node);
    g.setNode(node.id, { width, height });
  });

  // Add edges
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Run the layout
  Dagre.layout(g);

  // Return nodes with new positions
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    const { width, height } = estimateNodeDimensions(node);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
      // Store measured dimensions for reference
      measured: { width, height },
    };
  });

  return { nodes: layoutedNodes, edges };
}
