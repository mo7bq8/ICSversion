import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, AlertTriangle, CheckCircle, Search, Plus, Eye, Edit, Trash2,
  Lock, Key, FileText, Upload, Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { ImportDialog } from '@/components/ImportDialog';
import { jsonToCsv } from '@/lib/csvUtils';
import { DataForm } from '@/components/DataForm';
import { securityControlSchema, securityControlFields } from '@/schemas/securityControlSchema';

export default function SecurityArchitecture() {
  const { securityControls, addSecurityControls, updateSecurityControls, deleteSecurityControls, bulkAddSecurityControls } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCompliance, setFilterCompliance] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedControl, setSelectedControl] = useState(null);
  const { toast } = useToast();
  
  const canEdit = user && user.role !== 'Viewer';

  const filteredSecurity = securityControls.filter(control => {
    const matchesSearch = control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         control.framework.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         control.controlId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || control.type === filterType;
    const matchesCompliance = filterCompliance === 'all' || control.compliance === filterCompliance;
    
    return matchesSearch && matchesType && matchesCompliance;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Access Control': return Lock;
      case 'Data Protection': return Key;
      case 'Network Security': return Shield;
      case 'Risk Management': return AlertTriangle;
      case 'Incident Management': return FileText;
      default: return Shield;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Implemented': return 'bg-green-500';
      case 'Partially Implemented': return 'bg-yellow-500';
      case 'Not Implemented': return 'bg-red-500';
      case 'Under Review': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getComplianceColor = (compliance) => {
    switch (compliance) {
      case 'Compliant': return 'text-green-400';
      case 'Non-Compliant': return 'text-red-400';
      case 'Under Review': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getCriticalityColor = (criticality) => {
    switch (criticality) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSave = (data) => {
     try {
      const validatedData = securityControlSchema.parse(data);
      if (validatedData.id) {
        updateSecurityControls(validatedData);
        toast({ title: 'Security Control Updated' });
      } else {
        addSecurityControls(validatedData);
        toast({ title: 'Security Control Added' });
      }
      setIsFormOpen(false);
      setSelectedControl(null);
    } catch (error) {
      toast({ title: 'Validation Error', description: error.errors.map(e => e.message).join(', '), variant: 'destructive' });
    }
  };
  
  const handleAddClick = () => { setSelectedControl(null); setIsFormOpen(true); };
  const handleEditClick = (control) => { setSelectedControl(control); setIsFormOpen(true); };
  const handleDelete = (id) => { deleteSecurityControls(id); toast({ title: 'Security Control Deleted' }); };

  const handleVisualOverlay = () => {
    toast({
      title: "Visual Overlay",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };
  
  const handleExport = () => {
    if (filteredSecurity.length === 0) {
      toast({ title: 'No Data to Export', variant: 'destructive' });
      return;
    }
    const exportData = filteredSecurity.map(item => ({...item, coverage: item.coverage.join(', ')}));
    jsonToCsv(exportData, 'security_controls.csv');
    toast({ title: 'Export Successful' });
  };
  
  const handleImport = (data) => {
    const processedData = data.map(item => ({...item, coverage: item.coverage ? item.coverage.split(',').map(s => s.trim()) : []}));
    bulkAddSecurityControls(processedData);
  };

  return (
    <div className="space-y-6">
      {canEdit && <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}><DialogContent className="glass-effect"><DialogHeader><DialogTitle className="text-white">{selectedControl ? 'Edit' : 'Add'} Security Control</DialogTitle></DialogHeader><DataForm schema={securityControlSchema} fields={securityControlFields} defaultValues={selectedControl} onSave={handleSave} onCancel={() => setIsFormOpen(false)} /></DialogContent></Dialog>}
      {canEdit && <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} onImport={handleImport} dataType="Security Controls" schemaFields={securityControlFields} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Security Architecture</h1>
          <p className="text-gray-400 mt-2">Security controls and compliance management with visual overlays</p>
        </div>
        {canEdit && <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}><Upload className="h-4 w-4 mr-2" />Import</Button>
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button variant="outline" onClick={handleVisualOverlay}><Eye className="h-4 w-4 mr-2" />Visual Overlay</Button>
          <Button onClick={handleAddClick} className="bg-gradient-to-r from-blue-600 to-purple-600"><Plus className="h-4 w-4 mr-2" />Add Control</Button>
        </div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="kpi-card"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-400">Total Controls</p><p className="text-3xl font-bold text-white mt-2">{securityControls.length}</p></div><Shield className="h-12 w-12 text-blue-400" /></div></CardContent></Card>
        <Card className="kpi-card"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-400">Compliant</p><p className="text-3xl font-bold text-green-400 mt-2">{securityControls.filter(c => c.compliance === 'Compliant').length}</p></div><CheckCircle className="h-12 w-12 text-green-400" /></div></CardContent></Card>
        <Card className="kpi-card"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-400">Non-Compliant</p><p className="text-3xl font-bold text-red-400 mt-2">{securityControls.filter(c => c.compliance === 'Non-Compliant').length}</p></div><AlertTriangle className="h-12 w-12 text-red-400" /></div></CardContent></Card>
        <Card className="kpi-card"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-400">Under Review</p><p className="text-3xl font-bold text-yellow-400 mt-2">{securityControls.filter(c => c.compliance === 'Under Review').length}</p></div><Eye className="h-12 w-12 text-yellow-400" /></div></CardContent></Card>
      </div>
      <Card className="glass-effect">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Search security controls..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div></div>
            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="w-40"><SelectValue placeholder="Control Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="Access Control">Access Control</SelectItem><SelectItem value="Data Protection">Data Protection</SelectItem><SelectItem value="Network Security">Network Security</SelectItem><SelectItem value="Risk Management">Risk Management</SelectItem><SelectItem value="Incident Management">Incident Management</SelectItem></SelectContent></Select>
              <Select value={filterCompliance} onValueChange={setFilterCompliance}><SelectTrigger className="w-40"><SelectValue placeholder="Compliance" /></SelectTrigger><SelectContent><SelectItem value="all">All Compliance</SelectItem><SelectItem value="Compliant">Compliant</SelectItem><SelectItem value="Non-Compliant">Non-Compliant</SelectItem><SelectItem value="Under Review">Under Review</SelectItem></SelectContent></Select>
              <Button variant={viewMode === 'table' ? 'default' : 'outline'} onClick={() => setViewMode('table')}>Table</Button>
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')}>Grid</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {viewMode === 'table' && (
        <Card className="glass-effect">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><Shield className="h-5 w-5" />Security Controls ({filteredSecurity.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-white/10"><th className="text-left py-3 px-4 text-gray-300 font-medium">Control</th><th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th><th className="text-left py-3 px-4 text-gray-300 font-medium">Framework</th><th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th><th className="text-left py-3 px-4 text-gray-300 font-medium">Compliance</th><th className="text-left py-3 px-4 text-gray-300 font-medium">Coverage</th><th className="text-left py-3 px-4 text-gray-300 font-medium">Next Review</th>{canEdit && <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>}</tr></thead>
                <tbody>{filteredSecurity.map((control, index) => { const IconComponent = getTypeIcon(control.type); return (<motion.tr key={control.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className="py-4 px-4"><div className="flex items-center gap-3"><IconComponent className="h-5 w-5 text-blue-400" /><div><p className="text-white font-medium">{control.name}</p><div className="flex items-center gap-2 mt-1"><Badge className={`${getCriticalityColor(control.criticality)} text-white text-xs`}>{control.criticality}</Badge><span className="text-gray-400 text-sm">{control.controlId}</span></div></div></div></td><td className="py-4 px-4"><div><p className="text-white">{control.type}</p><p className="text-gray-400 text-sm">{control.category}</p></div></td><td className="py-4 px-4"><Badge variant="outline">{control.framework}</Badge></td><td className="py-4 px-4"><Badge className={`${getStatusColor(control.status)} text-white`}>{control.status}</Badge></td><td className="py-4 px-4"><div className="flex items-center gap-2">{control.compliance === 'Compliant' ? <CheckCircle className="h-4 w-4 text-green-400" /> : control.compliance === 'Non-Compliant' ? <AlertTriangle className="h-4 w-4 text-red-400" /> : <Eye className="h-4 w-4 text-yellow-400" />}<span className={getComplianceColor(control.compliance)}>{control.compliance}</span></div></td><td className="py-4 px-4"><div className="flex flex-wrap gap-1">{control.coverage.slice(0, 2).map((item, idx) => (<Badge key={idx} variant="secondary" className="text-xs">{item}</Badge>))}{control.coverage.length > 2 && <Badge variant="secondary" className="text-xs">+{control.coverage.length - 2}</Badge>}</div></td><td className="py-4 px-4"><span className="text-gray-300 text-sm">{control.nextReview}</span></td>
                    {canEdit && <td className="py-4 px-4"><div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setSelectedControl(control)}><Eye className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditClick(control)}><Edit className="h-4 w-4" /></Button>
                      <AlertDialog><AlertDialogTrigger asChild><Button size="sm" variant="ghost"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the security control.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(control.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                    </div></td>}
                  </motion.tr>);})}</tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      {viewMode === 'grid' && (
        <Card className="glass-effect">
          <CardHeader><CardTitle className="text-white">Security Controls Grid View</CardTitle></CardHeader>
          <CardContent><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredSecurity.map((control, index) => { const IconComponent = getTypeIcon(control.type); return (<motion.div key={control.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className={`architecture-node ${control.compliance === 'Non-Compliant' ? 'node-critical' : control.compliance === 'Under Review' ? 'node-warning' : 'node-healthy'}`} onClick={() => setSelectedControl(control)}><div className="flex items-start justify-between mb-3"><IconComponent className="h-6 w-6 text-blue-400" /><Badge className={`${getCriticalityColor(control.criticality)} text-white text-xs`}>{control.criticality}</Badge></div><h3 className="text-white font-semibold mb-2">{control.name}</h3><p className="text-gray-400 text-sm mb-3">{control.framework} - {control.controlId}</p><div className="space-y-2"><div className="flex items-center justify-between"><span className="text-gray-400 text-sm">Type:</span><span className="text-white text-sm">{control.type}</span></div><div className="flex items-center justify-between"><span className="text-gray-400 text-sm">Status:</span><Badge className={`${getStatusColor(control.status)} text-white text-xs`}>{control.status}</Badge></div><div className="flex items-center justify-between"><span className="text-gray-400 text-sm">Compliance:</span><span className={`text-sm ${getComplianceColor(control.compliance)}`}>{control.compliance}</span></div><div className="flex items-center justify-between"><span className="text-gray-400 text-sm">Coverage:</span><span className="text-white text-sm">{control.coverage.length} items</span></div><div className="pt-2 border-t border-white/10"><p className="text-gray-400 text-xs mb-1">Next Review:</p><p className="text-white text-sm">{control.nextReview}</p></div></div></motion.div>);})}</div></CardContent>
        </Card>
      )}
    </div>
  );
}