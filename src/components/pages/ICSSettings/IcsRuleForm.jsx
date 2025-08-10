import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Trash2, PlusCircle } from 'lucide-react';

const IcsRuleForm = ({ rule, onSave, onCancel, zones }) => {
  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm({
    defaultValues: rule || { name: '', priority: 10, is_enabled: true, conditions: [], ics_level: null },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'conditions',
  });

  useEffect(() => {
    reset(rule);
  }, [rule, reset]);

  const onSubmit = (data) => {
    // Ensure priority and ics_level are numbers
    data.priority = Number(data.priority);
    data.ics_level = Number(data.ics_level);
    onSave({ ...rule, ...data });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{rule?.id ? 'Edit Rule' : 'Add New Rule'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="is_enabled" {...register('is_enabled')} checked={watch('is_enabled')} onCheckedChange={(checked) => control.setValue('is_enabled', checked)} />
            <Label htmlFor="is_enabled">Enabled</Label>
          </div>
          <div>
            <Label htmlFor="name">Rule Name</Label>
            <Input id="name" {...register('name', { required: 'Rule name is required' })} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Input id="priority" type="number" {...register('priority', { required: 'Priority is required', valueAsNumber: true })} />
              {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority.message}</p>}
            </div>
            <div>
              <Label htmlFor="ics_level">ICS Level</Label>
              <Input id="ics_level" type="number" step="0.5" {...register('ics_level', { required: 'ICS Level is required', valueAsNumber: true })} />
              {errors.ics_level && <p className="text-red-500 text-xs mt-1">{errors.ics_level.message}</p>}
            </div>
          </div>

          <div>
            <Label>Conditions</Label>
            <div className="space-y-2 p-2 border rounded-md">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <Input {...register(`conditions.${index}.field`, { required: true })} placeholder="Field (e.g., role)" />
                  </div>
                  <div className="col-span-3">
                    <Select onValueChange={(value) => control.setValue(`conditions.${index}.operator`, value)} defaultValue={field.operator}>
                       <SelectTrigger><SelectValue placeholder="Operator" /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="equals">Equals</SelectItem>
                         <SelectItem value="contains">Contains</SelectItem>
                         <SelectItem value="in">In</SelectItem>
                       </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <Input {...register(`conditions.${index}.value`, { required: true })} placeholder="Value (e.g., PLC)" />
                  </div>
                  <div className="col-span-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ field: '', operator: 'equals', value: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Condition
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Rule</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default IcsRuleForm;