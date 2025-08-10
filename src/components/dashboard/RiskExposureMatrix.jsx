import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const RiskExposureMatrix = ({ applications, infrastructure, technologies }) => {
  const criticalityMap = { Low: 1, Medium: 2, High: 3, Critical: 4 };
  const riskMap = { None: 1, Low: 2, Medium: 3, High: 4 };

  const data = [
    ...(applications || []).map(item => ({ x: criticalityMap[item.criticality] || 1, y: riskMap[item.riskLevel || 'Low'] || 1, z: 1, name: item.name, type: 'App' })),
    ...(infrastructure || []).map(item => ({ x: criticalityMap[item.criticality || 'Medium'] || 1, y: riskMap[item.risk] || 1, z: 1, name: item.name, type: 'Infra' })),
    ...(technologies || []).map(item => ({ x: criticalityMap[item.criticality] || 1, y: riskMap[item.vulnerabilityStatus] || 1, z: 1, name: item.name, type: 'Tech' })),
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-card border border-border rounded-lg shadow-lg">
          <p className="font-bold">{data.name}</p>
          <p className="text-sm text-muted-foreground">Type: {data.type}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          Risk Exposure Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="x" name="Criticality" domain={[0, 5]} ticks={[1, 2, 3, 4]} tickFormatter={(tick) => ['Low', 'Medium', 'High', 'Critical'][tick - 1]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis type="number" dataKey="y" name="Risk" domain={[0, 5]} ticks={[1, 2, 3, 4]} tickFormatter={(tick) => ['None/Low', 'Medium', 'High', 'Critical'][tick - 1]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <ZAxis type="number" dataKey="z" range={[50, 200]} name="size" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Scatter name="Assets" data={data} fill="#ef4444" shape="circle" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RiskExposureMatrix;