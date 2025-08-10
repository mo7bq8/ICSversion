import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Database } from 'lucide-react';

const DataClassificationSummary = ({ dataDictionary }) => {
  const data = (dataDictionary || []).reduce((acc, entry) => {
    const classification = entry.classification || 'Unclassified';
    const existing = acc.find(item => item.name === classification);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: classification, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = {
    Public: '#3b82f6',
    Internal: '#22c55e',
    Confidential: '#f59e0b',
    Restricted: '#ef4444',
    Unclassified: '#64748b',
  };

  return (
    <Card className="h-full glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Database className="h-5 w-5 text-cyan-400" />
          Data Classification
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
              fill="#8884d8"
              dataKey="value"
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

export default DataClassificationSummary;