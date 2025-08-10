import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

const CapabilityForm = ({ capability, onSave }) => {
  const { applications } = useData();
  const [formData, setFormData] = useState(
    capability || {
      name: '', owner: '', criticality: 'Medium', status: 'Active',
      description: '', linkedApps: [], compliance: 'Under Review',
      strategicGoals: '', linkedProcesses: '', valueStreams: '', kpis: ''
    }
  );
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Capability name is required.';
    if (!formData.owner) newErrors.owner = 'Owner is required.';
    if (!formData.description) newErrors.description = 'Description is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: Array.isArray(value) ? value : [value] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
      <div>
        <Label htmlFor="name" className="text-foreground">Capability Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor="owner" className="text-foreground">Owner</Label>
        <Input id="owner" name="owner" value={formData.owner} onChange={handleChange} />
        {errors.owner && <p className="text-red-500 text-xs mt-1">{errors.owner}</p>}
      </div>
      <div>
        <Label htmlFor="description" className="text-foreground">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>
       <div>
        <Label htmlFor="linkedApps" className="text-foreground">Linked Applications</Label>
        <Select onValueChange={(value) => handleMultiSelectChange('linkedApps', value)}>
          <SelectTrigger><SelectValue placeholder="Select applications..." /></SelectTrigger>
          <SelectContent>{(applications || []).map(app => <SelectItem key={app.id} value={app.name}>{app.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="criticality" className="text-foreground">Criticality</Label>
          <Select name="criticality" value={formData.criticality} onValueChange={(value) => handleSelectChange('criticality', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status" className="text-foreground">Status</Label>
          <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Deprecated">Deprecated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="strategicGoals" className="text-foreground">Strategic Goals Alignment</Label>
        <Input id="strategicGoals" name="strategicGoals" value={formData.strategicGoals} onChange={handleChange} placeholder="e.g., Improve Customer Satisfaction" />
      </div>
      <div>
        <Label htmlFor="linkedProcesses" className="text-foreground">Linked Business Processes</Label>
        <Input id="linkedProcesses" name="linkedProcesses" value={formData.linkedProcesses} onChange={handleChange} placeholder="e.g., Order-to-Cash, Procure-to-Pay" />
      </div>
      <div>
        <Label htmlFor="valueStreams" className="text-foreground">Value Streams</Label>
        <Input id="valueStreams" name="valueStreams" value={formData.valueStreams} onChange={handleChange} placeholder="e.g., Customer Acquisition" />
      </div>
      <div>
        <Label htmlFor="kpis" className="text-foreground">KPIs/Metrics</Label>
        <Input id="kpis" name="kpis" value={formData.kpis} onChange={handleChange} placeholder="e.g., Customer Churn Rate < 5%" />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
};

export default CapabilityForm;