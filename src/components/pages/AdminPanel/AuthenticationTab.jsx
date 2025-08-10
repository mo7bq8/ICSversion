import React, { useState } from 'react';
import { KeyRound, Server, Loader2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AuthenticationTab = () => {
  const { toast } = useToast();
  const { isSsoEnabled, setSsoStatus } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState({
    serverUrl: 'ldaps://ad.yourcompany.com',
    baseDN: 'DC=yourcompany,DC=com',
  });

  const handleConnect = () => {
    setIsConnecting(true);
    toast({
      title: 'Connecting to Active Directory...',
      description: 'Attempting to establish a secure connection.',
    });

    setTimeout(() => {
      setIsConnecting(false);
      const success = Math.random() > 0.3; // Simulate success/failure
      if (success) {
        setSsoStatus(true);
        toast({
          title: 'Connection Successful!',
          description: 'Active Directory SSO is now enabled.',
          className: 'bg-green-500 text-white',
        });
      } else {
        setSsoStatus(false);
        toast({
          title: 'Connection Failed',
          description: 'Could not connect to the server. Please check your details.',
          variant: 'destructive',
        });
      }
    }, 2000);
  };
  
  const handleAction = (title) => {
    toast({
      title,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Authentication & SSO</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Server className="h-5 w-5" />Active Directory Integration</CardTitle>
            <CardDescription>Connect to your on-premise AD for Single Sign-On (SSO).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="sso-mode" className="text-base font-medium text-white">Enable SSO</Label>
                <p className="text-sm text-muted-foreground">
                  {isSsoEnabled ? 'Users will be redirected to SSO login.' : 'SSO is currently disabled.'}
                </p>
              </div>
              <Switch id="sso-mode" checked={isSsoEnabled} onCheckedChange={setSsoStatus} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-url" className="text-gray-300">Server URL</Label>
              <Input id="server-url" placeholder="ldaps://ad.yourcompany.com" value={connectionDetails.serverUrl} onChange={(e) => setConnectionDetails({...connectionDetails, serverUrl: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="base-dn" className="text-gray-300">Base DN</Label>
              <Input id="base-dn" placeholder="DC=yourcompany,DC=com" value={connectionDetails.baseDN} onChange={(e) => setConnectionDetails({...connectionDetails, baseDN: e.target.value})} />
            </div>
            <Button onClick={handleConnect} disabled={isConnecting} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Test & Save Connection'
              )}
            </Button>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2"><KeyRound className="h-5 w-5" />Other Identity Providers</CardTitle>
                <CardDescription>Configure other SSO providers like Okta or Azure AD.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAction('Configure Okta')}>
                      <img  alt="Okta logo" class="h-5 w-5" src="https://images.unsplash.com/photo-1658204212985-e0126040f88f" /> Configure Okta
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAction('Configure Azure AD')}>
                      <img  alt="Azure AD logo" class="h-5 w-5" src="https://images.unsplash.com/photo-1689019764322-2f4d41817f60" /> Configure Azure AD
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAction('Configure Google Workspace')}>
                      <img  alt="Google logo" class="h-5 w-5" src="https://images.unsplash.com/photo-1678483789111-3a04c4628bd6" /> Configure Google Workspace
                  </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle className="text-white">Multi-Factor Authentication (MFA)</CardTitle>
                    <CardDescription>Enhance security by requiring a second factor of authentication.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={() => handleAction('Configure MFA')}>
                        <Plus className="h-4 w-4 mr-2" /> Configure MFA
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationTab;