import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

const FormField = ({ fieldKey, fieldSchema, control, errors, options = [] }) => {
  const { label, type, required } = fieldSchema;

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldKey} className="text-foreground">{label}{required && ' *'}</Label>
      <Controller
        name={fieldKey}
        control={control}
        render={({ field }) => {
          switch (type) {
            case 'text':
              return <Input {...field} id={fieldKey} />;
            case 'textarea':
              return <Textarea {...field} id={fieldKey} />;
            case 'number':
              return <Input {...field} id={fieldKey} type="number" onChange={e => field.onChange(Number(e.target.value))}/>;
            case 'select':
              const isIcsLevel = fieldKey === 'ics_level';
              const selectOptions = isIcsLevel 
                ? fieldSchema.options 
                : (Array.isArray(fieldSchema.options) ? fieldSchema.options.map(opt => ({ value: opt, label: opt })) : []);

              return (
                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                  <SelectTrigger><SelectValue placeholder={`Select ${label}...`} /></SelectTrigger>
                  <SelectContent>{selectOptions.map(opt => <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>)}</SelectContent>
                </Select>
              );
            case 'multiselect':
              return (
                <Select onValueChange={value => field.onChange([value])} value={field.value?.[0]}>
                  <SelectTrigger><SelectValue placeholder={`Select ${label}...`} /></SelectTrigger>
                  <SelectContent>{options.map(opt => <SelectItem key={opt.id} value={opt.name}>{opt.name}</SelectItem>)}</SelectContent>
                </Select>
              );
            case 'checkbox':
              return <div className="flex items-center space-x-2 pt-2"><Checkbox id={fieldKey} checked={field.value} onCheckedChange={field.onChange} /><Label htmlFor={fieldKey}>{label}</Label></div>;
            case 'date':
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(parseISO(field.value), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={field.value ? parseISO(field.value) : null} onSelect={date => field.onChange(date?.toISOString())} initialFocus />
                  </PopoverContent>
                </Popover>
              );
            default:
              return <Input {...field} id={fieldKey} />;
          }
        }}
      />
      {errors[fieldKey] && <p className="text-red-500 text-xs mt-1">{errors[fieldKey].message}</p>}
    </div>
  );
};

export const DataForm = ({ schema, fields, defaultValues, onSave, onCancel, dynamicOptions = {} }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
      {Object.entries(fields).map(([key, fieldSchema]) => (
        <FormField key={key} fieldKey={key} fieldSchema={fieldSchema} control={control} errors={errors} options={dynamicOptions[key]}/>
      ))}
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></DialogClose>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
};