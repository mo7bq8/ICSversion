import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Calendar, Download, FileType } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ReportingTab = () => {
    const { toast } = useToast();

    const handleAction = (title) => {
        toast({
            title,
            description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        });
    };

    const predefinedReports = [
        { name: 'Application Health Check', description: 'Summary of application lifecycle, criticality, and health status.' },
        { name: 'Technology Risk Assessment', description: 'Analysis of technology assets nearing end-of-life.' },
        { name: 'Security Compliance Overview', description: 'Status of all security controls against frameworks.' },
        { name: 'System Usage Metrics', description: 'Report on user activity and module usage.' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Reporting & Exports</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-effect">
                    <CardHeader>
                        <CardTitle className="text-white">Predefined Reports</CardTitle>
                        <CardDescription>Download standardized reports for common use cases.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {predefinedReports.map(report => (
                            <div key={report.name} className="flex items-center justify-between p-3 rounded-lg bg-card/50">
                                <div>
                                    <p className="font-medium text-white">{report.name}</p>
                                    <p className="text-sm text-muted-foreground">{report.description}</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => handleAction(`Download ${report.name}`)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="glass-effect">
                        <CardHeader>
                            <CardTitle className="text-white">Custom Reports</CardTitle>
                            <CardDescription>Build and schedule your own reports.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <Button className="w-full" onClick={() => handleAction('Create Custom Report')}>
                                <Plus className="h-4 w-4 mr-2" />
                                New Report Template
                            </Button>
                             <Button variant="secondary" className="w-full" onClick={() => handleAction('Schedule Reports')}>
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Reports
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="glass-effect">
                        <CardHeader>
                            <CardTitle className="text-white">Bulk Export</CardTitle>
                            <CardDescription>Export the entire EA repository.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                             <Button variant="outline" className="flex-1" onClick={() => handleAction('Export to JSON')}>
                                <FileType className="h-4 w-4 mr-2" />
                                Export as JSON
                            </Button>
                             <Button variant="outline" className="flex-1" onClick={() => handleAction('Export to CSV')}>
                                <FileType className="h-4 w-4 mr-2" />
                                Export as CSV
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReportingTab;