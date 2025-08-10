import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, User, Calendar, BrainCircuit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const GeneratedInsightsList = ({ insights, onDelete, onView }) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="text-center py-10">
        <BrainCircuit className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-white">No insights generated yet</h3>
        <p className="mt-1 text-sm text-gray-500">Use the prompt box above to generate your first visualization.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-effect hover:border-purple-500 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white font-semibold">{insight.prompt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3 w-3" />
                    <span>{insight.createdBy}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => onView(insight)}>View</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the generated insight.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(insight.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};