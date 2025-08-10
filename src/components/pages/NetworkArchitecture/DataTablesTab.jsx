import React, { useState } from 'react';
import DataTable from './DataTable';
import ItemForm from './ItemForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImportDialog } from '@/components/ImportDialog';
import { useToast } from '@/components/ui/use-toast';
import { jsonToCsv } from '@/lib/csvUtils';
import { Plus, Upload, Download, Share2, Workflow, Server } from 'lucide-react';

const DataTablesTab = ({
  networkInterfaces,
  dataFlows,
  networkComponents,
  canEdit,
  handleSave,
  handleDelete,
  handleBulkAdd
}) => {
  const { toast } = useToast();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importType, setImportType] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const { deleteNetworkInterfaces, deleteDataFlows, deleteNetworkComponents } = handleDelete;
  const { bulkAddNetworkInterfaces, bulkAddDataFlows, bulkAddNetworkComponents } = handleBulkAdd;

  const handleExport = (data, filename) => {
    if (!data || data.length === 0) {
      toast({ title: 'No Data to Export', variant: 'destructive' });
      return;
    }
    jsonToCsv(data, filename);
    toast({ title: 'Export Successful' });
  };

  const openImportDialog = (type) => {
    setImportType(type);
    setIsImportOpen(true);
  };
  
  const handleEdit = (item, type) => {
    setSelectedItem(item);
    setFormType(type);
    setIsFormOpen(true);
  };
  
  const handleAdd = (type) => {
    setSelectedItem(null);
    setFormType(type);
    setIsFormOpen(true);
  };

  const onSave = (data) => {
    handleSave(data, formType);
    setIsFormOpen(false);
  };

  return (
    <div className="mt-4 space-y-6">
      {canEdit && <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} onImport={(data) => {
          if(importType === 'Interfaces') bulkAddNetworkInterfaces(data);
          if(importType === 'Data Flows') bulkAddDataFlows(data);
          if(importType === 'Network Components') bulkAddNetworkComponents(data);
      }} dataType={importType} />}
      
      {canEdit && <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{selectedItem ? 'Edit' : 'Add'} {formType}</DialogTitle></DialogHeader>
            <ItemForm type={formType} item={selectedItem} onSave={onSave} />
          </DialogContent>
        </Dialog>}

      <div className="flex justify-end gap-2">
        {canEdit && <Button onClick={() => handleAdd('Interface')}><Plus className="h-4 w-4 mr-2" />Add Interface</Button>}
        {canEdit && <Button variant="outline" onClick={() => openImportDialog('Interfaces')}><Upload className="h-4 w-4 mr-2" />Import</Button>}
        <Button variant="outline" onClick={() => handleExport(networkInterfaces, 'interfaces.csv')}><Download className="h-4 w-4 mr-2" />Export</Button>
      </div>
      <DataTable 
        title="Interfaces" data={networkInterfaces} icon={Share2} canEdit={canEdit}
        onEdit={(item) => handleEdit(item, 'Interface')} onDelete={deleteNetworkInterfaces}
        columns={[{ header: 'Name', key: 'name' }, { header: 'Endpoint', key: 'endpoint' }, { header: 'Method', key: 'method' }, { header: 'Protocol', key: 'protocol' }, { header: 'Auth', key: 'auth' }]}
      />
      
      <div className="flex justify-end gap-2">
        {canEdit && <Button onClick={() => handleAdd('Data Flow')}><Plus className="h-4 w-4 mr-2" />Add Data Flow</Button>}
        {canEdit && <Button variant="outline" onClick={() => openImportDialog('Data Flows')}><Upload className="h-4 w-4 mr-2" />Import</Button>}
        <Button variant="outline" onClick={() => handleExport(dataFlows, 'dataflows.csv')}><Download className="h-4 w-4 mr-2" />Export</Button>
      </div>
      <DataTable 
        title="Data Flows" data={dataFlows} icon={Workflow} canEdit={canEdit}
        onEdit={(item) => handleEdit(item, 'Data Flow')} onDelete={deleteDataFlows}
        columns={[{ header: 'From', key: 'from' }, { header: 'To', key: 'to' }, { header: 'Type', key: 'type' }, { header: 'Protocol', key: 'protocol' }, { header: 'PII', key: 'pii' }]}
      />
      
      <div className="flex justify-end gap-2">
        {canEdit && <Button onClick={() => handleAdd('Network Component')}><Plus className="h-4 w-4 mr-2" />Add Component</Button>}
        {canEdit && <Button variant="outline" onClick={() => openImportDialog('Network Components')}><Upload className="h-4 w-4 mr-2" />Import</Button>}
        <Button variant="outline" onClick={() => handleExport(networkComponents, 'components.csv')}><Download className="h-4 w-4 mr-2" />Export</Button>
      </div>
      <DataTable 
        title="Network Components" data={networkComponents} icon={Server} canEdit={canEdit}
        onEdit={(item) => handleEdit(item, 'Network Component')} onDelete={deleteNetworkComponents}
        columns={[{ header: 'Name', key: 'name' }, { header: 'Component', key: 'component' }, { header: 'Type', key: 'type' }, { header: 'Port', key: 'port' }, { header: 'Protocol', key: 'protocol' }, { header: 'Zone', key: 'zone' }]}
      />
    </div>
  );
};

export default DataTablesTab;