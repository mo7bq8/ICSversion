import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const DataDictionaryForm = ({ entry, onSave }) => {
  const [formData, setFormData] = useState(
    entry || {
      entity: '', field: '', description: '', type: 'VARCHAR', pii: false,
      dataOwner: '', masterDataSource: '', regulatoryCompliance: 'None',
      classification: 'Public'
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Entity</Label><Input name="entity" value={formData.entity} onChange={handleChange} required /></div>
        <div><Label>Field</Label><Input name="field" value={formData.field} onChange={handleChange} required /></div>
      </div>
      <div><Label>Description</Label><Textarea name="description" value={formData.description} onChange={handleChange} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Data Type</Label><Input name="type" value={formData.type} onChange={handleChange} /></div>
        <div className="flex items-center space-x-2 pt-6"><input type="checkbox" id="pii" name="pii" checked={formData.pii} onChange={handleChange} className="h-4 w-4" /><Label htmlFor="pii">Contains PII</Label></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Data Owner</Label><Input name="dataOwner" value={formData.dataOwner} onChange={handleChange} /></div>
        <div><Label>Master Data Source</Label><Input name="masterDataSource" value={formData.masterDataSource} onChange={handleChange} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Regulatory Compliance</Label>
          <Select name="regulatoryCompliance" value={formData.regulatoryCompliance} onValueChange={v => handleSelectChange('regulatoryCompliance', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="GDPR">GDPR</SelectItem>
              <SelectItem value="CCPA">CCPA</SelectItem>
              <SelectItem value="HIPAA">HIPAA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Classification</Label>
          <Select name="classification" value={formData.classification} onValueChange={v => handleSelectChange('classification', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Public">Public</SelectItem>
              <SelectItem value="Internal">Internal</SelectItem>
              <SelectItem value="Confidential">Confidential</SelectItem>
              <SelectItem value="Restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
};

export default DataDictionaryForm;