import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Edit, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CapabilityCard = ({ capability, onEdit, onView, index }) => {
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

  return (
    <motion.div
      key={capability.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`architecture-node ${capability.criticality === 'Critical' ? 'node-critical' : capability.criticality === 'High' ? 'node-warning' : 'node-healthy'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <Building2 className="h-6 w-6 text-blue-400" />
        <Badge className={`${getCriticalityColor(capability.criticality)} text-white text-xs`}>{capability.criticality}</Badge>
      </div>
      <h3 className="text-white font-semibold mb-2">{capability.name}</h3>
      <p className="text-gray-400 text-sm mb-3">{capability.description}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between"><span className="text-gray-400 text-sm">Owner:</span><span className="text-white text-sm">{capability.owner}</span></div>
        <div className="flex items-center justify-between"><span className="text-gray-400 text-sm">Status:</span><Badge className={`${getStatusColor(capability.status)} text-white text-xs`}>{capability.status}</Badge></div>
        <div className="flex items-center justify-between"><span className="text-gray-400 text-sm">Apps:</span><span className="text-white text-sm">{capability.linkedApps?.length || 0}</span></div>
      </div>
      <div className="flex justify-end pt-2 mt-2 border-t border-white/10">
        <Button variant="ghost" size="sm" onClick={() => onEdit(capability)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
        <Button variant="ghost" size="sm" onClick={() => onView(capability)}><Eye className="h-4 w-4 mr-2" />View</Button>
      </div>
    </motion.div>
  );
};

export default CapabilityCard;