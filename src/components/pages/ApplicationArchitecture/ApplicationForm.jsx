import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ApplicationForm = ({ application, onSave }) => {
  const { applications } = useData();
  const [formData, setFormData] = useState({
    name: '',
    lifecycle: 'Production',
    version: '',
    owner: '',
    technology: '',
    dependencies: [],
    criticality: 'Medium',
    status: 'Healthy',
    compliance: 'Compliant',
    integrationProtocol: 'REST',
    deploymentModel: 'Cloud',
    dataEntitiesManaged: '',
    slaDetails: '',
    functionalRequirements: '',
    nonFunctionalRequirements: '',
    lastUpdated: new Date().toISOString(),
  });
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (application) {
      setFormData({
        ...application,
        dependencies: application.dependencies || [],
        lastUpdated: application.lastUpdated || new Date().toISOString(),
      });
    } else {
      setFormData({
        name: '', lifecycle: 'Production', version: '', owner: '', technology: '',
        dependencies: [], criticality: 'Medium', status: 'Healthy', compliance: 'Compliant',
        integrationProtocol: 'REST', deploymentModel: 'Cloud', dataEntitiesManaged: '',
        slaDetails: '', functionalRequirements: '', nonFunctionalRequirements: '',
        lastUpdated: new Date().toISOString(),
      });
    }
  }, [application]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Application name is required.';
    if (!formData.version) newErrors.version = 'Version is required.';
    if (!formData.owner) newErrors.owner = 'Owner is required.';
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

  const handleDateChange = (date) => {
    if (date) {
      setFormData((prev) => ({ ...prev, lastUpdated: date.toISOString() }));
    }
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    onSave(formData);
  };

  const otherApplications = applications.filter(app => app.id !== formData.id);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
      <div>
        <Label htmlFor="name" className="text-foreground">Application Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="version" className="text-foreground">Version</Label>
          <Input id="version" name="version" value={formData.version} onChange={handleChange} />
          {errors.version && <p className="text-red-500 text-xs mt-1">{errors.version}</p>}
        </div>
        <div>
          <Label htmlFor="owner" className="text-foreground">Owner</Label>
          <Input id="owner" name="owner" value={formData.owner} onChange={handleChange} />
          {errors.owner && <p className="text-red-500 text-xs mt-1">{errors.owner}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="technology" className="text-foreground">Technology</Label>
          <Input id="technology" name="technology" value={formData.technology} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="lastUpdated" className="text-foreground">Last Updated</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.lastUpdated && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.lastUpdated ? format(new Date(formData.lastUpdated), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.lastUpdated)}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
       <div>
        <Label htmlFor="dependencies" className="text-foreground">Dependencies</Label>
        <Select onValueChange={(value) => handleMultiSelectChange('dependencies', [value])}>
          <SelectTrigger><SelectValue placeholder="Select dependencies..." /></SelectTrigger>
          <SelectContent>
            {otherApplications.map(app => (
              <SelectItem key={app.id} value={app.name}>{app.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lifecycle" className="text-foreground">Lifecycle</Label>
          <Select name="lifecycle" value={formData.lifecycle} onValueChange={(value) => handleSelectChange('lifecycle', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Production">Production</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Testing">Testing</SelectItem>
              <SelectItem value="Deprecated">Deprecated</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="integrationProtocol" className="text-foreground">Integration Protocol</Label>
          <Select name="integrationProtocol" value={formData.integrationProtocol} onValueChange={(value) => handleSelectChange('integrationProtocol', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="REST">REST</SelectItem>
              <SelectItem value="SOAP">SOAP</SelectItem>
              <SelectItem value="GraphQL">GraphQL</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="deploymentModel" className="text-foreground">Deployment Model</Label>
          <Select name="deploymentModel" value={formData.deploymentModel} onValueChange={(value) => handleSelectChange('deploymentModel', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Cloud">Cloud</SelectItem>
              <SelectItem value="On-Premise">On-Premise</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="dataEntitiesManaged" className="text-foreground">Data Entities Managed</Label>
        <Input id="dataEntitiesManaged" name="dataEntitiesManaged" value={formData.dataEntitiesManaged} onChange={handleChange} placeholder="e.g., Customer, Order, Product" />
      </div>
      <div>
        <Label htmlFor="slaDetails" className="text-foreground">SLA Details</Label>
        <Input id="slaDetails" name="slaDetails" value={formData.slaDetails} onChange={handleChange} placeholder="e.g., 99.9% uptime" />
      </div>
      <div>
        <Label htmlFor="functionalRequirements" className="text-foreground">Functional Requirements</Label>
        <Textarea id="functionalRequirements" name="functionalRequirements" value={formData.functionalRequirements} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="nonFunctionalRequirements" className="text-foreground">Non-Functional Requirements</Label>
        <Textarea id="nonFunctionalRequirements" name="nonFunctionalRequirements" value={formData.nonFunctionalRequirements} onChange={handleChange} />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">Save</Button>
      </DialogFooter>
    </form>
  );
};

export default ApplicationForm;