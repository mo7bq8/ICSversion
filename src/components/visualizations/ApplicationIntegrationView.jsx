import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3-shape';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Layers } from 'lucide-react';
import { VisualNode } from './VisualNode';

const ApplicationIntegrationView = () => {
  const { applications } = useData();

  const visualizationData = useMemo(() => {
    if (!applications || applications.length === 0) return { nodes: [], links: [] };
    
    const nodes = applications.map((app, i) => ({
      ...app,
      id: `app-${app.id}`,
      x: (i % 4) * 250 + 50,
      y: Math.floor(i / 4) * 200 + 50,
      category: 'Application',
      icon: Layers
    }));
    
    const links = [];
    applications.forEach(app => {
        app.dependencies?.forEach(depName => {
            const targetApp = applications.find(a => a.name === depName);
            if(targetApp) {
                links.push({ from: `app-${app.id}`, to: `app-${targetApp.id}` });
            }
        });
    });

    return { nodes, links };
  }, [applications]);

  const getNodeById = (id) => visualizationData.nodes.find(n => n.id === id);

  if (!applications || applications.length === 0) {
    return (
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Application Integration Map</CardTitle>
          <CardDescription>No application data available to display.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Application Integration Map</CardTitle>
        <CardDescription>All inbound and outbound connections across applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[600px] rounded-lg bg-background/50 overflow-auto">
          <svg className="absolute inset-0 w-[1200px] h-[800px]">
            <defs>
              <marker id="integ-arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
              </marker>
            </defs>
            {visualizationData.links.map((link, i) => {
              const fromNode = getNodeById(link.from);
              const toNode = getNodeById(link.to);
              if (!fromNode || !toNode) return null;
              
              const source = { x: fromNode.x + 90, y: fromNode.y + 25 };
              const target = { x: toNode.x + 90, y: toNode.y + 25 };

              const linkGenerator = d3.linkVertical()({ source: [source.x, source.y], target: [target.x, target.y] });

              return (
                <motion.path
                  key={i}
                  d={linkGenerator}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  markerEnd="url(#integ-arrowhead)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              );
            })}
          </svg>
          <div className="relative w-[1200px] h-[800px]">
            {visualizationData.nodes.map(node => (
              <VisualNode key={node.id} node={node} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationIntegrationView;