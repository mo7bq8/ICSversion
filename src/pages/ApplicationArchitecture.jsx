import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Download, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ApplicationTable from '@/components/pages/ApplicationArchitecture/ApplicationTable';
import ApplicationDependencyView from '@/components/pages/ApplicationArchitecture/ApplicationDependencyView';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FilterControls from '@/components/pages/ApplicationArchitecture/FilterControls';
import { ImportDialog } from '@/components/ImportDialog';
import { jsonToCsv } from '@/lib/csvUtils';
import { usePageState } from '@/contexts/PageStateContext';
import { DataForm } from '@/components/DataForm';
import { applicationSchema, applicationFields } from '@/schemas/applicationSchema';

const PAGE_KEY = 'applicationArchitecture';

export default function ApplicationArchitecture() {
  const { applications, addApplications, updateApplications, deleteApplications, bulkAddApplications, loading } = useData();
  const { user } = useAuth();
  const { getPageState, setPageState } = usePageState();
  const pageState = getPageState(PAGE_KEY);
  
  const [searchTerm, setSearchTerm] = useState(pageState.searchTerm || '');
  const [filterLifecycle, setFilterLifecycle] = useState(pageState.filterLifecycle || 'all');
  const [filterCriticality, setFilterCriticality] = useState(pageState.filterCriticality || 'all');
  const [viewMode, setViewMode] = useState(pageState.viewMode || 'table');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { toast } = useToast();

  const canEdit = user && user.role !== 'Viewer';

  useEffect(() => {
    setPageState(PAGE_KEY, { searchTerm, filterLifecycle, filterCriticality, viewMode });
  }, [searchTerm, filterLifecycle, filterCriticality, viewMode]);

  const enrichedApplications = useMemo(() => {
    if (!applications) return [];
    const appMap = new Map(applications.map(app => [app.name, { ...app, dependents: [] }]));
    
    appMap.forEach(app => {
      if (app.dependencies) {
        app.dependencies.forEach(depName => {
          if (appMap.has(depName)) {
            appMap.get(depName).dependents.push(app.name);
          }
        });
      }
    });

    return Array.from(appMap.values());
  }, [applications]);

  const filteredApplications = useMemo(() => {
    if (!enrichedApplications) return [];
    return enrichedApplications.filter(app => {
      const nameMatch = app.name ? app.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
      const ownerMatch = app.owner ? app.owner.toLowerCase().includes(searchTerm.toLowerCase()) : false;
      const techMatch = app.technology ? app.technology.toLowerCase().includes(searchTerm.toLowerCase()) : false;
      
      const matchesSearch = nameMatch || ownerMatch || techMatch;
      const matchesLifecycle = filterLifecycle === 'all' || app.lifecycle === filterLifecycle;
      const matchesCriticality = filterCriticality === 'all' || app.criticality === filterCriticality;
      
      return matchesSearch && matchesLifecycle && matchesCriticality;
    })
  }, [enrichedApplications, searchTerm, filterLifecycle, filterCriticality]);

  const handleSave = (appData) => {
    try {
      const validatedData = applicationSchema.parse(appData);
      if (validatedData.id) {
        updateApplications(validatedData);
        toast({ title: 'Application Updated', description: `${validatedData.name} has been updated.` });
      } else {
        addApplications(validatedData);
        toast({ title: 'Application Added', description: `${validatedData.name} has been added.` });
      }
      setIsFormOpen(false);
      setSelectedApplication(null);
    } catch(error) {
       toast({ title: 'Validation Error', description: error.errors.map(e => e.message).join(', '), variant: 'destructive' });
    }
  };

  const handleAddClick = () => {
    setSelectedApplication(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (app) => {
    setSelectedApplication(app);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    deleteApplications(id);
    toast({ title: 'Application Deleted', description: 'The application has been successfully deleted.' });
  };

  const handleExport = () => {
    if (filteredApplications.length === 0) {
      toast({ title: 'No Data to Export', description: 'There are no applications to export.', variant: 'destructive' });
      return;
    }
    const exportData = filteredApplications.map(({dependents, ...rest}) => ({
      ...rest,
      dependencies: rest.dependencies?.join(','),
    }));
    jsonToCsv(exportData, 'applications.csv');
    toast({ title: 'Export Successful', description: 'Applications data has been exported.' });
  };

  const handleImport = (data) => {
    const processedData = data.map(item => ({
      ...item,
      dependencies: item.dependencies ? item.dependencies.split(',').map(s => s.trim()) : [],
    }));
    bulkAddApplications(processedData);
  };

  if (loading) {
    return <div className="text-center">Loading Application Architecture...</div>;
  }

  return (
    <div className="space-y-6">
      {canEdit && <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedApplication ? 'Edit' : 'Add'} Application</DialogTitle>
          </DialogHeader>
          <DataForm
            schema={applicationSchema}
            fields={applicationFields}
            defaultValues={selectedApplication}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
            dynamicOptions={{
              dependencies: applications.filter(app => app.id !== selectedApplication?.id),
            }}
          />
        </DialogContent>
      </Dialog>}

      {canEdit && <ImportDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImport}
        dataType="Applications"
        schemaFields={applicationFields}
      />}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Application Architecture</h1>
          <p className="text-muted-foreground mt-2">Manage application lifecycle, dependencies, and impact analysis</p>
        </div>
        {canEdit && <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </div>}
      </div>

      <Card>
        <CardContent className="p-6">
          <FilterControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterLifecycle={filterLifecycle}
            setFilterLifecycle={setFilterLifecycle}
            filterCriticality={filterCriticality}
            setFilterCriticality={setFilterCriticality}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </CardContent>
      </Card>

      {viewMode === 'table' ? (
        <ApplicationTable 
          applications={filteredApplications} 
          onEdit={handleEditClick} 
          onDelete={handleDelete}
        />
      ) : (
        <ApplicationDependencyView applications={filteredApplications} />
      )}
    </div>
  );
}