import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  InputCardNode,
  OpportunityNode,
  StakeholdersNode,
  PitchGuidanceNode,
} from './components/CardNode';
import { getLayoutedElements } from './utils/layout';

const nodeTypes = {
  inputCard: InputCardNode,
  opportunity: OpportunityNode,
  stakeholders: StakeholdersNode,
  pitchGuidance: PitchGuidanceNode,
};

// Define nodes without positions - layout will calculate them
const rawNodes = [
  // Left column - Input cards
  {
    id: 'outlook-card',
    type: 'inputCard',
    data: {
      source: { type: 'outlook', label: 'Outlook' },
      description: 'AIG is under pressure to optimize QA staffing, AIG is under pressure to optimize QA staffingAIG is under pressure to optimize QA staffingAIG is under pressure to optimize QA staffingAIG is under pressure to optimize QA staffing',
      tags: [
        { label: 'PAIN POINT', variant: 'primary' },
        { label: 'SALES', variant: 'secondary' },
      ],
    },
  },
  {
    id: 'urgency-card',
    type: 'inputCard',
    data: {
      title: "What's driving urgency?",
      titleIcon: 'question',
      source: { type: 'powerpoint', label: 'Powerpoint' },
      description: 'AIG has an FY26 mandate to reduce engineering costs by 15%',
      tags: [
        { label: 'STRATEGIC OBJECTIVE', variant: 'primary' },
        { label: 'DELIVERY', variant: 'secondary' },
      ],
    },
  },
  {
    id: 'capability-card',
    type: 'inputCard',
    data: {
      title: 'Matching Cognizant capability',
      titleIcon: 'checkbox',
      source: { type: 'catalog', label: 'Catalog' },
      description: 'Flowsource and QE&A enable automation-led QA optimization',
      tags: [
        { label: 'CAPABILITY', variant: 'primary' },
        { label: 'CATALOG', variant: 'secondary' },
      ],
    },
  },

  // Center - Opportunity card
  {
    id: 'opportunity',
    type: 'opportunity',
    data: {
      title: 'Opportunity',
      description: 'Position Flowsource with QE&A services to reduce QA costs at AIG',
      highlights: ['Flowsource', 'QE&A services'],
    },
  },

  // Right column - Output cards
  {
    id: 'stakeholders',
    type: 'stakeholders',
    data: {
      title: 'Primary stakeholders',
      highlight: 'Reach out to <strong>Scott Hallworth</strong> through <strong>John Moore</strong>',
      people: [
        { name: 'Scott Hallworth', role: 'Executive Vice President & Chief Digital Officer' },
        { name: 'John Moore', role: 'AIG Project Lead' },
      ],
    },
  },
  {
    id: 'pitch-guidance',
    type: 'pitchGuidance',
    data: {
      title: 'Pitch guidance',
      items: [
        "Lead with AIG's cost-reduction mandate",
        'Introduce Flowsource and QE&A as solutions',
        'Anchor on proven ~25% QA savings in other clients',
      ],
      buttons: [
        { label: 'Generate email', icon: 'email' },
        { label: 'Generate briefing', icon: 'document' },
      ],
    },
  },
];

const rawEdges = [
  // Left to Center edges
  {
    id: 'e-outlook-opp',
    source: 'outlook-card',
    target: 'opportunity',
    type: 'smoothstep',
    label: 'LEADS TO',
    labelStyle: { fill: '#10B981', fontWeight: 600, fontSize: 9 },
    labelBgStyle: { fill: '#ECFDF5', fillOpacity: 1 },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 4,
    style: { stroke: '#10B981', strokeWidth: 2 },
  },
  {
    id: 'e-urgency-opp',
    source: 'urgency-card',
    target: 'opportunity',
    type: 'smoothstep',
    style: { stroke: '#10B981', strokeWidth: 2 },
  },
  {
    id: 'e-capability-opp',
    source: 'capability-card',
    target: 'opportunity',
    type: 'smoothstep',
    style: { stroke: '#10B981', strokeWidth: 2 },
  },

  // Center to Right edges
  {
    id: 'e-opp-stakeholders',
    source: 'opportunity',
    target: 'stakeholders',
    type: 'smoothstep',
    label: 'PURSUE VIA',
    labelStyle: { fill: '#10B981', fontWeight: 600, fontSize: 9 },
    labelBgStyle: { fill: '#ECFDF5', fillOpacity: 1 },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 4,
    style: { stroke: '#10B981', strokeWidth: 2 },
  },
  {
    id: 'e-opp-pitch',
    source: 'opportunity',
    target: 'pitch-guidance',
    type: 'smoothstep',
    style: { stroke: '#10B981', strokeWidth: 2 },
  },
];

// Calculate layout once
const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  rawNodes,
  rawEdges,
  'LR'
);

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#FAFAFA' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#10B981', strokeWidth: 2 },
        }}
      >
        <Background color="#E5E7EB" gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
