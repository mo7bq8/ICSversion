import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, GitBranch, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const getLifecycleColor = (lifecycle) => {
    switch (lifecycle) {
      case 'Production': return 'bg-green-500';
      case 'Development': return 'bg-blue-500';
      case 'Testing': return 'bg-yellow-500';
      case 'Deprecated': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
};

const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return 'text-green-400';
      case 'Warning': return 'text-yellow-400';
      case 'Critical': return 'text-red-400';
      case 'Development': return 'text-blue-400';
      case 'End of Life': return 'text-gray-400';
      default: return 'text-gray-400';
    }
};

const getCriticalityColor = (criticality) => {
    switch (criticality) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
};

const ApplicationTable = ({ applications, onEdit, onDelete }) => {
  const [viewingApp, setViewingApp] = useState(null);

  return (
    <>
      <Dialog open={!!viewingApp} onOpenChange={() => setViewingApp(null)}>
        {viewingApp && (
          <DialogContent className="glass-effect">
            <DialogHeader>
              <DialogTitle className="text-white">{viewingApp.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-gray-300">
              <p><strong>Version:</strong> {viewingApp.version}</p>
              <p><strong>Owner:</strong> {viewingApp.owner}</p>
              <p><strong>Technology:</strong> {viewingApp.technology}</p>
              <p><strong>Lifecycle:</strong> <Badge className={`${getLifecycleColor(viewingApp.lifecycle)} text-white`}>{viewingApp.lifecycle}</Badge></p>
              <p><strong>Criticality:</strong> <Badge className={`${getCriticalityColor(viewingApp.criticality)} text-white`}>{viewingApp.criticality}</Badge></p>
              <p><strong>Status:</strong> <span className={getStatusColor(viewingApp.status)}>{viewingApp.status}</span></p>
              <div>
                <strong>Dependencies:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {viewingApp.dependencies?.map((dep, idx) => (<Badge key={idx} variant="outline" className="text-xs">{dep}</Badge>))}
                </div>
              </div>
              <div>
                <strong>Dependents:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {viewingApp.dependents?.map((dep, idx) => (<Badge key={idx} variant="secondary" className="text-xs">{dep}</Badge>))}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Applications ({applications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Application</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Lifecycle</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Version</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Owner</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Technology</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Dependencies</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">{app.name}</p>
                        <Badge className={`${getCriticalityColor(app.criticality)} text-white text-xs mt-1`}>
                          {app.criticality}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`${getLifecycleColor(app.lifecycle)} text-white`}>
                        {app.lifecycle}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300">{app.version}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300">{app.owner}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300 text-sm">{app.technology}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={getStatusColor(app.status)}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300 text-sm">{app.dependencies?.length || 0}</span>
                        <GitBranch className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-300 text-sm">{app.dependents?.length || 0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setViewingApp(app)}><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => onEdit(app)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone. This will permanently delete the application.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(app.id)}>Delete</AlertDialogAction>
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
        </CardContent>
      </Card>
    </>
  );
};

export default ApplicationTable;