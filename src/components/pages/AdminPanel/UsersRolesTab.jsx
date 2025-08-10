import React, { useState, useMemo } from 'react';
import { Plus, Upload, Download, Search, Edit, Trash2, Shield, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import UserForm from './UserForm';
import RoleForm from './RoleForm';
import ConfirmationDialog from './ConfirmationDialog';

const UsersRolesTab = () => {
  const { users, roles, addUser, updateUser, deleteUser, addRole, updateRole, deleteRole, bulkAddData } = useData();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  
  const [dialogState, setDialogState] = useState({ open: false, type: null, id: null });

  const openConfirmation = (type, id) => setDialogState({ open: true, type, id });

  const handleConfirmDelete = () => {
    if (dialogState.type === 'user') {
      deleteUser(dialogState.id);
      toast({ title: "User Deleted", description: "The user has been successfully deleted." });
    } else if (dialogState.type === 'role') {
      deleteRole(dialogState.id);
      toast({ title: "Role Deleted", description: "The role has been successfully deleted." });
    }
    setDialogState({ open: false, type: null, id: null });
  };
  
  const handleSaveUser = (data) => {
    if (data.id) {
      updateUser(data);
      toast({ title: 'User Updated', description: `${data.name} has been updated.` });
    } else {
      // In a real app, you'd hash the password here before saving.
      console.warn("Saving password in plaintext. This is insecure and should not be used in production.");
      addUser(data);
      toast({ title: 'User Added', description: `${data.name} has been added.` });
    }
    setIsUserFormOpen(false);
  };

  const handleSaveRole = (data) => {
    if (data.id) {
      updateRole(data);
      toast({ title: 'Role Updated', description: `${data.name} has been updated.` });
    } else {
      addRole(data);
      toast({ title: 'Role Added', description: `${data.name} has been added.` });
    }
    setIsRoleFormOpen(false);
  };
  
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setIsRoleFormOpen(true);
  };

  const handleAction = (title) => {
    toast({
      title,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const filteredUsers = useMemo(() => (users || []).filter(user => 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [users, searchTerm]);
  
  const filteredRoles = useMemo(() => (roles || []).filter(role => 
    role.name && role.name.toLowerCase().includes(searchTerm.toLowerCase())
  ), [roles, searchTerm]);


  return (
    <>
      <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
        <DialogContent className="glass-effect max-w-2xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedUser ? 'Edit' : 'Add'} User</DialogTitle>
          </DialogHeader>
          <UserForm user={selectedUser} onSave={handleSaveUser} onCancel={() => setIsUserFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isRoleFormOpen} onOpenChange={setIsRoleFormOpen}>
        <DialogContent className="glass-effect max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedRole ? 'Edit' : 'Add'} Role</DialogTitle>
          </DialogHeader>
          <RoleForm role={selectedRole} onSave={handleSaveRole} onCancel={() => setIsRoleFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <ConfirmationDialog 
        open={dialogState.open}
        onOpenChange={(open) => setDialogState({...dialogState, open})}
        onConfirm={handleConfirmDelete}
        title={`Are you sure you want to delete this ${dialogState.type}?`}
        description="This action cannot be undone."
      />

      <h2 className="text-2xl font-bold text-white">User & Role Management</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
            <TabsList>
                <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" />Users</TabsTrigger>
                <TabsTrigger value="roles"><Shield className="mr-2 h-4 w-4" />Roles</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleAction('Import')}><Upload className="h-4 w-4 mr-2"/>Import</Button>
                <Button variant="outline" onClick={() => handleAction('Export')}><Download className="h-4 w-4 mr-2"/>Export</Button>
                <Button onClick={() => {
                    if(activeTab === 'users') {
                        setSelectedUser(null);
                        setIsUserFormOpen(true);
                    } else {
                        setSelectedRole(null);
                        setIsRoleFormOpen(true);
                    }
                }}><Plus className="h-4 w-4 mr-2" />Add {activeTab === 'users' ? 'User' : 'Role'}</Button>
            </div>
        </div>
        
        <div className="relative w-full mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder={`Search ${activeTab}...`} className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <TabsContent value="users">
            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle className="text-white">Users ({filteredUsers.length})</CardTitle>
                    <CardDescription>Manage user accounts and permissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-card/50">
                                <div>
                                    <p className="font-medium text-white">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant="secondary">{user.role}</Badge>
                                    <Badge className={user.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}>{user.status}</Badge>
                                    <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}><Edit className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" onClick={() => openConfirmation('user', user.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="roles">
            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle className="text-white">Roles ({filteredRoles.length})</CardTitle>
                    <CardDescription>Define roles and their permissions across the application.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="space-y-4">
                        {(filteredRoles || []).map(role => (
                            <div key={role.id} className="flex items-center justify-between p-3 rounded-lg bg-card/50">
                                <div>
                                    <p className="font-medium text-white">{role.name}</p>
                                    <p className="text-sm text-muted-foreground">{role.description || "No description"}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditRole(role)}><Edit className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" onClick={() => openConfirmation('role', role.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default UsersRolesTab;