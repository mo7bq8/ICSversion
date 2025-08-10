import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout, Palette, Download, Upload, Settings, Share2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';

const SettingsTab = () => {
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();

    const handleAction = (title) => {
        toast({
            title,
            description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">System Settings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-effect">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2"><Palette className="h-5 w-5" />Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of the application.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-gray-300 text-sm font-medium">Theme</label>
                            <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select theme" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="organization">Organization Identity</SelectItem>
                                    <SelectItem value="modern">Modern</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-gray-300 text-sm font-medium">Default View Mode</label>
                            <Select onValueChange={() => handleAction('Update Default View')}>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select view mode" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="table">Table View</SelectItem>
                                    <SelectItem value="grid">Graph View</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-effect">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2"><Share2 className="h-5 w-5" />Meta-Model Configuration</CardTitle>
                        <CardDescription>Manage entity types, attributes, and relationships.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <Button variant="outline" className="w-full" onClick={() => handleAction('Manage Meta-Model')}>
                            <Settings className="h-4 w-4 mr-2" />
                            Open Meta-Model Editor
                        </Button>
                    </CardContent>
                </Card>
                <Card className="glass-effect lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2"><Download className="h-5 w-5" />Import / Export Configuration</CardTitle>
                        <CardDescription>Manage system configuration and templates.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button variant="outline" onClick={() => handleAction('Upload CSV Template')}><Upload className="h-4 w-4 mr-2" />Import Users (CSV)</Button>
                        <Button variant="outline" onClick={() => handleAction('Download Template')}><Download className="h-4 w-4 mr-2" />Export Users (CSV)</Button>
                         <Button variant="outline" onClick={() => handleAction('Import Config')}>
                            <Upload className="h-4 w-4 mr-2" />Import Config (JSON)
                        </Button>
                         <Button variant="outline" onClick={() => handleAction('Export Config')}>
                            <Download className="h-4 w-4 mr-2" />Export Config (JSON)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsTab;