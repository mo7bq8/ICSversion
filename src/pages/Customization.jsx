import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Share2, Workflow } from 'lucide-react';
import PagePlaceholder from '@/components/PagePlaceholder';

const Customization = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Customization Center</h1>
        <p className="text-gray-400 mt-2">Extend and tailor the EA platform to your needs.</p>
      </div>
      <Card className="glass-effect">
        <CardContent className="p-6">
          <Tabs defaultValue="schemas" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schemas"><Share2 className="mr-2 h-4 w-4"/>Data Schemas (Metamodel)</TabsTrigger>
              <TabsTrigger value="views"><Palette className="mr-2 h-4 w-4"/>Visualization Templates</TabsTrigger>
              <TabsTrigger value="workflows"><Workflow className="mr-2 h-4 w-4"/>Workflows</TabsTrigger>
            </TabsList>
            <TabsContent value="schemas" className="mt-4">
              <PagePlaceholder 
                icon={Share2} 
                title="Data Schema Customization" 
                description="This feature is under construction. Soon you'll be able to extend the metamodel." 
              />
            </TabsContent>
            <TabsContent value="views" className="mt-4">
              <PagePlaceholder 
                icon={Palette} 
                title="Visualization Templates" 
                description="This feature is under construction. Custom views and dashboards are coming." 
              />
            </TabsContent>
            <TabsContent value="workflows" className="mt-4">
              <PagePlaceholder 
                icon={Workflow} 
                title="Workflow Editor" 
                description="This feature is under construction. Design custom approval and notification workflows soon." 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customization;