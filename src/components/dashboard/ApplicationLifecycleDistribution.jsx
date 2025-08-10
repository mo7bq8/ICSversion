import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Layers } from 'lucide-react';

const ApplicationLifecycleDistribution = ({ applications }) => {
  const data = (applications || []).reduce((acc, app) => {
    const lifecycle = app.lifecycle || 'Unknown';
    const existing = acc.find(item => item.name === lifecycle);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: lifecycle, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = {
    Production: '#22c55e',
    Development: '#3b82f6',
    Testing: '#f59e0b',
    Deprecated: '#ef4444',
    Unknown: '#64748b',
  };

  return (
    <Card className="h-full glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Layers className="h-5 w-5 text-blue-400" />
          Application Lifecycle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#64748b'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ApplicationLifecycleDistribution;