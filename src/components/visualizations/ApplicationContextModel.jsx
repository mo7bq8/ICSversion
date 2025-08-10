import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Layers, Building2, HardDrive, User, Globe } from 'lucide-react';
import { VisualNode } from './VisualNode';

const ApplicationContextModel = () => {
  const { applications, capabilities, infrastructure, users } = useData();

  const visualizationData = useMemo(() => {
    const nodes = [];
    const links = [];

    const appLayerY = 250;
    const capabilityLayerY = 50;
    const infraLayerY = 450;
    const userLayerY = 650;

    applications.forEach((app, i) => {
      const appNode = { ...app, id: `app-${app.id}`, x: i * 250 + 50, y: appLayerY, category: 'Application', icon: Layers };
      nodes.push(appNode);

      // Link to capabilities
      const linkedCaps = capabilities.filter(c => c.linkedApps?.includes(app.name));
      linkedCaps.forEach((cap, j) => {
        let capNode = nodes.find(n => n.id === `cap-${cap.id}`);
        if (!capNode) {
          capNode = { ...cap, id: `cap-${cap.id}`, x: (nodes.filter(n=>n.category==='Business Capability').length) * 250 + 50, y: capabilityLayerY, category: 'Business Capability', icon: Building2 };
          nodes.push(capNode);
        }
        links.push({ from: appNode.id, to: capNode.id });
      });

      // Link to infrastructure
      const supportedInfra = infrastructure.filter(inf => inf.supportedCapabilities.some(sc => linkedCaps.map(lc=>lc.id).includes(sc)));
      supportedInfra.forEach((inf, j) => {
        let infraNode = nodes.find(n => n.id === `infra-${inf.id}`);
        if (!infraNode) {
            infraNode = { ...inf, id: `infra-${inf.id}`, x: (nodes.filter(n=>n.category==='Infrastructure').length) * 250 + 50, y: infraLayerY, category: 'Infrastructure', subtext: inf.type, icon: HardDrive };
            nodes.push(infraNode);
        }
        links.push({ from: appNode.id, to: infraNode.id });
      });
      
      // Link to user
      const owner = users.find(u => u.name === app.owner);
      if(owner) {
        let userNode = nodes.find(n => n.id === `user-${owner.id}`);
        if (!userNode) {
            userNode = { ...owner, id: `user-${owner.id}`, x: (nodes.filter(n=>n.category==='User Role').length) * 250 + 50, y: userLayerY, category: 'User Role', icon: User };
            nodes.push(userNode);
        }
        links.push({ from: appNode.id, to: userNode.id });
      }
    });

    return { nodes, links };
  }, [applications, capabilities, infrastructure, users]);

  const getNodeById = (id) => visualizationData.nodes.find(n => n.id === id);

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Application Context Model</CardTitle>
        <CardDescription>Vertical dependency mapping from capabilities down to users.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[800px] rounded-lg bg-slate-900/50 overflow-auto">
          <svg className="absolute inset-0 w-[1500px] h-full">
            {visualizationData.links.map((link, i) => {
              const fromNode = getNodeById(link.from);
              const toNode = getNodeById(link.to);
              if (!fromNode || !toNode) return null;
              
              const fromX = fromNode.x + 90;
              const fromY = fromNode.y + (fromNode.y > toNode.y ? 0 : 50);
              const toX = toNode.x + 90;
              const toY = toNode.y + (toNode.y > fromNode.y ? 50 : 0);

              return (
                <motion.line
                  key={i}
                  x1={fromX} y1={fromY} x2={toX} y2={toY}
                  stroke="#64748b" strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              );
            })}
          </svg>
          <div className="relative w-[1500px] h-full">
            {visualizationData.nodes.map(node => (
              <VisualNode key={node.id} node={node} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationContextModel;