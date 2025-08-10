import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

const ApplicationDependencyView = ({ applications }) => {
  const [viewingApp, setViewingApp] = useState(null);

  const handleAppClick = (app) => {
    // This is a defensive check. Ensure app is an object before setting state.
    if (app && typeof app === 'object') {
      setViewingApp(app);
    } else {
      console.error("Attempted to view an invalid app:", app);
    }
  };

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
        <CardTitle className="text-white">Application Dependencies & Impact Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`architecture-node cursor-pointer ${app.criticality === 'Critical' ? 'node-critical' : app.status === 'Warning' ? 'node-warning' : 'node-healthy'}`}
              onClick={() => handleAppClick(app)}
            >
              <div className="flex items-start justify-between mb-3">
                <Layers className="h-6 w-6 text-blue-400" />
                <Badge className={`${getLifecycleColor(app.lifecycle)} text-white text-xs`}>
                  {app.lifecycle}
                </Badge>
              </div>
              <h3 className="text-white font-semibold mb-2">{app.name}</h3>
              <p className="text-gray-400 text-sm mb-3">v{app.version} • {app.owner}</p>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Dependencies ({app.dependencies?.length || 0})</p>
                  <div className="flex flex-wrap gap-1">
                    {app.dependencies?.slice(0, 3).map((dep, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{dep}</Badge>
                    ))}
                    {app.dependencies?.length > 3 && <Badge variant="outline" className="text-xs">+{app.dependencies.length - 3}</Badge>}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Dependents ({app.dependents?.length || 0})</p>
                  <div className="flex flex-wrap gap-1">
                    {app.dependents?.slice(0, 3).map((dep, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{dep}</Badge>
                    ))}
                    {app.dependents?.length > 3 && <Badge variant="secondary" className="text-xs">+{app.dependents.length - 3}</Badge>}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-gray-400 text-xs">Impact Score:</span>
                  <span className="text-white text-sm font-medium">{(app.dependencies?.length || 0) + (app.dependents?.length || 0) * 2}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default ApplicationDependencyView;