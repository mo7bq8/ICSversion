import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Globe } from 'lucide-react';

const InterfaceCircleMap = ({ interfaces }) => {
  const clusters = useMemo(() => {
    if (!interfaces) return [];
    const grouped = interfaces.reduce((acc, item) => {
      if(item.cluster) {
        acc[item.cluster] = acc[item.cluster] || [];
        acc[item.cluster].push(item);
      }
      return acc;
    }, {});
    return Object.entries(grouped);
  }, [interfaces]);

  const radius = 200;
  const center = { x: 250, y: 250 };

  return (
    <Card>
      <CardHeader><CardTitle>Interface Circle Map</CardTitle></CardHeader>
      <CardContent className="h-[550px] flex items-center justify-center">
        <div className="relative w-[500px] h-[500px]">
          <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
            <Globe className="w-16 h-16 text-primary" />
            <p className="font-bold text-lg mt-2">Network Core</p>
          </motion.div>
          {clusters.map(([clusterName, items], i) => {
            const angle = (i / clusters.length) * 2 * Math.PI;
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            return (
              <motion.div
                key={clusterName}
                className="absolute"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, x: x - 50, y: y - 50 }}
                transition={{ delay: i * 0.2, type: 'spring' }}
              >
                <div className="w-24 h-24 rounded-full bg-accent border-2 border-primary flex flex-col items-center justify-center text-center p-2">
                  <p className="font-bold text-sm">{clusterName}</p>
                  <p className="text-primary text-xs">{items.length} APIs</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const DataFlowVisualizer = ({ flows }) => {
    const nodes = useMemo(() => {
        if (!flows) return [];
        const allNodeNames = new Set();
        flows.forEach(flow => {
            if (flow.from) allNodeNames.add(flow.from.split(':')[0]);
            if (flow.to) allNodeNames.add(flow.to.split(':')[0]);
        });
        return Array.from(allNodeNames).map((name, i) => ({
            id: name,
            name,
            x: (i % 4) * 200 + 50,
            y: Math.floor(i / 4) * 150 + 50,
        }));
    }, [flows]);

    const findNode = (name) => {
        if (typeof name !== 'string') return null;
        return nodes.find(n => n.id === name.split(':')[0]);
    };

    return (
        <Card>
            <CardHeader><CardTitle>Data Flow Visualizer</CardTitle></CardHeader>
            <CardContent className="h-[550px] relative">
                <svg className="w-full h-full absolute top-0 left-0">
                    <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" />
                        </marker>
                    </defs>
                    {flows && flows.map((flow, i) => {
                        const sourceNode = findNode(flow.from);
                        const targetNode = findNode(flow.to);
                        if (!sourceNode || !targetNode) return null;
                        return (
                            <motion.g key={i}>
                                <motion.line
                                    x1={sourceNode.x + 50} y1={sourceNode.y + 25}
                                    x2={targetNode.x + 50} y2={targetNode.y + 25}
                                    stroke="hsl(var(--primary))" strokeWidth="2"
                                    markerEnd="url(#arrow)"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, delay: i * 0.2 }}
                                />
                                <text x={(sourceNode.x + targetNode.x) / 2} y={(sourceNode.y + targetNode.y) / 2} fill="hsl(var(--foreground))" fontSize="10">{flow.type}</text>
                            </motion.g>
                        );
                    })}
                </svg>
                {nodes.map(node => (
                    <motion.div
                        key={node.id}
                        className="absolute w-24 h-12 bg-card rounded-lg flex items-center justify-center p-2 border border-primary"
                        style={{ left: node.x, top: node.y }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="text-center text-xs font-bold">{node.name}</p>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
};

const VisualizationsTab = ({ networkInterfaces, dataFlows }) => {
  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InterfaceCircleMap interfaces={networkInterfaces} />
      <DataFlowVisualizer flows={dataFlows} />
    </div>
  );
};

export default VisualizationsTab;