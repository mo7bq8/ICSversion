import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { BarChart2, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DataQualityDashboard = () => {
  const { dataDictionary } = useData();
  const qualityMetrics = useMemo(() => {
    const safeDataDictionary = dataDictionary || [];
    const total = safeDataDictionary.length;
    if (total === 0) return { completeness: 0, accuracy: 0, freshness: 0, piiStatus: [] };
    
    const completeness = safeDataDictionary.reduce((sum, item) => sum + (item.qualityMetrics?.completeness || 0), 0) / total;
    const accuracy = safeDataDictionary.reduce((sum, item) => sum + (item.qualityMetrics?.accuracy || 0), 0) / total;
    const freshness = safeDataDictionary.reduce((sum, item) => sum + (item.qualityMetrics?.freshness || 0), 0) / total;
    
    const piiProtected = safeDataDictionary.filter(d => d.pii && d.regulatoryCompliance !== 'None').length;
    const piiUnprotected = safeDataDictionary.filter(d => d.pii && d.regulatoryCompliance === 'None').length;

    return {
      completeness: Math.round(completeness),
      accuracy: Math.round(accuracy),
      freshness: Math.round(freshness),
      piiStatus: [
        { name: 'Protected', value: piiProtected, color: '#22c55e' },
        { name: 'Unprotected', value: piiUnprotected, color: '#ef4444' },
      ]
    };
  }, [dataDictionary]);

  const trend = [
    { name: 'Jan', quality: 85 }, { name: 'Feb', quality: 87 },
    { name: 'Mar', quality: 86 }, { name: 'Apr', quality: 90 },
    { name: 'May', quality: 91 }, { name: 'Jun', quality: 92 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5" />Data Quality Score Trend</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[80, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="quality" stroke="hsl(var(--primary))" strokeWidth={3} name="Quality Score" unit="%" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />PII Data Protection Status</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={qualityMetrics.piiStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60}>
                  {qualityMetrics.piiStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataQualityDashboard;