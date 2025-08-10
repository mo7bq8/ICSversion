import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle, Info, Plus, Trash2, ShieldCheck, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { format } from 'date-fns';

const severityIcons = {
  Low: <Info className="h-4 w-4 text-blue-400" />,
  Medium: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
  High: <AlertTriangle className="h-4 w-4 text-orange-400" />,
  Critical: <AlertTriangle className="h-4 w-4 text-red-500" />,
};

const statusColors = {
  New: 'bg-blue-500',
  Acknowledged: 'bg-yellow-500',
  Resolved: 'bg-green-500',
  Archived: 'bg-gray-500',
};

const AlertsTab = () => {
  const { alerts, setAlerts } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleAction = (title) => {
    toast({
      title,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const searchMatch = alert.message.toLowerCase().includes(searchTerm.toLowerCase());
      const severityMatch = filterSeverity === 'all' || alert.severity === filterSeverity;
      const statusMatch = filterStatus === 'all' || alert.status === filterStatus;
      return searchMatch && severityMatch && statusMatch;
    });
  }, [alerts, searchTerm, filterSeverity, filterStatus]);

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-white">Create New Alert</CardTitle>
          <CardDescription>Manually create a system-wide alert.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Alert message..." className="flex-grow" />
            <Select>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleAction('Create Alert')}><Plus className="h-4 w-4 mr-2" />Create Alert</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-white">Manage Alerts</CardTitle>
          <CardDescription>View, manage, and filter system alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search alerts..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-4">
                  {severityIcons[alert.severity]}
                  <div>
                    <p className="font-medium text-white">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(alert.timestamp), "PPP p")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={`${statusColors[alert.status]} text-white`}>{alert.status}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleAction('Acknowledge Alert')}><ShieldCheck className="h-4 w-4 mr-2" />Ack</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleAction('Resolve Alert')}><CheckCircle className="h-4 w-4 mr-2" />Resolve</Button>
                  <Button variant="destructive-ghost" size="icon" onClick={() => handleAction('Delete Alert')}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </motion.div>
            ))}
            {filteredAlerts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No alerts match your criteria.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsTab;