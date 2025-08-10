import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const getCategoryColor = (category) => {
  switch (category) {
    case 'Application': return 'bg-blue-500/20 text-blue-300 border-blue-500';
    case 'Business Capability': return 'bg-green-500/20 text-green-300 border-green-500';
    case 'Technology': return 'bg-purple-500/20 text-purple-300 border-purple-500';
    case 'Data Entity': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
    case 'User Role': return 'bg-pink-500/20 text-pink-300 border-pink-500';
    case 'Risk': return 'bg-red-500/20 text-red-300 border-red-500';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500';
  }
};

const VisualNode = ({ node, isCentral = false, isInteractive = true }) => {
  const { name, category, subtext, icon: Icon } = node;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`absolute flex items-center p-3 rounded-lg border-2 shadow-lg backdrop-blur-md ${getCategoryColor(category)} ${isInteractive ? 'cursor-pointer' : ''}`}
      style={{ left: node.x, top: node.y, width: isCentral ? 200 : 180 }}
    >
      {Icon && <Icon className="h-6 w-6 mr-3 flex-shrink-0" />}
      <div className="flex-grow">
        <p className="font-bold text-white text-sm truncate">{name}</p>
        {subtext && <p className="text-xs truncate">{subtext}</p>}
      </div>
    </motion.div>
  );
};

const BlockNode = ({ node, isSimulatedOut = false }) => {
  const { name, category, subtext, icon: Icon } = node;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isSimulatedOut ? 0.3 : 1, y: 0 }}
      transition={{ type: 'spring' }}
      className={`relative flex flex-col justify-center p-4 rounded-lg border-2 shadow-lg backdrop-blur-md w-48 h-28 ${getCategoryColor(category)}`}
    >
      <div className="flex items-center mb-2">
        {Icon && <Icon className="h-5 w-5 mr-2 flex-shrink-0" />}
        <p className="font-bold text-white text-sm truncate">{name}</p>
      </div>
      <p className="text-xs truncate">{subtext}</p>
      {isSimulatedOut && (
        <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
          <Badge variant="destructive">Removed</Badge>
        </div>
      )}
    </motion.div>
  );
};

export { VisualNode, BlockNode };