import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Database, Cloud } from 'lucide-react';
import { scaleTime } from 'd3-scale';

const getTimelineColor = (type) => {
    switch (type) {
        case 'Database': return 'bg-blue-500';
        case 'Platform': return 'bg-purple-500';
        case 'Network': return 'bg-green-500';
        case 'Server': return 'bg-orange-500';
        default: return 'bg-gray-500';
    }
}

const TechnologyTimelineView = () => {
  const { technologies } = useData();

  const timelineData = useMemo(() => {
    return technologies.map(tech => {
        const startDate = new Date(tech.lastUpdated);
        let endDate;
        if(tech.status === 'End of Life') {
            endDate = new Date(startDate);
            endDate.setFullYear(startDate.getFullYear() - 2); // Mock EOL date
        } else {
            endDate = new Date(startDate);
            endDate.setFullYear(startDate.getFullYear() + 3); // Mock future EOL
        }
        return { ...tech, startDate, endDate };
    });
  }, [technologies]);
  
  const now = new Date();
  const timeDomain = [
      new Date(now.getFullYear() - 3, 0, 1),
      new Date(now.getFullYear() + 4, 0, 1)
  ];
  
  const xScale = scaleTime().domain(timeDomain).range([0, 100]);

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Technology Lifecycle Risk Tracker</CardTitle>
        <CardDescription>Timeline of technology components, their lifespan, and risk profiles.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[600px] overflow-y-auto scrollbar-thin space-y-4 pr-4">
          {/* Timeline Header */}
          <div className="sticky top-0 bg-slate-800/80 backdrop-blur-sm z-10 py-2">
            <div className="flex h-8 items-center">
              <div className="w-64 flex-shrink-0"></div>
              <div className="flex-grow relative h-full">
                {Array.from({ length: 8 }, (_, i) => timeDomain[0].getFullYear() + i).map(year => (
                  <div key={year} className="absolute h-full flex flex-col items-center" style={{ left: `${xScale(new Date(year, 0, 1))}%`}}>
                    <span className="text-xs text-gray-400">{year}</span>
                    <div className="w-px h-full bg-white/10"></div>
                  </div>
                ))}
                <div className="absolute top-0 h-full w-px bg-red-500" style={{ left: `${xScale(now)}%` }}>
                  <span className="absolute -top-5 -translate-x-1/2 text-xs text-red-400">Now</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timeline Items */}
          {timelineData.map((tech, index) => {
            const left = xScale(tech.startDate);
            const width = xScale(tech.endDate) - left;
            const isEOL = tech.status === 'End of Life';
            return(
            <motion.div 
                key={tech.id} 
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
            >
              <div className="w-64 flex-shrink-0 flex items-center gap-2 pr-2">
                {tech.type === 'Database' ? <Database className="h-4 w-4" /> : tech.type === 'Platform' ? <Cloud className="h-4 w-4" /> : <Server className="h-4 w-4" />}
                <p className="text-sm truncate font-medium text-white">{tech.name}</p>
              </div>
              <div className="flex-grow h-8 relative">
                <motion.div 
                  className={`absolute h-full rounded ${getTimelineColor(tech.type)} ${isEOL ? 'opacity-50' : ''}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  whileHover={{ scaleY: 1.2, zIndex: 5 }}
                >
                  {tech.criticality === 'Critical' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-800"></div>}
                </motion.div>
              </div>
            </motion.div>
          )})}
        </div>
        <div className="flex justify-end gap-4 mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full border-2 border-slate-800"/> Critical Risk</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-500 opacity-50"/> End of Life</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnologyTimelineView;