import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Copy } from 'lucide-react';

const ArchitectureRedundancy = ({ capabilities }) => {
  const data = (capabilities || [])
    .map(cap => ({
      name: cap.name,
      apps: cap.linkedApps?.length || 0,
    }))
    .filter(cap => cap.apps > 1)
    .sort((a, b) => b.apps - a.apps);

  return (
    <Card className="h-full glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Copy className="h-5 w-5 text-orange-400" />
          Architecture Redundancy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} angle={-45} textAnchor="end" height={80} />
            <YAxis allowDecimals={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Bar dataKey="apps" name="Supporting Apps" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ArchitectureRedundancy;