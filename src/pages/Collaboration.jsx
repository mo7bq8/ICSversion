import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessagesSquare, Bell, CheckSquare } from 'lucide-react';
import PagePlaceholder from '@/components/PagePlaceholder';

const Collaboration = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Collaboration Center</h1>
        <p className="text-gray-400 mt-2">Discuss, track, and manage architectural changes.</p>
      </div>
      <Card className="glass-effect">
        <CardContent className="p-6">
          <Tabs defaultValue="discussions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="discussions"><MessagesSquare className="mr-2 h-4 w-4"/>Discussions</TabsTrigger>
              <TabsTrigger value="tasks"><CheckSquare className="mr-2 h-4 w-4"/>Tasks & Approvals</TabsTrigger>
              <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4"/>Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="discussions" className="mt-4">
              <PagePlaceholder 
                icon={MessagesSquare} 
                title="Discussions" 
                description="Comment on any architecture object. This feature is under construction." 
              />
            </TabsContent>
            <TabsContent value="tasks" className="mt-4">
              <PagePlaceholder 
                icon={CheckSquare} 
                title="Tasks & Approvals" 
                description="Manage tasks and approval workflows. This feature is under construction." 
              />
            </TabsContent>
            <TabsContent value="notifications" className="mt-4">
              <PagePlaceholder 
                icon={Bell} 
                title="Notifications" 
                description="Stay updated with real-time alerts. This feature is under construction." 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Collaboration;