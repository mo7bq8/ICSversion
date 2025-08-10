import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Database, 
  Cloud, 
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ImportDialog } from '@/components/ImportDialog';
import { jsonToCsv } from '@/lib/csvUtils';
import { DataForm } from '@/components/DataForm';
import { technologySchema, technologyFields } from '@/schemas/technologySchema';

export default function TechnologyArchitecture() {
  const { technologies, addTechnologies, updateTechnologies, deleteTechnologies, bulkAddTechnologies } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterEnvironment, setFilterEnvironment] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [viewingTechnology, setViewingTechnology] = useState(null);
  const { toast } = useToast();

  const canEdit = user && user.role !== 'Viewer';

  const filteredTechnologies = useMemo(() => (technologies || []).filter(tech => {
    const searchMatch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (tech.vendor && tech.vendor.toLowerCase().includes(searchTerm.toLowerCase()));
    const typeMatch = filterType === 'all' || tech.type === filterType;
    const envMatch = filterEnvironment === 'all' || tech.environment === filterEnvironment;
    return searchMatch && typeMatch && envMatch;
  }), [technologies, searchTerm, filterType, filterEnvironment]);

  const handleSave = (techData) => {
    try {
      const validatedData = technologySchema.parse(techData);
      if (validatedData.id) {
        updateTechnologies(validatedData);
        toast({ title: 'Technology Updated' });
      } else {
        addTechnologies(validatedData);
        toast({ title: 'Technology Added' });
      }
      setIsFormOpen(false);
      setSelectedTechnology(null);
    } catch(error) {
       toast({ title: 'Validation Error', description: error.errors.map(e => e.message).join(', '), variant: 'destructive' });
    }
  };

  const handleAddClick = () => { setSelectedTechnology(null); setIsFormOpen(true); };
  const handleEditClick = (tech) => { setSelectedTechnology(tech); setIsFormOpen(true); };
  const handleDelete = (id) => { deleteTechnologies(id); toast({ title: 'Technology Deleted' }); };
  const handleViewClick = (tech) => { setViewingTechnology(tech); };

  const handleExport = () => {
    if (filteredTechnologies.length === 0) {
      toast({ title: 'No Data to Export', variant: 'destructive' });
      return;
    }
    jsonToCsv(filteredTechnologies, 'technologies.csv');
    toast({ title: 'Export Successful' });
  };

  const handleImport = (data) => {
    bulkAddTechnologies(data);
  };

  const icons = {
    Database: <Database className="h-8 w-8 text-primary" />,
    Server: <Server className="h-8 w-8 text-green-400" />,
    Platform: <Cloud className="h-8 w-8 text-blue-400" />,
    Network: <Server className="h-8 w-8 text-yellow-400" />,
    Cache: <Server className="h-8 w-8 text-purple-400" />,
    Storage: <Server className="h-8 w-8 text-indigo-400" />,
  };

  return (
    <div className="space-y-6">
      {canEdit && <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selectedTechnology ? 'Edit' : 'Add'} Technology Asset</DialogTitle></DialogHeader>
          <DataForm schema={technologySchema} fields={technologyFields} defaultValues={selectedTechnology} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>}

      <Dialog open={!!viewingTechnology} onOpenChange={() => setViewingTechnology(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{viewingTechnology?.name}</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <p><strong>Type:</strong> {viewingTechnology?.type}</p>
            <p><strong>Vendor:</strong> {viewingTechnology?.vendor}</p>
            <p><strong>Version:</strong> {viewingTechnology?.version}</p>
            <p><strong>End-of-Life:</strong> {viewingTechnology?.eol}</p>
            <p><strong>End-of-Support:</strong> {viewingTechnology?.eos}</p>
          </div>
        </DialogContent>
      </Dialog>

      {canEdit && <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} onImport={handleImport} dataType="Technologies" schemaFields={technologyFields} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Technology Architecture</h1>
          <p className="text-muted-foreground mt-2">Manage technology assets, lifecycles, and standards.</p>
        </div>
        {canEdit && <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}><Upload className="h-4 w-4 mr-2" />Import</Button>
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button onClick={handleAddClick}><Plus className="h-4 w-4 mr-2" />Add Asset</Button>
        </div>}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search assets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                  <SelectItem value="Server">Server</SelectItem>
                  <SelectItem value="Platform">Platform</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterEnvironment} onValueChange={setFilterEnvironment}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Environment" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Environments</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                </SelectContent>
              </Select>
              <Button variant={viewMode === 'table' ? 'default' : 'outline'} onClick={() => setViewMode('table')}>Table</Button>
              <Button variant={viewMode === 'card' ? 'default' : 'outline'} onClick={() => setViewMode('card')}>Card</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'table' ? (
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b"><th className="p-3 text-left">Name</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Vendor</th><th className="p-3 text-left">Version</th><th className="p-3 text-left">EOL</th>{canEdit && <th className="p-3 text-left">Actions</th>}</tr></thead>
                <tbody>
                  {filteredTechnologies.map((tech, index) => (
                    <motion.tr key={tech.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b hover:bg-accent">
                      <td className="p-3 font-medium">{tech.name}</td>
                      <td className="p-3"><Badge variant="secondary">{tech.type}</Badge></td>
                      <td className="p-3">{tech.vendor}</td>
                      <td className="p-3">{tech.version}</td>
                      <td className="p-3">{tech.eol}</td>
                      {canEdit && <td className="p-3"><div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleViewClick(tech)}><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEditClick(tech)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog><AlertDialogTrigger asChild><Button size="sm" variant="ghost"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the asset.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(tech.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                      </div></td>}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTechnologies.map((tech, index) => (
            <motion.div key={tech.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="h-full flex flex-col">
                <CardHeader className="flex-row items-center gap-4">
                  {icons[tech.type] || <Server className="h-8 w-8" />}
                  <div>
                    <CardTitle>{tech.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{tech.vendor}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <p><strong>Version:</strong> {tech.version}</p>
                  <p><strong>EOL:</strong> {tech.eol}</p>
                  <p><strong>Status:</strong> <Badge>{tech.status}</Badge></p>
                </CardContent>
                {canEdit && <div className="p-6 pt-0 flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleViewClick(tech)}><Eye className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEditClick(tech)}><Edit className="h-4 w-4" /></Button>
                  <AlertDialog><AlertDialogTrigger asChild><Button size="sm" variant="ghost"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the asset.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(tech.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                </div>}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}