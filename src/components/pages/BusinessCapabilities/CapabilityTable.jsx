import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, AlertTriangle, Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const CapabilityTable = ({ capabilities, onEdit, onView, onDelete }) => {
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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Capability</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Owner</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Criticality</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Linked Apps</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Compliance</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {capabilities.map((capability, index) => (
            <motion.tr key={capability.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-4 px-4">
                <div>
                  <p className="text-white font-medium">{capability.name}</p>
                  <p className="text-gray-400 text-sm">{capability.description}</p>
                </div>
              </td>
              <td className="py-4 px-4"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-400" /><span className="text-gray-300">{capability.owner}</span></div></td>
              <td className="py-4 px-4"><Badge className={`${getCriticalityColor(capability.criticality)} text-white`}>{capability.criticality}</Badge></td>
              <td className="py-4 px-4"><Badge className={`${getStatusColor(capability.status)} text-white`}>{capability.status}</Badge></td>
              <td className="py-4 px-4">
                <div className="flex flex-wrap gap-1">
                  {capability.linkedApps?.map((app, idx) => (<Badge key={idx} variant="outline" className="text-xs">{app}</Badge>))}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  {capability.compliance === 'Compliant' ? <CheckCircle className="h-4 w-4 text-green-400" /> : capability.compliance === 'Non-Compliant' ? <AlertTriangle className="h-4 w-4 text-red-400" /> : <AlertTriangle className="h-4 w-4 text-yellow-400" />}
                  <span className={getComplianceColor(capability.compliance)}>{capability.compliance}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onView(capability)}><Eye className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => onEdit(capability)}><Edit className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the capability.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(capability.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CapabilityTable;