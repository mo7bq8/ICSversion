import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layers } from 'lucide-react';
import { BlockNode } from './VisualNode';

const BlockDiagram = () => {
  const { applications, networkInterfaces } = useData();
  const [simulationMode, setSimulationMode] = useState(false);
  const [removedIntegrationId, setRemovedIntegrationId] = useState(null);

  const appToAppIntegrations = useMemo(() => {
    if (!applications) return [];
    const integrations = [];
    applications.forEach(sourceApp => {
      sourceApp.dependencies?.forEach(depName => {
        const targetApp = applications.find(a => a.name === depName);
        if (targetApp) {
          const protocol = (networkInterfaces || []).find(ni => ni.name.includes(targetApp.name.split(" ")[0]))?.protocol || 'HTTP';
          integrations.push({
            id: `int-${sourceApp.id}-${targetApp.id}`,
            from: `app-${sourceApp.id}`,
            to: `app-${targetApp.id}`,
            protocol,
          });
        }
      });
    });
    return integrations;
  }, [applications, networkInterfaces]);

  const visualizationData = useMemo(() => {
    if (!applications) return { nodes: [], links: [] };
    const nodes = applications.map((app, i) => ({
      ...app,
      id: `app-${app.id}`,
      x: 100,
      y: i * 150 + 50,
      category: 'Application',
      icon: Layers,
      subtext: app.technology,
    }));
    
    const columns = [[], [], []];
    nodes.forEach((node, i) => columns[i % 3].push(node));
    
    let yOffset = 0;
    columns.forEach((col, colIndex) => {
        yOffset = 0;
        col.forEach(node => {
            node.x = colIndex * 300 + 50;
            node.y = yOffset * 150 + 50;
            yOffset++;
        })
    });
    
    const links = appToAppIntegrations;

    return { nodes, links };
  }, [applications, appToAppIntegrations]);

  const getNodeById = (id) => visualizationData.nodes.find(n => n.id === id);

  if (!applications || applications.length === 0) {
    return (
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Interactive Block Diagram</CardTitle>
          <CardDescription>No application data available to display.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isSimulatedOut = (nodeId) => {
    if (!simulationMode || !removedIntegrationId) return false;
    const removedLink = appToAppIntegrations.find(l => l.id === removedIntegrationId);
    if (!removedLink) return false;
    return nodeId === removedLink.to;
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Interactive Block Diagram</CardTitle>
        <CardDescription>Structured application flow with what-if simulation.</CardDescription>
        <div className="flex items-center space-x-4 pt-4">
          <div className="flex items-center space-x-2">
            <Switch id="simulation-mode" checked={simulationMode} onCheckedChange={setSimulationMode} />
            <Label htmlFor="simulation-mode">What-if Simulation</Label>
          </div>
          {simulationMode && (
            <Select onValueChange={setRemovedIntegrationId}>
              <SelectTrigger className="w-[350px]">
                <SelectValue placeholder="Select an integration to remove..." />
              </SelectTrigger>
              <SelectContent>
                {appToAppIntegrations.map(l => {
                  const from = getNodeById(l.from);
                  const to = getNodeById(l.to);
                  if(!from || !to) return null;
                  return <SelectItem key={l.id} value={l.id}>{from.name} → {to.name}</SelectItem>
                })}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[600px] rounded-lg bg-background/50 overflow-auto">
          <svg className="absolute inset-0 w-[1000px] h-[800px]">
            {visualizationData.links.map((link, i) => {
              const fromNode = getNodeById(link.from);
              const toNode = getNodeById(link.to);
              if (!fromNode || !toNode) return null;

              const isRemoved = simulationMode && link.id === removedIntegrationId;
              
              return (
                <motion.g key={i} animate={{ opacity: isRemoved ? 0.2 : 1 }}>
                  <motion.line
                    x1={fromNode.x + 192} y1={fromNode.y + 56}
                    x2={toNode.x} y2={toNode.y + 56}
                    stroke={isRemoved ? "#475569" : "#a78bfa"}
                    strokeWidth="2"
                    strokeDasharray={isRemoved ? "5 5" : "none"}
                  />
                  <text x={(fromNode.x + 192 + toNode.x)/2} y={toNode.y + 50} fill="white" fontSize="12" textAnchor="middle">{link.protocol}</text>
                </motion.g>
              );
            })}
          </svg>
          <div className="relative w-[1000px] h-[800px]">
            {visualizationData.nodes.map(node => (
              <div key={node.id} className="absolute" style={{left: node.x, top: node.y}}>
                <BlockNode node={node} isSimulatedOut={isSimulatedOut(node.id)} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockDiagram;