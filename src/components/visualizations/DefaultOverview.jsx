import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Layers, Building2, User, Database, AlertTriangle } from 'lucide-react';
import { VisualNode } from './VisualNode';

const DefaultOverview = () => {
  const { applications, capabilities, relations, users } = useData();
  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id);

  const visualizationData = useMemo(() => {
    if (!selectedAppId || applications.length === 0) return { nodes: [], links: [] };

    const centerApp = applications.find(a => a.id === selectedAppId);
    if (!centerApp) return { nodes: [], links: [] };

    const nodes = [];
    const links = [];
    const radius = 250;
    const center = { x: 350, y: 250 };

    nodes.push({ ...centerApp, id: `app-${centerApp.id}`, x: center.x - 100, y: center.y - 25, category: 'Application', icon: Layers });

    const relatedCapabilities = capabilities.filter(c => c.linkedApps?.includes(centerApp.name));
    const relatedUsers = users.filter(u => u.name === centerApp.owner);
    const dependencies = applications.filter(a => centerApp.dependencies?.includes(a.name));
    
    const surroundingNodes = [
      ...relatedCapabilities.map(c => ({...c, id: `cap-${c.id}`, category: 'Business Capability', subtext: c.owner, icon: Building2 })),
      ...relatedUsers.map(u => ({...u, id: `user-${u.id}`, category: 'User Role', subtext: u.role, icon: User})),
      ...dependencies.map(d => ({...d, id: `app-${d.id}`, category: 'Application', subtext: `Dependency`, icon: Layers})),
    ];
    
    if (centerApp.compliance !== 'Compliant') {
        surroundingNodes.push({ id: `risk-${centerApp.id}`, name: 'Compliance Risk', category: 'Risk', subtext: centerApp.compliance, icon: AlertTriangle });
    }

    surroundingNodes.forEach((node, i) => {
        const angle = (i / surroundingNodes.length) * 2 * Math.PI;
        node.x = center.x + radius * Math.cos(angle) - 90;
        node.y = center.y + radius * Math.sin(angle) - 25;
        nodes.push(node);
        links.push({ from: `app-${centerApp.id}`, to: node.id });
    });
    
    return { nodes, links };
  }, [selectedAppId, applications, capabilities, relations, users]);

  const getNodeById = (id) => visualizationData.nodes.find(n => n.id === id);

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Contextual Component Map</CardTitle>
        <CardDescription>Direct neighbors of a selected application.</CardDescription>
        <div className="pt-4">
            <Select onValueChange={(val) => setSelectedAppId(Number(val))} defaultValue={selectedAppId?.toString()}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select an application..." />
              </SelectTrigger>
              <SelectContent>
                {applications.map(app => (
                  <SelectItem key={app.id} value={app.id.toString()}>{app.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[600px] rounded-lg bg-slate-900/50">
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
            </defs>
            {visualizationData.links.map((link, i) => {
              const fromNode = getNodeById(link.from);
              const toNode = getNodeById(link.to);
              if (!fromNode || !toNode) return null;
              
              const fromX = fromNode.x + (fromNode.x > toNode.x ? 0 : 200);
              const fromY = fromNode.y + 25;
              const toX = toNode.x + (toNode.x > fromNode.x ? 180 : 0);
              const toY = toNode.y + 25;

              return (
                <motion.line
                  key={i}
                  x1={fromX} y1={fromY}
                  x2={toX} y2={toY}
                  stroke="#64748b" strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              );
            })}
          </svg>
          {visualizationData.nodes.map(node => (
            <VisualNode key={node.id} node={node} isCentral={node.id.startsWith('app-') && node.id.endsWith(selectedAppId.toString())} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DefaultOverview;