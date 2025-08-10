import React, { useState, useEffect, useCallback } from 'react';
import { usePageState } from '@/contexts/PageStateContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import UsersRolesTab from '@/components/pages/AdminPanel/UsersRolesTab';
import AuthenticationTab from '@/components/pages/AdminPanel/AuthenticationTab';
import SettingsTab from '@/components/pages/AdminPanel/SettingsTab';
import AlertsTab from '@/components/pages/AdminPanel/AlertsTab';
import SystemOperationsTab from '@/components/pages/AdminPanel/SystemOperationsTab';
import ReportingTab from '@/components/pages/AdminPanel/ReportingTab';
import DataSeedingTab from '@/components/pages/AdminPanel/DataSeedingTab';
import { useData } from '@/contexts/DataContext';

const PAGE_KEY = 'adminPanel';

export default function AdminPanel() {
  const { getPageState, setPageState } = usePageState();
  const pageState = getPageState(PAGE_KEY);
  const [activeTab, setActiveTab] = useState(pageState.activeTab || 'usersRoles');
  
  // This is a bit of a hack to force a re-render of the entire app
  const [, setForceUpdate] = useState(0);
  const dataContext = useData();

  const handleSeedingComplete = useCallback(() => {
    // We need to re-initialize data in context. A simple way is to force a re-render from a top-level component.
    // In a real app with more complex state management, this would be handled more gracefully.
    setForceUpdate(c => c + 1); 
    // And also refresh the ICS data
    if(dataContext.refreshAggregatedIcsData) {
      dataContext.refreshAggregatedIcsData();
    }
  }, [dataContext]);

  useEffect(() => {
    setPageState(PAGE_KEY, { activeTab });
  }, [activeTab, setPageState]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">Manage users, roles, settings, and system configuration</p>
        </div>
      </div>
      
      <Card className="glass-effect">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
              <TabsTrigger value="usersRoles">Users & Roles</TabsTrigger>
              <TabsTrigger value="auth">Authentication</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="reporting">Reporting</TabsTrigger>
              <TabsTrigger value="seeding">Data Seeding</TabsTrigger>
            </TabsList>

            <TabsContent value="usersRoles" className="mt-6">
              <UsersRolesTab />
            </TabsContent>

            <TabsContent value="auth" className="mt-6">
              <AuthenticationTab />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <SettingsTab />
            </TabsContent>

            <TabsContent value="alerts" className="mt-6">
              <AlertsTab />
            </TabsContent>
            
            <TabsContent value="system" className="mt-6">
              <SystemOperationsTab />
            </TabsContent>

            <TabsContent value="reporting" className="mt-6">
                <ReportingTab />
            </TabsContent>

            <TabsContent value="seeding" className="mt-6">
                <DataSeedingTab onSeedingComplete={handleSeedingComplete} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}