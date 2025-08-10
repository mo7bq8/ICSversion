import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitBranch, Server, Settings, FileUp, FileDown, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ConnectorCard = ({ title, icon, description, onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const Icon = icon;

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      onConnect();
    }, 1500);
  };
  
  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Icon className="h-6 w-6" /> {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
            <Label>API Endpoint</Label>
            <Input placeholder="https://api.service.com" />
        </div>
        <div className="space-y-2 mt-4">
            <Label>API Key</Label>
            <Input type="password" placeholder="••••••••••••••••••••" />
        </div>
        <Button onClick={handleConnect} disabled={isConnecting} className="w-full mt-6">
          {isConnecting ? <Loader2 className="animate-spin mr-2" /> : <GitBranch className="mr-2 h-4 w-4" />}
          {isConnecting ? 'Connecting...' : 'Connect & Sync'}
        </Button>
      </CardContent>
    </Card>
  );
};

const Integrations = () => {
    const { toast } = useToast();

    const handleConnect = (service) => {
        toast({
            title: `Connecting to ${service}...`,
            description: "This feature is for demonstration. No real connection will be made.",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Integration Connectors</h1>
                <p className="text-gray-400 mt-2">Connect to external systems for real-time data synchronization.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ConnectorCard title="ServiceNow" icon={Server} description="Sync with your CMDB for infrastructure and application data." onConnect={() => handleConnect('ServiceNow')} />
                <ConnectorCard title="Jira" icon={Settings} description="Link architectural components to project tasks and epics." onConnect={() => handleConnect('Jira')} />
                <ConnectorCard title="Azure" icon={Server} description="Sync with Azure for cloud resource management." onConnect={() => handleConnect('Azure')} />
                <ConnectorCard title="AWS" icon={Server} description="Sync with AWS for cloud resource management." onConnect={() => handleConnect('AWS')} />
                <ConnectorCard title="Google Cloud" icon={Server} description="Sync with GCP for cloud resource management." onConnect={() => handleConnect('Google Cloud')} />
                <ConnectorCard title="GitHub / GitLab" icon={GitBranch} description="Integrate with your source code repositories." onConnect={() => handleConnect('Git')} />
            </div>

            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle className="text-white">Manual Import / Export</CardTitle>
                    <CardDescription>Use CSV, JSON, or REST APIs for bulk data management.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Button variant="outline" onClick={() => toast({title: "Feature not implemented yet. 🚀"})}><FileUp className="mr-2 h-4 w-4"/> Import from File</Button>
                    <Button variant="outline" onClick={() => toast({title: "Feature not implemented yet. 🚀"})}><FileDown className="mr-2 h-4 w-4"/> Export to File</Button>
                    <Button variant="outline" onClick={() => toast({title: "Feature not implemented yet. 🚀"})}><Settings className="mr-2 h-4 w-4"/> Configure REST API</Button>
                </CardContent>
            </Card>

        </div>
    );
};

export default Integrations;