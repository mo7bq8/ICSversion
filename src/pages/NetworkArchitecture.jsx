import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import VisualizationsTab from '@/components/pages/NetworkArchitecture/VisualizationsTab';
import DataTablesTab from '@/components/pages/NetworkArchitecture/DataTablesTab';
import SecurityTab from '@/components/pages/NetworkArchitecture/SecurityTab';

export default function NetworkArchitecture() {
  const { 
    networkInterfaces, dataFlows, networkComponents, networkDependencies, networkSecurity,
    addNetworkInterfaces, updateNetworkInterfaces, deleteNetworkInterfaces, bulkAddNetworkInterfaces,
    addDataFlows, updateDataFlows, deleteDataFlows, bulkAddDataFlows,
    addNetworkComponents, updateNetworkComponents, deleteNetworkComponents, bulkAddNetworkComponents
  } = useData();
  const { user } = useAuth();
  const { toast } = useToast();

  const canEdit = user && user.role !== 'Viewer';

  const handleSave = (data, type) => {
    const saveMap = {
      'Interface': { add: addNetworkInterfaces, update: updateNetworkInterfaces },
      'Data Flow': { add: addDataFlows, update: updateDataFlows },
      'Network Component': { add: addNetworkComponents, update: updateNetworkComponents },
    };
    const { add, update } = saveMap[type];
    if (data.id) {
      update(data);
      toast({ title: `${type} Updated` });
    } else {
      add(data);
      toast({ title: `${type} Added` });
    }
  };

  const handleDelete = {
    deleteNetworkInterfaces,
    deleteDataFlows,
    deleteNetworkComponents
  };

  const handleBulkAdd = {
    bulkAddNetworkInterfaces,
    bulkAddDataFlows,
    bulkAddNetworkComponents
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Network Architecture</h1>
          <p className="text-muted-foreground mt-2">Map connectivity, data flows, and interfaces between systems.</p>
        </div>
      </div>

      <Tabs defaultValue="visuals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visuals">Visualizations</TabsTrigger>
          <TabsTrigger value="tables">Data Tables</TabsTrigger>
          <TabsTrigger value="security">Security & Dependencies</TabsTrigger>
        </TabsList>
        <TabsContent value="visuals">
          <VisualizationsTab networkInterfaces={networkInterfaces} dataFlows={dataFlows} />
        </TabsContent>
        <TabsContent value="tables">
          <DataTablesTab
            networkInterfaces={networkInterfaces}
            dataFlows={dataFlows}
            networkComponents={networkComponents}
            canEdit={canEdit}
            handleSave={handleSave}
            handleDelete={handleDelete}
            handleBulkAdd={handleBulkAdd}
          />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab 
            networkDependencies={networkDependencies} 
            networkSecurity={networkSecurity}
            canEdit={canEdit} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}