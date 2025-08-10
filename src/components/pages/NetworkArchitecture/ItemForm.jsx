import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

const ItemForm = ({ type, item, onSave }) => {
  const [formData, setFormData] = useState(item || {});
  
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSelectChange = (name, value) => {
    // Convert string 'true'/'false' to boolean for PII field
    const val = name === 'pii' ? value === 'true' : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderFormFields = () => {
    switch (type) {
      case 'Interface':
        return (
          <>
            <div className="space-y-2"><Label htmlFor="name">Name</Label><Input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Auth API" /></div>
            <div className="space-y-2"><Label htmlFor="cluster">Cluster</Label><Input name="cluster" value={formData.cluster || ''} onChange={handleChange} placeholder="Authentication" /></div>
            <div className="space-y-2"><Label htmlFor="endpoint">Endpoint</Label><Input name="endpoint" value={formData.endpoint || ''} onChange={handleChange} placeholder="/api/auth" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Method</Label><Select name="method" value={formData.method || ''} onValueChange={(v) => handleSelectChange('method', v)}><SelectTrigger><SelectValue placeholder="POST" /></SelectTrigger><SelectContent><SelectItem value="GET">GET</SelectItem><SelectItem value="POST">POST</SelectItem><SelectItem value="PUT">PUT</SelectItem><SelectItem value="DELETE">DELETE</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Protocol</Label><Select name="protocol" value={formData.protocol || ''} onValueChange={(v) => handleSelectChange('protocol', v)}><SelectTrigger><SelectValue placeholder="HTTPS" /></SelectTrigger><SelectContent><SelectItem value="HTTPS">HTTPS</SelectItem><SelectItem value="HTTP">HTTP</SelectItem><SelectItem value="WebSocket">WebSocket</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label htmlFor="auth">Authentication</Label><Input name="auth" value={formData.auth || ''} onChange={handleChange} placeholder="Token" /></div>
            <div className="space-y-2"><Label>Security Zone</Label><Select name="securityZone" value={formData.securityZone || ''} onValueChange={(v) => handleSelectChange('securityZone', v)}><SelectTrigger><SelectValue placeholder="DMZ" /></SelectTrigger><SelectContent><SelectItem value="DMZ">DMZ</SelectItem><SelectItem value="Internal">Internal</SelectItem><SelectItem value="External">External</SelectItem></SelectContent></Select></div>
          </>
        );
      case 'Data Flow':
         return (
          <>
            <div className="space-y-2"><Label htmlFor="from">Source</Label><Input name="from" value={formData.from || ''} onChange={handleChange} placeholder="System A" /></div>
            <div className="space-y-2"><Label htmlFor="to">Target</Label><Input name="to" value={formData.to || ''} onChange={handleChange} placeholder="System B" /></div>
            <div className="space-y-2"><Label htmlFor="type">Type</Label><Input name="type" value={formData.type || ''} onChange={handleChange} placeholder="ETL" /></div>
            <div className="space-y-2"><Label htmlFor="protocol">Protocol</Label><Input name="protocol" value={formData.protocol || ''} onChange={handleChange} placeholder="Batch" /></div>
            <div className="space-y-2"><Label>PII</Label><Select name="pii" value={String(formData.pii || false)} onValueChange={(v) => handleSelectChange('pii', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="true">Yes</SelectItem><SelectItem value="false">No</SelectItem></SelectContent></Select></div>
          </>
        );
      case 'Network Component':
        return (
          <>
            <div className="space-y-2"><Label htmlFor="name">Name</Label><Input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Frontend Load Balancer" /></div>
            <div className="space-y-2"><Label htmlFor="component">Component</Label><Input name="component" value={formData.component || ''} onChange={handleChange} placeholder="Nginx" /></div>
            <div className="space-y-2"><Label htmlFor="type">Type</Label><Input name="type" value={formData.type || ''} onChange={handleChange} placeholder="LoadBalancer" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="port">Port</Label><Input name="port" type="number" value={formData.port || ''} onChange={handleChange} placeholder="80" /></div>
              <div className="space-y-2"><Label htmlFor="protocol">Protocol</Label><Input name="protocol" value={formData.protocol || ''} onChange={handleChange} placeholder="HTTP" /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="zone">Zone</Label><Input name="zone" value={formData.zone || ''} onChange={handleChange} placeholder="DMZ" /></div>
            <div className="space-y-2"><Label htmlFor="topology">Topology (VLAN/Subnet)</Label><Input name="topology" value={formData.topology || ''} onChange={handleChange} placeholder="VLAN10 / 192.168.1.0/24" /></div>
            <div className="space-y-2"><Label htmlFor="firewallRules">Firewall Rules</Label><Input name="firewallRules" value={formData.firewallRules || ''} onChange={handleChange} placeholder="Allow port 443 from ANY" /></div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderFormFields()}
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
};

export default ItemForm;