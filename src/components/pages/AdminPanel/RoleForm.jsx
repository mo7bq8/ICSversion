import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const modules = [
  "Business Capabilities", "Application Architecture", "Technology Architecture", 
  "Infrastructure Architecture", "Network Architecture", "Data Architecture", 
  "Security Architecture", "Scenario Planning", "Decision Log", "ICS Levels"
];
const permissions = ["View", "Create", "Edit", "Delete"];

const RoleForm = ({ role, onSave, onCancel }) => {
  const { register, handleSubmit, setValue, getValues, watch, formState: { errors } } = useForm({
    defaultValues: role || { name: '', permissions: {} }
  });

  const watchPermissions = watch('permissions');

  const handleSelectAllModule = (module, checked) => {
    permissions.forEach(perm => {
      setValue(`permissions.${module}.${perm}`, checked);
    });
  };

  const handleSelectAllPermission = (perm, checked) => {
    modules.forEach(module => {
      setValue(`permissions.${module}.${perm}`, checked);
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Role Name</Label>
        <Input
          id="name"
          {...register('name', { required: 'Role name is required' })}
        />
        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
      </div>

      <Card className="glass-effect">
        <CardHeader><CardTitle className="text-white">Permissions</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-semibold">Module</th>
                  {permissions.map(perm => (
                    <th key={perm} className="text-center p-2 font-semibold">
                      <div className="flex flex-col items-center">
                        <span>{perm}</span>
                        <Checkbox onCheckedChange={(checked) => handleSelectAllPermission(perm, checked)} />
                      </div>
                    </th>
                  ))}
                  <th className="text-center p-2 font-semibold">All</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(module => (
                  <tr key={module} className="border-b border-border">
                    <td className="p-2 font-medium text-white">{module}</td>
                    {permissions.map(perm => (
                      <td key={perm} className="text-center p-2">
                        <Checkbox {...register(`permissions.${module}.${perm}`)} />
                      </td>
                    ))}
                    <td className="text-center p-2">
                      <Checkbox onCheckedChange={(checked) => handleSelectAllModule(module, checked)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{role ? 'Save Changes' : 'Create Role'}</Button>
      </div>
    </form>
  );
};

export default RoleForm;