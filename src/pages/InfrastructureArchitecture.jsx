import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { HardDrive, Plus, Upload, Search, Server, Cloud, Globe, Trash2, Edit, Eye, FileText, Link as LinkIcon, DollarSign, AlertTriangle, FileClock, Power, GitBranch, Download, Cpu, MemoryStick, Database } from 'lucide-react';
import { ImportDialog } from '@/components/ImportDialog';
import { jsonToCsv } from '@/lib/csvUtils';
import { DataForm } from '@/components/DataForm';
import { infrastructureSchema } from '@/schemas/infrastructureSchema';

const infrastructureFields = {
    name: { label: "Name", type: "text", required: true },
    type: { label: "Type", type: "select", options: ["Physical", "Virtual", "Container", "DBaaS", "PaaS", "SaaS"] },
    vendor: { label: "Vendor", type: "text" },
    os: { label: "OS", type: "text" },
    location: { label: "Location", type: "text" },
    dataCenter: { label: "Data Center/Region", type: "text" },
    lifecycle: { label: "Lifecycle", type: "select", options: ["Active", "End-of-life", "Planned", "Retired"] },
    cost: { label: "Cost (Monthly)", type: "number" },
    risk: { label: "Risk", type: "text" },
    haDrStatus: { label: "HA/DR Status", type: "text" },
    iacLink: { label: "IaC Reference/Link", type: "text" },
    deploymentType: { label: "Deployment Type", type: "select", options: ["On-Prem", "Private Cloud", "Public Cloud", "Hybrid"] },
};


