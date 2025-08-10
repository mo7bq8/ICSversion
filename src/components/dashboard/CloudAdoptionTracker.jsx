import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Cloud } from 'lucide-react';

const CloudAdoptionTracker = ({ infrastructure }) => {
  const data = (infrastructure || []).reduce((acc, item) => {
    const type = item.deploymentType || 'Unknown';
    const existing = acc.find(d => d.name === type);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: type, count: 1 });
    }
    return acc;
  }, []);

  return (
    <Card className="h-full glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Cloud className="h-5 w-5 text-sky-400" />
          Cloud Adoption Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={80} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Bar dataKey="count" fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CloudAdoptionTracker;