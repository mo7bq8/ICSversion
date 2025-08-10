import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';
import { AreaChart, AlertTriangle, DollarSign, ShieldCheck, Clock } from 'lucide-react';

const ExecutiveDashboard = () => {
    const { applications, capabilities, securityControls } = useData();

    // Risk by Capability
    const riskByCapabilityData = capabilities.map(cap => ({
        name: cap.name,
        riskScore: cap.criticality === 'Critical' ? 100 : cap.criticality === 'High' ? 75 : 50,
    })).sort((a,b) => b.riskScore - a.riskScore).slice(0, 5);

    // Cost by Application
    const costByApplicationData = applications.map(app => ({
        name: app.name,
        cost: Math.floor(Math.random() * 50000) + 10000 // Mock cost
    })).sort((a,b) => b.cost - a.cost).slice(0, 5);

    // Lifecycle Distribution
    const lifecycleDistributionData = applications.reduce((acc, app) => {
        const stage = app.lifecycle || 'Unknown';
        const existing = acc.find(item => item.name === stage);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: stage, value: 1 });
        }
        return acc;
    }, []);
    const LIFECYCLE_COLORS = { Production: '#22c55e', Development: '#3b82f6', Deprecated: '#ef4444', Unknown: '#64748b' };
    
    // Compliance Status
    const complianceStatusData = securityControls.reduce((acc, control) => {
        const status = control.compliance || 'Unknown';
        const existing = acc.find(item => item.name === status);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: status, value: 1 });
        }
        return acc;
    }, []);
    const COMPLIANCE_COLORS = { Compliant: '#22c55e', 'Non-Compliant': '#ef4444', 'Under Review': '#f59e0b', Unknown: '#64748b' };

    // Obsolete Technology Count (mock)
    const obsoleteTechCount = applications.filter(app => app.lifecycle === 'Deprecated').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Executive Dashboard</h1>
                    <p className="text-muted-foreground mt-2">High-level strategic overview of the enterprise architecture landscape.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Data as of {new Date().toLocaleDateString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="kpi-card"><CardContent className="p-6"><AreaChart className="h-8 w-8 text-blue-400 mb-2"/> <p className="text-sm text-muted-foreground">Total Capabilities</p><p className="text-3xl font-bold">{capabilities.length}</p></CardContent></Card>
                <Card className="kpi-card"><CardContent className="p-6"><DollarSign className="h-8 w-8 text-green-400 mb-2"/> <p className="text-sm text-muted-foreground">Total Applications</p><p className="text-3xl font-bold">{applications.length}</p></CardContent></Card>
                <Card className="kpi-card"><CardContent className="p-6"><ShieldCheck className="h-8 w-8 text-purple-400 mb-2"/> <p className="text-sm text-muted-foreground">Total Controls</p><p className="text-3xl font-bold">{securityControls.length}</p></CardContent></Card>
                <Card className="kpi-card"><CardContent className="p-6"><AlertTriangle className="h-8 w-8 text-red-400 mb-2"/> <p className="text-sm text-muted-foreground">Obsolete Tech</p><p className="text-3xl font-bold">{obsoleteTechCount}</p></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-effect">
                    <CardHeader><CardTitle>Top 5 Capabilities by Risk</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={riskByCapabilityData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={150} tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
                                <Tooltip cursor={{fill: 'hsl(var(--accent))'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                                <Bar dataKey="riskScore" fill="hsl(var(--primary))" background={{ fill: 'hsl(var(--secondary))' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="glass-effect">
                    <CardHeader><CardTitle>Top 5 Applications by Cost</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={costByApplicationData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={150} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                <Tooltip cursor={{fill: 'hsl(var(--accent))'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} formatter={(value) => `$${value.toLocaleString()}`} />
                                <Bar dataKey="cost" fill="hsl(var(--primary))" background={{ fill: 'hsl(var(--secondary))' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-effect">
                    <CardHeader><CardTitle>Application Lifecycle Distribution</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={lifecycleDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}>
                                    {lifecycleDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={LIFECYCLE_COLORS[entry.name]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="glass-effect">
                    <CardHeader><CardTitle>Security Compliance Status</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={complianceStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}>
                                    {complianceStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COMPLIANCE_COLORS[entry.name]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ExecutiveDashboard;