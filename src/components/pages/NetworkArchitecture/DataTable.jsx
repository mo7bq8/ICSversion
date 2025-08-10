import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DataTable = ({ title, data, columns, icon, onEdit, onDelete, canEdit }) => {
  const Icon = icon;
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5" />{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {columns.map(col => <th key={col.key} className="text-left py-3 px-4 text-muted-foreground font-medium">{col.header}</th>)}
                {canEdit && <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {(data || []).map((item, index) => (
                <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-border">
                  {columns.map(col => (
                    <td key={col.key} className="py-3 px-4">
                      {typeof item[col.key] === 'boolean' ? (
                        <Badge variant={item[col.key] ? 'destructive' : 'secondary'}>
                          {item[col.key] ? 'Yes' : 'No'}
                        </Badge>
                      ) : (
                        item[col.key]
                      )}
                    </td>
                  ))}
                  {canEdit && (
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => onEdit(item)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button size="sm" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action is permanent.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => onDelete(item.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;