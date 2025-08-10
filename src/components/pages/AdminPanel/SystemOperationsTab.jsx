import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw, AlertTriangle, Activity, BarChart2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SystemOperationsTab = () => {
    const { toast } = useToast();

    const handleAction = (title) => {
        toast({
            title,
            description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        });
    };

    const systemMetrics = [
        { name: 'API Health', value: 'Healthy', status: 'ok' },
        { name: 'Database Connection', value: 'Connected', status: 'ok' },
        { name: 'Last Backup', value: '2025-07-31 02:00 UTC', status: 'info' },
        { name: 'Active Users', value: '42', status: 'info' },
    ];

    const getStatusColor = (status) => {
        switch(status) {
            case 'ok': return 'text-green-400';
            case 'warning': return 'text-yellow-400';
            case 'error': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">System Operations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-effect">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2"><Activity className="h-5 w-5" />Live System Metrics</CardTitle>
                        <CardDescription>Real-time status of system components.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                       {systemMetrics.map(metric => (
                           <div key={metric.name} className="flex justify-between items-center text-sm">
                               <span className="text-muted-foreground">{metric.name}</span>
                               <span className={`font-medium ${getStatusColor(metric.status)}`}>{metric.value}</span>
                           </div>
                       ))}
                       <Button variant="secondary" className="w-full mt-4" onClick={() => handleAction('View Full Metrics')}>
                            <BarChart2 className="h-4 w-4 mr-2" /> View Full Metrics Dashboard
                       </Button>
                    </CardContent>
                </Card>

                <Card className="glass-effect">
                    <CardHeader>
                        <CardTitle className="text-white">System Actions</CardTitle>
                        <CardDescription>Perform critical system-level operations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full" onClick={() => handleAction('Backup Database')}>
                            <Database className="h-4 w-4 mr-2" /> Trigger Full Backup
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => handleAction('Clear Cache')}>
                            <RefreshCw className="h-4 w-4 mr-2" /> Clear System Cache
                        </Button>
                        <Button variant="destructive" className="w-full" onClick={() => handleAction('Restart System')}>
                            <AlertTriangle className="h-4 w-4 mr-2" /> Restart Application Server
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SystemOperationsTab;