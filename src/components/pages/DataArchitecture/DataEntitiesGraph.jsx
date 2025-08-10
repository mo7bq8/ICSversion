import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Share2 } from 'lucide-react';

const DataEntitiesGraph = ({ dataEntities, entityRelationships, selectedEntity, setSelectedEntity }) => {
  const { toast } = useToast();
  
  const handleEntityClick = (entity) => {
    setSelectedEntity(entity.id);
    toast({
      title: `Entity Selected: ${entity.name}`,
      description: "Check linked Applications and Technologies in their respective modules.",
    });
  };

  const safeDataEntities = dataEntities || [];
  const safeEntityRelationships = entityRelationships || [];

  return (
    <Card className="h-[450px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Data Entities Graph
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[350px]">
          <svg className="w-full h-full">
            {safeEntityRelationships.map((rel, index) => {
              const fromNode = safeDataEntities.find(e => e.id === rel.from);
              const toNode = safeDataEntities.find(e => e.id === rel.to);
              if (!fromNode || !toNode) return null;
              const x1 = fromNode.position.x + 60;
              const y1 = fromNode.position.y + 20;
              const x2 = toNode.position.x + 60;
              const y2 = toNode.position.y + 20;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;
              return (
                <g key={index}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-border" strokeWidth="2" />
                  <text x={midX} y={midY - 5} fill="hsl(var(--foreground))" fontSize="10" textAnchor="middle">{rel.label}</text>
                </g>
              );
            })}
          </svg>
          {safeDataEntities.map(entity => (
            <motion.div
              key={entity.id}
              className={`absolute p-2 rounded-lg cursor-pointer border-2 transition-all ${selectedEntity === entity.id ? 'border-primary scale-110' : 'border-transparent'}`}
              style={{ top: entity.position.y, left: entity.position.x, background: 'hsl(var(--card))' }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              onClick={() => handleEntityClick(entity)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${entity.color}`}></div>
                <p className="font-semibold text-sm">{entity.name}</p>
              </div>
              <p className="text-muted-foreground text-xs">{entity.domain}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataEntitiesGraph;