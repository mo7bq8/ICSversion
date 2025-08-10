import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

const CapabilityViewDialog = ({ capability, isOpen, onOpenChange, onEdit }) => {
  if (!capability) return null;

  const getCriticalityColor = (criticality) => {
    switch (criticality) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Under Review': return 'bg-yellow-500';
      case 'Development': return 'bg-blue-500';
      case 'Deprecated': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getComplianceColor = (compliance) => {
    switch (compliance) {
      case 'Compliant': return 'text-green-400';
      case 'Non-Compliant': return 'text-red-400';
      case 'Under Review': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect">
        <DialogHeader>
          <DialogTitle className="text-white">{capability.name}</DialogTitle>
          <DialogDescription>{capability.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-gray-300 pt-4">
          <p><strong>Owner:</strong> {capability.owner}</p>
          <p><strong>Criticality:</strong> <Badge className={`${getCriticalityColor(capability.criticality)} text-white`}>{capability.criticality}</Badge></p>
          <p><strong>Status:</strong> <Badge className={`${getStatusColor(capability.status)} text-white`}>{capability.status}</Badge></p>
          <p><strong>Compliance:</strong> <span className={getComplianceColor(capability.compliance)}>{capability.compliance}</span></p>
          <div>
            <strong>Linked Apps:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {capability.linkedApps?.map((app, idx) => (<Badge key={idx} variant="outline" className="text-xs">{app}</Badge>))}
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button onClick={() => onEdit(capability)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CapabilityViewDialog;