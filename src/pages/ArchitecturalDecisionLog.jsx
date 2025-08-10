import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Plus, Eye, Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const DecisionForm = ({ decision, onSave }) => {
  const { applications, technologies, capabilities } = useData();
  const allItems = [
    ...applications.map(a => ({ id: `app-${a.id}`, name: a.name, type: 'Application' })),
    ...technologies.map(t => ({ id: `tech-${t.id}`, name: t.name, type: 'Technology' })),
    ...capabilities.map(c => ({ id: `cap-${c.id}`, name: c.name, type: 'Capability' })),
  ];
  
  const [formData, setFormData] = useState(decision || {
    title: '', rationale: '', status: 'Proposed', linkedItems: [],
  });

  const handleChange = (e) => setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
  const handleSelectChange = (name, value) => setFormData(prev => ({...prev, [name]: value}));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2"><Label>Title</Label><Input name="title" value={formData.title} onChange={handleChange} required /></div>
      <div className="space-y-2"><Label>Rationale</Label><Textarea name="rationale" value={formData.rationale} onChange={handleChange} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Status</Label><Select name="status" value={formData.status} onValueChange={v => handleSelectChange('status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Proposed">Proposed</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Decided">Decided</SelectItem><SelectItem value="Deprecated">Deprecated</SelectItem></SelectContent></Select></div>
      </div>
      <div className="space-y-2"><Label>Linked Items</Label>
        <Select value={formData.linkedItems} onValueChange={v => handleSelectChange('linkedItems', v)}><SelectTrigger><SelectValue placeholder="Link items..." /></SelectTrigger><SelectContent>{allItems.map(item => <SelectItem key={item.id} value={item.name}>{item.name} ({item.type})</SelectItem>)}</SelectContent></Select>
      </div>
      <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose><Button type="submit">Save</Button></DialogFooter>
    </form>
  );
}

export default function ArchitecturalDecisionLog() {
    const { toast } = useToast();
    const { decisions, addDecision, updateDecision, deleteDecision } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDecision, setSelectedDecision] = useState(null);

    const handleSave = (data) => {
      if(data.id) {
        updateDecision(data);
        toast({title: "Decision Updated"});
      } else {
        addDecision(data);
        toast({title: "Decision Added"});
      }
      setIsFormOpen(false);
      setSelectedDecision(null);
    }
    
    const handleAddClick = () => { setSelectedDecision(null); setIsFormOpen(true); }
    const handleEditClick = (item) => { setSelectedDecision(item); setIsFormOpen(true); }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Decided': return 'bg-green-500';
            case 'In Progress': return 'bg-blue-500';
            case 'Proposed': return 'bg-yellow-500';
            case 'Deprecated': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-6">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogContent className="glass-effect">
                <DialogHeader><DialogTitle className="text-white">{selectedDecision ? 'Edit' : 'Add'} Decision</DialogTitle></DialogHeader>
                <DecisionForm decision={selectedDecision} onSave={handleSave} />
              </DialogContent>
            </Dialog>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Architectural Decision Log</h1>
                    <p className="text-gray-400 mt-2">A central registry to track and manage key architectural decisions.</p>
                </div>
                <Button onClick={handleAddClick} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Plus className="h-4 w-4 mr-2" /> Add Decision
                </Button>
            </div>

            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle className="text-white">Decision Records</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Decision</th>
                                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Linked Items</th>
                                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {decisions.map((decision, index) => (
                                    <motion.tr 
                                        key={decision.id} 
                                        className="border-b border-white/5 hover:bg-white/5"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <td className="py-4 px-4">
                                            <p className="text-white font-medium">{decision.title}</p>
                                            <p className="text-gray-400 text-sm">{decision.rationale}</p>
                                        </td>
                                        <td className="py-4 px-4"><Badge className={`${getStatusColor(decision.status)} text-white`}>{decision.status}</Badge></td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-wrap gap-1">
                                                {decision.linkedItems.map((item, idx) => <Badge key={idx} variant="outline">{item}</Badge>)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-300">{new Date(decision.timestamp).toLocaleDateString()}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => handleEditClick(decision)}><Edit className="h-4 w-4" /></Button>
                                                <AlertDialog>
                                                  <AlertDialogTrigger asChild><Button size="sm" variant="ghost"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                                  <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteDecision(decision.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                  </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};