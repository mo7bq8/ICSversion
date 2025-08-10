import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';
import { GitBranch } from 'lucide-react';

const IntegrationComplexityMap = ({ applications }) => {
  const data = (applications || []).map((app, index) => ({
    x: index,
    y: app.dependencies?.length || 0,
    z: (app.dependencies?.length || 0) * 20 + 50,
    name: app.name,
    protocol: app.integrationProtocol,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-card border border-border rounded-lg shadow-lg">
          <p className="font-bold">{data.name}</p>
          <p className="text-sm text-muted-foreground">Integrations: {data.y}</p>
          <p className="text-sm text-muted-foreground">Protocol: {data.protocol}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <GitBranch className="h-5 w-5 text-pink-400" />
          Integration Complexity Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="x" name="app" hide />
            <YAxis type="number" dataKey="y" name="integrations" hide />
            <ZAxis type="number" dataKey="z" range={[50, 1000]} name="complexity" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Scatter name="Applications" data={data} fill="#d946ef" shape="circle" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default IntegrationComplexityMap;