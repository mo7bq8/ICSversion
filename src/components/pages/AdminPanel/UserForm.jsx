import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { navItems } from '@/components/Layout';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'cmdk';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogFooter } from '@/components/ui/dialog';

const pageOptions = navItems
  .filter(item => !['/', '/admin'].includes(item.path) && item.label !== 'Dashboard')
  .map(item => ({ value: item.label, label: item.label }));

const UserForm = ({ user, onSave, onCancel }) => {
  const { roles } = useData();
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    defaultValues: user || { name: '', email: '', role: '', status: 'Active', password: '', pageAccess: [] }
  });

  const [openPageAccess, setOpenPageAccess] = useState(false);
  const pageAccess = watch('pageAccess') || [];

  const handlePageAccessChange = (value) => {
    const newValue = pageAccess.includes(value)
      ? pageAccess.filter((v) => v !== value)
      : [...pageAccess, value];
    setValue('pageAccess', newValue, { shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col h-full">
      <ScrollArea className="flex-grow pr-6 -mr-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>
          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required for new users' })}
              />
              {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Role is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="role"><SelectValue placeholder="Select a role" /></SelectTrigger>
                    <SelectContent>{(roles || []).map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-destructive text-sm">{errors.role.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value || 'Active'}>
                    <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-destructive text-sm">{errors.status.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Page Access</Label>
            <Popover open={openPageAccess} onOpenChange={setOpenPageAccess}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openPageAccess} className="w-full justify-between h-auto min-h-[2.5rem]">
                  <div className="flex flex-wrap gap-1 items-center">
                    {pageAccess.length > 0
                      ? pageAccess.map(page => <Badge key={page} variant="secondary">{page}</Badge>)
                      : <span className="text-muted-foreground font-normal">Select pages...</span>
                    }
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search pages..." />
                  <CommandEmpty>No pages found.</CommandEmpty>
                  <CommandGroup className="max-h-48 overflow-y-auto scrollbar-thin">
                    {pageOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => handlePageAccessChange(option.value)}
                      >
                        <Check className={cn("mr-2 h-4 w-4", pageAccess.includes(option.value) ? "opacity-100" : "opacity-0")} />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </ScrollArea>
      <DialogFooter className="pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{user ? 'Save Changes' : 'Create User'}</Button>
      </DialogFooter>
    </form>
  );
};

export default UserForm;