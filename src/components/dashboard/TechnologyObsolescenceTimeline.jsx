import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, CalendarClock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const TechnologyObsolescenceTimeline = ({ technologies }) => {
  const now = new Date();
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(now.getMonth() + 6);

  const upcomingEol = (technologies || [])
    .filter(tech => tech.eol && new Date(tech.eol) > now)
    .sort((a, b) => new Date(a.eol) - new Date(b.eol))
    .slice(0, 5);

  return (
    <Card className="h-full glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <CalendarClock className="h-5 w-5 text-purple-400" />
          Technology Obsolescence Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEol.map((tech, index) => {
            const eolDate = new Date(tech.eol);
            const isSoon = eolDate < sixMonthsFromNow;
            return (
              <motion.div
                key={tech.id}
                className="flex items-center justify-between p-3 rounded-lg bg-accent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-purple-300" />
                  <div>
                    <p className="font-semibold text-white">{tech.name} <span className="text-muted-foreground text-sm">v{tech.version}</span></p>
                    <p className="text-xs text-muted-foreground">{tech.vendor}</p>
                  </div>
                </div>
                <Badge variant={isSoon ? 'destructive' : 'secondary'}>
                  EOL: {new Date(tech.eol).toLocaleDateString()}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnologyObsolescenceTimeline;