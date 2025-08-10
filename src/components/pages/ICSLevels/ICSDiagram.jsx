import React, { useMemo, useCallback, Fragment } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  Panel,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import {
  Zap, Settings, Monitor, Cpu, Database, Shield, Server, Globe, Wifi, Router, HardDrive, Network, AlertCircle, HelpCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const levelConfig = {
  unclassified: { name: 'Unclassified', color: 'bg-gray-500/20 border-gray-500', y: -50 },
  4: { name: 'Level 4: Cloud', color: 'bg-orange-500/20 border-orange-500', y: 150 },
  3.5: { name: 'Level 3.5: DMZ', color: 'bg-yellow-500/20 border-yellow-500', y: 400 },
  3: { name: 'Level 3: Operations', color: 'bg-green-500/20 border-green-500', y: 650 },
  '0-2': { name: 'Level 0-2: Control', color: 'bg-blue-500/20 border-blue-500', y: 900 },
};

const getLevelKey = (level) => {
    if (level === null || level === undefined) return 'unclassified';
    if (level >= 0 && level <= 2) return '0-2';
    if (level === 3) return '3';
    if (level === 3.5) return '3.5';
    if (level >= 4) return '4';
    return 'unclassified';
};

const iconMap = {
  'sensor': Zap,
  'plc': Settings,
  'rtu': Settings,
  'hmi': Monitor,
  'scada': Monitor,
  'server': Server,
  'historian': Database,
  'workstation': Cpu,
  'engineering workstation': Cpu,
  'firewall': Shield,
  'switch': Network,
  'router': Router,
  'cloud service': Globe,
  'wireless': Wifi,
  'storage': HardDrive,
  'application': Cpu,
  'technology': Settings,
  'infrastructure': Server,
  'security': Shield,
  'network': Network,
  'data': Database,
  'loadbalancer': Network,
  'default': HelpCircle
};

const CustomNode = ({ data }) => {
  const Icon = iconMap[data.role?.toLowerCase()] || iconMap[data.type?.toLowerCase()] || iconMap[data.source_type?.toLowerCase()] || iconMap['default'];
  const isHighlighted = data.isHighlighted;
  const isUnclassified = data.ics_level === null || data.ics_level === undefined;

  return (
    <motion.div 
      className={cn(
        `p-3 rounded-lg shadow-lg border-2 w-48`, 
        isHighlighted && 'bg-primary/30 border-primary scale-105',
        !isHighlighted && 'bg-card border-border',
        isUnclassified && 'border-dashed border-yellow-500'
       )}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center gap-2 mb-2">
        {isUnclassified ? <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" /> : <Icon className="h-5 w-5 text-primary shrink-0" />}
        <div className="font-bold text-sm truncate" title={data.label}>{data.label}</div>
      </div>
      <div className="text-xs text-muted-foreground truncate" title={data.role}>{data.role}</div>
      {data.domain && (
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="secondary" className="truncate" title={data.domain}>{data.domain}</Badge>
        </div>
      )}
    </motion.div>
  );
};

const nodeTypes = { custom: CustomNode };

const ICSDiagram = ({ nodes: components = [], edges: initialEdges = [], onNodeClick, pathTraceNodes, diagramRef, showUnclassified, bandCounts }) => {

  const { getPath } = useReactFlow();

  const { nodes, edges } = useMemo(() => {
    if (!components) return { nodes: [], edges: [] };
    
    const levelCounts = {};
    const zoneCounts = {};

    const computedNodes = components.map(component => {
      const levelKey = getLevelKey(component.ics_level);
      const zone = component.zone || 'default';
      
      const levelY = levelConfig[levelKey].y;
      
      if (!zoneCounts[levelKey]) zoneCounts[levelKey] = { list: [], map: {} };
      if (!zoneCounts[levelKey].map[zone]) {
        zoneCounts[levelKey].map[zone] = true;
        zoneCounts[levelKey].list.push(zone);
      }
      
      const zoneIndex = zoneCounts[levelKey].list.indexOf(zone);
      const zoneXOffset = zoneIndex * 1200;

      if (!levelCounts[levelKey]) levelCounts[levelKey] = {};
      if (!levelCounts[levelKey][zone]) levelCounts[levelKey][zone] = 0;
      
      const position = {
        x: (levelCounts[levelKey][zone] % 5) * 220 + 50 + zoneXOffset,
        y: levelY + Math.floor(levelCounts[levelKey][zone] / 5) * 150,
      };
      levelCounts[levelKey][zone]++;

      let isHighlighted = false;
      if (pathTraceNodes.length === 2 && getPath) {
        const path = getPath(pathTraceNodes[0], pathTraceNodes[1]);
        if (path && path.some(p => p.id === component.id)) {
          isHighlighted = true;
        }
      } else if (pathTraceNodes.length === 1 && pathTraceNodes[0] === component.id) {
          isHighlighted = true;
      }

      return {
        id: component.id.toString(),
        type: 'custom',
        position,
        data: { 
          label: component.name,
          ...component,
          isHighlighted,
        },
      };
    });

    const computedEdges = initialEdges.map(edge => ({
      ...edge,
      id: `${edge.from_id}-to-${edge.to_id}`,
      source: edge.from_id,
      target: edge.to_id,
      animated: true,
      style: {
        stroke: '#888',
        strokeWidth: 1.5,
        strokeDasharray: edge.link_type === 'secondary' ? '5 5' : undefined,
      },
    }));

    return { nodes: computedNodes, edges: computedEdges };

  }, [components, initialEdges, pathTraceNodes, getPath]);

  const onNodeClickHandler = useCallback((event, node) => {
    const component = components.find(c => c.id.toString() === node.id);
    if (component) {
      onNodeClick(component);
    }
  }, [components, onNodeClick]);
  
  const levelKeysInOrder = ['4', '3.5', '3', '0-2'];
  if (showUnclassified) {
    levelKeysInOrder.unshift('unclassified');
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border relative" ref={diagramRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClickHandler}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        <Panel position="top-left" className="p-0 m-2 space-y-2 pointer-events-none">
          {levelKeysInOrder.map((levelKey) => {
            const config = levelConfig[levelKey];
            const count = bandCounts[levelKey];
            if(count === 0 && levelKey !== 'unclassified') return null;

            return (
              <div key={levelKey} className={`px-3 py-1 rounded-md text-sm font-semibold text-white ${config.color.split(' ')[0].replace('/20', '')}`}>
                {config.name} ({count})
              </div>
            );
          })}
        </Panel>
      </ReactFlow>
    </div>
  );
};

const ICSDiagramWrapper = (props) => {
  return (
    <ReactFlowProvider>
      <ICSDiagram {...props} />
    </ReactFlowProvider>
  );
};

export default ICSDiagramWrapper;
