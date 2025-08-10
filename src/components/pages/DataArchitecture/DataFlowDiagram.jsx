import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Workflow, GitBranch, Eye } from 'lucide-react';

const DataFlowDiagram = ({ dataFlows }) => {
  const { toast } = useToast();
  const safeDataFlows = dataFlows || [];
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Workflow className="h-5 w-5" />Data Flow Diagram</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {safeDataFlows.map((flow, index) => (
          <motion.div key={flow.id || index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center justify-between p-3 rounded-lg bg-accent">
            <Badge variant="outline">{flow.from}</Badge>
            <div className="flex flex-col items-center">
              <GitBranch className="h-5 w-5 text-primary" />
              <span className="text-xs text-primary">{flow.type} ({flow.protocol})</span>
              {flow.pii && <Badge className="bg-red-500/80 text-white text-xs mt-1">PII Data</Badge>}
            </div>
            <Badge variant="outline">{flow.to}</Badge>
            <Button size="sm" variant="ghost" onClick={() => toast({title: "View Data Flow", description: `This feature is not yet implemented. You can request it! 🚀`})}><Eye className="h-4 w-4" /></Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DataFlowDiagram;