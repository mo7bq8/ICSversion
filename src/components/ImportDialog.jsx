import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { csvToJson, jsonToCsv } from '@/lib/csvUtils';
import { Upload, Download } from 'lucide-react';

export const ImportDialog = ({ open, onOpenChange, onImport, dataType, schemaFields }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    if (!schemaFields) {
        toast({ title: 'Schema not found', description: 'Cannot generate template.', variant: 'destructive'});
        return;
    }
    const headers = Object.keys(schemaFields);
    const emptyData = [Object.fromEntries(headers.map(h => [h, '']))]; // Create one empty row
    jsonToCsv(emptyData, `${dataType.toLowerCase().replace(/\s/g, '_')}_template.csv`);
  };

  const handleImport = async () => {
    if (!file) {
      toast({ title: 'No file selected', description: 'Please select a CSV file to import.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const jsonData = await csvToJson(file);
      // Basic validation: Check if headers match schema
      if (jsonData.length > 0 && schemaFields) {
        const fileHeaders = Object.keys(jsonData[0]);
        const schemaHeaders = Object.keys(schemaFields);
        const missingHeaders = schemaHeaders.filter(h => !fileHeaders.includes(h) && schemaFields[h].required);
        if (missingHeaders.length > 0) {
            toast({ title: 'Import Failed', description: `Missing required columns: ${missingHeaders.join(', ')}`, variant: 'destructive' });
            setLoading(false);
            return;
        }
      }

      onImport(jsonData);
      toast({ title: 'Import Successful', description: `${jsonData.length} ${dataType} records have been imported.` });
      onOpenChange(false);
      setFile(null);
    } catch (error) {
      toast({ title: 'Import Failed', description: error.message || 'There was an error parsing the CSV file.', variant: 'destructive' });
      console.error("CSV Import Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect">
        <DialogHeader>
          <DialogTitle className="text-white">Import {dataType} Data</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk-import {dataType}. You can download a template to see the required format.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <Download className="mr-2 h-4 w-4" /> Download Template
          </Button>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csv-file" className="text-gray-300">CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} className="file:text-white" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleImport} disabled={loading}>
            {loading ? 'Importing...' : <><Upload className="mr-2 h-4 w-4" /> Import Data</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};