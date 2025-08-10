import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { DollarSign } from 'lucide-react';

const CostDistributionByLayer = ({ applications, infrastructure, technologies }) => {
  const data = [
    {
      name: 'Architecture Layers',
      Infrastructure: (infrastructure || []).reduce((sum, item) => sum + (item.cost || 0), 0),
      Application: (applications || []).reduce((sum, item) => sum + (item.monthlyCost || 0), 0),
      Technology: (technologies || []).reduce((sum, item) => sum + (item.monthlyCost || 0), 0),
    },
  ];

  return (
    <Card className="h-full glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <DollarSign className="h-5 w-5 text-yellow-400" />
          Cost Distribution by Layer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" barSize={60}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Bar dataKey="Infrastructure" stackId="a" fill="#8884d8" />
            <Bar dataKey="Application" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Technology" stackId="a" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CostDistributionByLayer;