const FactSheet = ({ item, capabilities, onClose }) => {
  if (!item) return null;
  const Icon = item.type === 'Physical' ? Server : item.type === 'Container' ? Cloud : Globe;
  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3"><Icon className="h-6 w-6" />{item.name}</DialogTitle>
          <CardDescription>{item.vendor} - {item.type}</CardDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 py-4 text-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Power className="h-4 w-4 text-primary" /><Label>Specs:</Label><span>{item.specs}</span></div>
            <div className="flex items-center gap-2"><Server className="h-4 w-4 text-primary" /><Label>OS:</Label><span>{item.os}</span></div>
            <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /><Label>Location:</Label><span>{item.location} ({item.dataCenter})</span></div>
            <div className="flex items-center gap-2"><FileClock className="h-4 w-4 text-primary" /><Label>Lifecycle:</Label><Badge variant="outline">{item.lifecycle}</Badge></div>
            <div className="flex items-center gap-2"><GitBranch className="h-4 w-4 text-primary" /><Label>IaC Link:</Label><a href={item.iacLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{item.iacLink}</a></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-400" /><Label>Cost:</Label><span>${item.cost}/month</span></div>
            <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-yellow-400" /><Label>Risk:</Label><span>{item.risk}</span></div>
            <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-purple-400" /><Label>Contract:</Label><span>{item.contract?.name} ({item.contract?.number})</span></div>
            <div className="flex items-center gap-2"><FileClock className="h-4 w-4 text-purple-400" /><Label>Contract End:</Label><span>{item.contract?.endDate}</span></div>
            <div className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-primary" /><Label>HA/DR:</Label><span>{item.haDrStatus}</span></div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2"><Cpu className="h-4 w-4" />Resource Utilization</h4>
          <div className="flex gap-4">
            <span>CPU: {item.resourceUtilization?.cpu}%</span>
            <span>Memory: {item.resourceUtilization?.memory}%</span>
            <span>Storage: {item.resourceUtilization?.storage}%</span>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2"><LinkIcon className="h-4 w-4" />Supported Capabilities</h4>
          <div className="flex flex-wrap gap-2">
            {(item.supportedCapabilities || []).map(capId => {
              const cap = (capabilities || []).find(c => c.id === capId);
              return cap ? <Badge key={capId} variant="secondary">{cap.name}</Badge> : null;
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ConnectorDialog = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const handleSubmit = (e) => {
    e.preventDefault();
    toast({ title: "Mock Connection Success", description: "This is a mock connection. No real data was fetched. 🚀" });
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Connect to Cloud/CMDB</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Provider</Label><Input placeholder="e.g. AWS, Azure, ServiceNow..." /></div>
          <div className="space-y-2"><Label>API Endpoint</Label><Input placeholder="https://api.provider.com/v1" /></div>
          <div className="space-y-2"><Label>API Key</Label><Input type="password" /></div>
          <DialogFooter><Button type="submit">Connect</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function InfrastructureArchitecture() {
  const { infrastructure, capabilities, addInfrastructure, updateInfrastructure, deleteInfrastructure, bulkAddInfrastructure } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isConnectorOpen, setIsConnectorOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const { toast } = useToast();

  const canEdit = user && user.role !== 'Viewer';

  const filteredInfrastructure = useMemo(() => (infrastructure || []).filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.vendor && item.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [infrastructure, searchTerm]);

  const handleSave = (data) => {
    try {
      const validatedData = infrastructureSchema.parse(data);
      if (validatedData.id) {
        updateInfrastructure(validatedData);
        toast({ title: 'Infrastructure Updated', description: `${validatedData.name} has been updated.` });
      } else {
        addInfrastructure(validatedData);
        toast({ title: 'Infrastructure Added', description: `${validatedData.name} has been added.` });
      }
      setIsFormOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast({ title: 'Validation Error', description: error.errors.map(e => e.message).join(', '), variant: 'destructive' });
    }
  };

  const handleAddClick = () => { setSelectedItem(null); setIsFormOpen(true); };
  const handleEditClick = (item) => { setSelectedItem(item); setIsFormOpen(true); };
  const handleDelete = (id) => { deleteInfrastructure(id); toast({ title: 'Infrastructure Deleted' }); };
  
  const handleExport = () => {
    if (filteredInfrastructure.length === 0) {
      toast({ title: 'No Data to Export', variant: 'destructive' });
      return;
    }
    jsonToCsv(filteredInfrastructure, 'infrastructure.csv');
    toast({ title: 'Export Successful' });
  };

  const handleImport = (data) => {
    bulkAddInfrastructure(data);
  };

  return (
    <div className="space-y-6">
      {canEdit && <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}><DialogContent><DialogHeader><DialogTitle>{selectedItem ? 'Edit' : 'Add'} Infrastructure Component</DialogTitle></DialogHeader><DataForm schema={infrastructureSchema} fields={infrastructureFields} defaultValues={selectedItem} onSave={handleSave} onCancel={() => setIsFormOpen(false)} /></DialogContent></Dialog>}
      <FactSheet item={viewingItem} capabilities={capabilities} onClose={() => setViewingItem(null)} />
      {canEdit && <ConnectorDialog open={isConnectorOpen} onOpenChange={setIsConnectorOpen} />}
      {canEdit && <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} onImport={handleImport} dataType="Infrastructure" schemaFields={infrastructureFields} />}

      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Infrastructure Architecture</h1><p className="text-muted-foreground mt-2">Document and manage hardware, software, and cloud services.</p></div>
        {canEdit && <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}><Upload className="h-4 w-4 mr-2" />Import</Button>
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button variant="outline" onClick={() => setIsConnectorOpen(true)}><GitBranch className="h-4 w-4 mr-2" />Connectors</Button>
          <Button onClick={handleAddClick}><Plus className="h-4 w-4 mr-2" />Add Component</Button>
        </div>}
      </div>

      <Card><CardContent className="p-6">
        <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search components..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div>
      </CardContent></Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><HardDrive className="h-5 w-5" />Infrastructure Components ({filteredInfrastructure.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border"><th className="p-3 text-left text-muted-foreground">Name</th><th className="p-3 text-left text-muted-foreground">Type</th><th className="p-3 text-left text-muted-foreground">Vendor</th><th className="p-3 text-left text-muted-foreground">Lifecycle</th><th className="p-3 text-left text-muted-foreground">Cost/Month</th><th className="p-3 text-left text-muted-foreground">Risk</th>{canEdit && <th className="p-3 text-left text-muted-foreground">Actions</th>}</tr></thead>
              <tbody>
                {filteredInfrastructure.map((item, index) => (
                  <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-border hover:bg-accent">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-muted-foreground">{item.type}</td>
                    <td className="p-3 text-muted-foreground">{item.vendor}</td>
                    <td className="p-3"><Badge variant={item.lifecycle === 'End-of-life' ? 'destructive' : 'secondary'}>{item.lifecycle}</Badge></td>
                    <td className="p-3 text-muted-foreground">${item.cost}</td>
                    <td className="p-3 text-muted-foreground">{item.risk}</td>
                    <td className="p-3"><div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setViewingItem(item)}><Eye className="h-4 w-4" /></Button>
                      {canEdit && <>
                        <Button size="sm" variant="ghost" onClick={() => handleEditClick(item)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog><AlertDialogTrigger asChild><Button size="sm" variant="ghost"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the component.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                      </>}
                    </div></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}