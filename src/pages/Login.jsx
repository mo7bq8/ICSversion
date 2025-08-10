import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, TestTube2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Login() {
  const { login, ssoLogin, isSsoEnabled, demoLogin } = useAuth();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = login(email, password);
    if (!success) {
      toast({
        title: 'Login Failed',
        description: 'Please check your email and password.',
        variant: 'destructive',
      });
    }
    // No toast on success, as the app will redirect.
    setIsSubmitting(false);
  };

  const handleSsoLogin = () => {
    ssoLogin();
    toast({
        title: 'SSO Login Successful',
        description: 'You have been logged in via SSO.',
    });
  };

  const handleDemoLogin = () => {
    demoLogin();
    toast({
        title: 'Demo Login Successful',
        description: "You're now exploring as a Demo Tester.",
    });
  };

  const loginBgClass = (theme === 'dark' || theme === 'modern')
    ? 'bg-slate-900 bg-grid-white/[0.05]'
    : 'bg-background';
  
  const cardClass = (theme === 'dark' || theme === 'modern')
    ? 'glass-effect'
    : 'bg-card';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${loginBgClass}`}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`w-full max-w-md ${cardClass}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to access your Enterprise Architecture dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign In
              </Button>
            </form>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
            </div>
            
            <div className="space-y-4">
                <Button variant="outline" className="w-full" onClick={handleDemoLogin}>
                    <TestTube2 className="mr-2 h-4 w-4" />
                    Continue as Demo Tester
                </Button>
                {isSsoEnabled && (
                    <Button variant="outline" className="w-full" onClick={handleSsoLogin}>
                        Sign in with SSO
                    </Button>
                )}
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}