import React, { useState, useMemo, useEffect } from 'react';
import { Building2, Search, Plus, Upload, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImportDialog } from '@/components/ImportDialog';
import { jsonToCsv } from '@/lib/csvUtils';
import { usePageState } from '@/contexts/PageStateContext';

import CapabilityTable from '@/components/pages/BusinessCapabilities/CapabilityTable';
import CapabilityCard from '@/components/pages/BusinessCapabilities/CapabilityCard';
import CapabilityViewDialog from '@/components/pages/BusinessCapabilities/CapabilityViewDialog';
import { DataForm } from '@/components/DataForm';
import { capabilitySchema, capabilityFields } from '@/schemas/capabilitySchema';

const PAGE_KEY = 'businessCapabilities';

export default function BusinessCapabilities() {
  const { capabilities, applications, addCapabilities, updateCapabilities, deleteCapabilities, bulkAddCapabilities, loading } = useData();
  const { user } = useAuth();
  const { getPageState, setPageState } = usePageState();
  const pageState = getPageState(PAGE_KEY);

  const [searchTerm, setSearchTerm] = useState(pageState.searchTerm || '');
  const [filterCriticality, setFilterCriticality] = useState(pageState.filterCriticality || 'all');
  const [filterStatus, setFilterStatus] = useState(pageState.filterStatus || 'all');
  const [viewMode, setViewMode] = useState(pageState.viewMode || 'table');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState(null);
  const { toast } = useToast();

  const canEdit = user && user.role !== 'Viewer';

  useEffect(() => {
    setPageState(PAGE_KEY, { searchTerm, filterCriticality, filterStatus, viewMode });
  }, [searchTerm, filterCriticality, filterStatus, viewMode]);

  const filteredCapabilities = useMemo(() => {
    if (!capabilities) return [];
    return capabilities.filter(capability => {
      const ownerMatch = capability.owner ? capability.owner.toLowerCase().includes(searchTerm.toLowerCase()) : false;
      const matchesSearch = capability.name.toLowerCase().includes(searchTerm.toLowerCase()) || ownerMatch;
      const matchesCriticality = filterCriticality === 'all' || capability.criticality === filterCriticality;
      const matchesStatus = filterStatus === 'all' || capability.status === filterStatus;
      
      return matchesSearch && matchesCriticality && matchesStatus;
    })
  }, [capabilities, searchTerm, filterCriticality, filterStatus]);

  const handleSave = (capabilityData) => {
    try {
      const validatedData = capabilitySchema.parse(capabilityData);
      if (validatedData.id) {
        updateCapabilities(validatedData);
        toast({ title: 'Capability Updated', description: `${validatedData.name} has been updated.` });
      } else {
        addCapabilities(validatedData);
        toast({ title: 'Capability Added', description: `${validatedData.name} has been added.` });
      }
      setIsFormOpen(false);
      setSelectedCapability(null);
    } catch (error) {
      toast({ title: 'Validation Error', description: error.errors.map(e => e.message).join(', '), variant: 'destructive' });
    }
  };

  const handleAddClick = () => {
    setSelectedCapability(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (capability) => {
    setSelectedCapability(capability);
    setIsViewOpen(false);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    deleteCapabilities(id);
    toast({ title: 'Capability Deleted', description: 'The capability has been successfully deleted.' });
  };

  const handleView = (capability) => {
    setSelectedCapability(capability);
    setIsFormOpen(false);
    setIsViewOpen(true);
  };

  const handleExport = () => {
    if (filteredCapabilities.length === 0) {
      toast({ title: 'No Data to Export', variant: 'destructive' });
      return;
    }
    const exportData = filteredCapabilities.map(item => ({...item, linkedApps: item.linkedApps?.join(', ')}));
    jsonToCsv(exportData, 'capabilities.csv');
    toast({ title: 'Export Successful' });
  };

  const handleImport = (data) => {
    const processedData = data.map(item => ({
        ...item,
        linkedApps: item.linkedApps ? item.linkedApps.split(',').map(s => s.trim()) : [],
    }));
    bulkAddCapabilities(processedData);
  };
  
  if (loading) {
    return <div className="text-center">Loading Business Capabilities...</div>;
  }

  return (
    <div className="space-y-6">
      {canEdit && <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCapability ? 'Edit' : 'Add'} Business Capability</DialogTitle>
          </DialogHeader>
          <DataForm
            schema={capabilitySchema}
            fields={capabilityFields}
            defaultValues={selectedCapability}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
            dynamicOptions={{
              linkedApps: applications,
            }}
          />
        </DialogContent>
      </Dialog>}

      {canEdit && <ImportDialog 
        open={isImportOpen} 
        onOpenChange={setIsImportOpen} 
        onImport={handleImport} 
        dataType="Capabilities"
        schemaFields={capabilityFields}
      />}
      
      <CapabilityViewDialog 
        capability={selectedCapability}
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        onEdit={handleEditClick}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Capabilities</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor business capabilities across the organization</p>
        </div>
        {canEdit && <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}><Upload className="h-4 w-4 mr-2" />Import</Button>
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Capability
          </Button>
        </div>}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search capabilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={filterCriticality} onValueChange={setFilterCriticality}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Criticality" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Criticality</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>

              <Button variant={viewMode === 'table' ? 'default' : 'outline'} onClick={() => setViewMode('table')}>Table</Button>
              <Button variant={viewMode === 'graph' ? 'default' : 'outline'} onClick={() => setViewMode('graph')}>Graph</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'table' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Capabilities ({filteredCapabilities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CapabilityTable
              capabilities={filteredCapabilities}
              onEdit={handleEditClick}
              onView={handleView}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      )}

      {viewMode === 'graph' && (
        <Card>
          <CardHeader><CardTitle>Capabilities Graph View</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCapabilities.map((capability, index) => (
                <CapabilityCard
                  key={capability.id}
                  capability={capability}
                  onEdit={handleEditClick}
                  onView={handleView}
                  index={index}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}