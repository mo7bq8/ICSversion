import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Building2 } from 'lucide-react';

const CapabilitySupportCoverage = ({ capabilities }) => {
  const data = (capabilities || [])
    .map(cap => ({
      name: cap.name,
      apps: cap.linkedApps?.length || 0,
    }))
    .sort((a, b) => b.apps - a.apps);

  return (
    <Card className="h-full glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Building2 className="h-5 w-5 text-green-400" />
          Capability Support Coverage
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
            <Bar dataKey="apps" name="Linked Apps" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CapabilitySupportCoverage;