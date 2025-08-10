import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const calculateCompleteness = (items, fields) => {
  if (!items || items.length === 0) return 0;
  let totalScore = 0;
  items.forEach(item => {
    let filledFields = 0;
    fields.forEach(field => {
      if (item[field] && item[field] !== '' && (!Array.isArray(item[field]) || item[field].length > 0)) {
        filledFields++;
      }
    });
    totalScore += (filledFields / fields.length) * 100;
  });
  return Math.round(totalScore / items.length);
};

const ArchitectureCompletenessIndex = ({ applications, capabilities, technologies, infrastructure, dataDictionary }) => {
  const completenessScores = [
    { name: 'Applications', score: calculateCompleteness(applications, ['name', 'owner', 'lifecycle', 'criticality']) },
    { name: 'Capabilities', score: calculateCompleteness(capabilities, ['name', 'owner', 'criticality', 'status']) },
    { name: 'Technologies', score: calculateCompleteness(technologies, ['name', 'vendor', 'version', 'eol']) },
    { name: 'Infrastructure', score: calculateCompleteness(infrastructure, ['name', 'type', 'vendor', 'cost']) },
    { name: 'Data', score: calculateCompleteness(dataDictionary, ['entity', 'field', 'dataOwner', 'classification']) },
  ];

  return (
    <Card className="h-full glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <CheckCircle className="h-5 w-5 text-teal-400" />
          Architecture Completeness
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {completenessScores.map((item, index) => (
            <div key={item.name}>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
                <p className="text-sm font-semibold text-white">{item.score}%</p>
              </div>
              <div className="w-full bg-accent rounded-full h-2.5">
                <motion.div
                  className="bg-teal-400 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchitectureCompletenessIndex;