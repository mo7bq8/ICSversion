import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const IcsZoneForm = ({ zone, onSave, onCancel }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: zone || { name: '', description: '' },
  });

  useEffect(() => {
    reset(zone);
  }, [zone, reset]);

  const onSubmit = (data) => {
    onSave({ ...zone, ...data });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{zone?.id ? 'Edit Zone' : 'Add New Zone'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Zone Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Zone name is required' })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Zone</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default IcsZoneForm;