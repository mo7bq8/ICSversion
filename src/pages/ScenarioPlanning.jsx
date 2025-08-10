import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Draggable from 'react-draggable';

const ScenarioForm = ({ scenario, onSave }) => {
  const [formData, setFormData] = useState(scenario || {
    name: '', description: '', startDate: '', endDate: '', status: 'Planned',
  });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSelectChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2"><Label>Scenario Name</Label><Input name="name" value={formData.name} onChange={handleChange} required /></div>
      <div className="space-y-2"><Label>Description</Label><Textarea name="description" value={formData.description} onChange={handleChange} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Start Date</Label><Input name="startDate" type="date" value={formData.startDate} onChange={handleChange} /></div>
        <div className="space-y-2"><Label>End Date</Label><Input name="endDate" type="date" value={formData.endDate} onChange={handleChange} /></div>
      </div>
      <div className="space-y-2"><Label>Status</Label><Select name="status" value={formData.status} onValueChange={v => handleSelectChange('status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Planned">Planned</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="On Hold">On Hold</SelectItem></SelectContent></Select></div>
      <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose><Button type="submit">Save</Button></DialogFooter>
    </form>
  );
}

export default function ScenarioPlanning() {
    const { toast } = useToast();
    const { scenarios, addScenario, updateScenario, deleteScenario } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedScenario, setSelectedScenario] = useState(null);

    const handleSave = (data) => {
      if(data.id) {
        updateScenario(data);
        toast({title: "Scenario Updated"});
      } else {
        addScenario(data);
        toast({title: "Scenario Added"});
      }
      setIsFormOpen(false);
      setSelectedScenario(null);
    }

    const handleAddClick = () => { setSelectedScenario(null); setIsFormOpen(true); }
    const handleEditClick = (item) => { setSelectedScenario(item); setIsFormOpen(true); }

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress': return 'bg-blue-500';
            case 'Planned': return 'bg-yellow-500';
            case 'Completed': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };
    
    const timeDomain = [new Date('2024-01-01'), new Date('2027-01-01')];
    const totalDuration = timeDomain[1] - timeDomain[0];
    
    const calculatePosition = (dateStr) => {
        if(!dateStr) return 0;
        const date = new Date(dateStr);
        return ((date - timeDomain[0]) / totalDuration) * 100;
    };

    return (
        <div className="space-y-6">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogContent className="glass-effect">
                <DialogHeader><DialogTitle className="text-white">{selectedScenario ? 'Edit' : 'Add'} Scenario</DialogTitle></DialogHeader>
                <ScenarioForm scenario={selectedScenario} onSave={handleSave} />
              </DialogContent>
            </Dialog>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Scenario Planning</h1>
                    <p className="text-gray-400 mt-2">Define strategic milestones and visualize transformation roadmaps.</p>
                </div>
                <Button onClick={handleAddClick} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Plus className="h-4 w-4 mr-2" /> Add Scenario
                </Button>
            </div>

            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle className="text-white">Transformation Roadmap</CardTitle>
                    <CardDescription>Interactive timeline visualization of strategic initiatives.</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 overflow-x-auto">
                    <div className="relative h-auto min-h-[400px] w-full bg-slate-900/50 p-4 rounded-lg">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>{timeDomain[0].getFullYear()}</span>
                            <span>{timeDomain[0].getFullYear()+1}</span>
                            <span>{timeDomain[0].getFullYear()+2}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-700 rounded-full mb-6"></div>

                        {scenarios.map((scenario, index) => {
                            const left = calculatePosition(scenario.startDate);
                            const width = calculatePosition(scenario.endDate) - left;
                            
                            return (
                                <Draggable
                                    key={scenario.id}
                                    axis="x"
                                    bounds="parent"
                                    onStop={(e, data) => {
                                        const newStartDate = new Date(timeDomain[0].getTime() + (data.x / e.target.parentElement.clientWidth) * totalDuration);
                                        const duration = new Date(scenario.endDate) - new Date(scenario.startDate);
                                        const newEndDate = new Date(newStartDate.getTime() + duration);
                                        updateScenario({...scenario, startDate: newStartDate.toISOString().split('T')[0], endDate: newEndDate.toISOString().split('T')[0]})
                                    }}
                                >
                                <motion.div 
                                    className="relative h-20 mb-2 cursor-grab active:cursor-grabbing"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    style={{ left: `${left}%`, width: `${width}%` }}
                                >
                                    <div className={`w-full h-full rounded-lg ${getStatusColor(scenario.status)} flex items-center px-4 shadow-lg`}>
                                        <div className="text-white">
                                            <p className="font-bold text-sm">{scenario.name}</p>
                                            <p className="text-xs opacity-80">{scenario.description}</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleEditClick(scenario)}><Edit className="h-3 w-3"/></Button>
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-6 w-6"><Trash2 className="h-3 w-3"/></Button></AlertDialogTrigger>
                                          <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteScenario(scenario.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </motion.div>
                                </Draggable>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};