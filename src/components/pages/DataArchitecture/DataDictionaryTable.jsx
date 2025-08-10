import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Plus,
  Upload,
  Download,
  Edit,
  Trash2,
  FileText
} from 'lucide-react';
import { ImportDialog } from '@/components/ImportDialog';
import { jsonToCsv } from '@/lib/csvUtils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DataForm } from '@/components/DataForm';
import { dataDictionarySchema, dataDictionaryFields } from '@/schemas/dataDictionarySchema';

const DataDictionaryTable = () => {
  const { dataDictionary, addDataDictionaryEntry, updateDataDictionaryEntry, deleteDataDictionaryEntry, bulkAddDataDictionary } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const { toast } = useToast();

  const canEdit = user && user.role !== 'Viewer';

  const filteredData = (dataDictionary || []).filter(item =>
    (item.entity && item.entity.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.field && item.field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSave = (entryData) => {
    try {
      const validatedData = dataDictionarySchema.parse(entryData);
      if (validatedData.id) {
        updateDataDictionaryEntry(validatedData);
        toast({ title: 'Entry Updated', description: `${validatedData.field} has been updated.` });
      } else {
        addDataDictionaryEntry(validatedData);
        toast({ title: 'Entry Added', description: `${validatedData.field} has been added.` });
      }
      setIsFormOpen(false);
      setSelectedEntry(null);
    } catch(error) {
       toast({ title: 'Validation Error', description: error.errors.map(e => e.message).join(', '), variant: 'destructive' });
    }
  };
  
  const handleAddClick = () => { setSelectedEntry(null); setIsFormOpen(true); };
  const handleEditClick = (item) => { setSelectedEntry(item); setIsFormOpen(true); };
  const handleDeleteClick = (id) => { 
    deleteDataDictionaryEntry(id); 
    toast({ title: 'Entry Deleted', description: 'The entry has been successfully deleted.' }); 
  };

  const handleExport = () => {
    if (filteredData.length === 0) {
      toast({ title: 'No Data to Export', variant: 'destructive' });
      return;
    }
    jsonToCsv(filteredData, 'data_dictionary.csv');
    toast({ title: 'Export Successful' });
  };

  const handleImport = (data) => {
    bulkAddDataDictionary(data);
  };

  return (
    <Card>
      {canEdit && <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{selectedEntry ? 'Edit' : 'Add'} Data Dictionary Entry</DialogTitle>
            </DialogHeader>
            <DataForm schema={dataDictionarySchema} fields={dataDictionaryFields} defaultValues={selectedEntry} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>}
      {canEdit && <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} onImport={handleImport} dataType="Data Dictionary" schemaFields={dataDictionaryFields} />}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Data Dictionary</CardTitle>
          {canEdit && <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsImportOpen(true)}><Upload className="h-4 w-4 mr-2" />Import</Button>
            <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
            <Button onClick={handleAddClick}><Plus className="h-4 w-4 mr-2" />Add Entry</Button>
          </div>}
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search dictionary..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Entity</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Field</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Owner</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Source</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Compliance</th>
                {canEdit && <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <motion.tr key={item.id || index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b hover:bg-accent">
                  <td className="py-3 px-4">{item.entity}</td>
                  <td className="py-3 px-4">{item.field}</td>
                  <td className="py-3 px-4 text-muted-foreground">{item.dataOwner}</td>
                  <td className="py-3 px-4 text-muted-foreground">{item.masterDataSource}</td>
                  <td className="py-3 px-4"><Badge variant={item.regulatoryCompliance === 'None' ? 'secondary' : 'destructive'}>{item.regulatoryCompliance}</Badge></td>
                  {canEdit && <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEditClick(item)}><Edit className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="sm" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the entry.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteClick(item.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataDictionaryTable;