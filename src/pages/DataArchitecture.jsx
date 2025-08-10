import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import DataDictionaryTable from '@/components/pages/DataArchitecture/DataDictionaryTable';
import DataEntitiesGraph from '@/components/pages/DataArchitecture/DataEntitiesGraph';
import DataFlowDiagram from '@/components/pages/DataArchitecture/DataFlowDiagram';
import DataQualityDashboard from '@/components/pages/DataArchitecture/DataQualityDashboard';
import { GitBranch, Workflow, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const IntegrationsPanel = () => {
    const { toast } = useToast();
    
    const handleButtonClick = (feature) => {
        toast({
            title: "Feature Not Implemented",
            description: `Configuration for ${feature} is not available yet, but you can request it! 🚀`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5" />Integration & Versioning</CardTitle>
                <CardDescription>Manage data synchronization and metadata history.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleButtonClick('REST API')}><Workflow className="mr-2 h-4 w-4"/>Configure REST API</Button>
                <Button variant="outline" onClick={() => handleButtonClick('File Import/Export')}><FileText className="mr-2 h-4 w-4"/>Manual Import/Export</Button>
            </CardContent>
        </Card>
    );
};

export default function DataArchitecture() {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const { dataDictionary, dataEntities, entityRelationships, dataFlows } = useData();

  const qualityMetrics = useMemo(() => {
    if (!dataDictionary || !Array.isArray(dataDictionary)) return { completeness: 0, accuracy: 0, freshness: 0 };
    const total = dataDictionary.length;
    if (total === 0) return { completeness: 0, accuracy: 0, freshness: 0 };
    const completeness = dataDictionary.reduce((sum, item) => sum + (item.qualityMetrics?.completeness || 0), 0) / total;
    const accuracy = dataDictionary.reduce((sum, item) => sum + (item.qualityMetrics?.accuracy || 0), 0) / total;
    const freshness = dataDictionary.reduce((sum, item) => sum + (item.qualityMetrics?.freshness || 0), 0) / total;
    return {
      completeness: Math.round(completeness),
      accuracy: Math.round(accuracy),
      freshness: Math.round(freshness),
    };
  }, [dataDictionary]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Data Architecture</h1>
        <p className="text-muted-foreground mt-2">Interactive dashboard for data entities, flows, quality, and lineage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Completeness</p><p className="text-2xl font-bold text-green-400">{qualityMetrics.completeness}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Accuracy</p><p className="text-2xl font-bold text-yellow-400">{qualityMetrics.accuracy}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Freshness</p><p className="text-2xl font-bold text-blue-400">{qualityMetrics.freshness}%</p></CardContent></Card>
      </div>

      <IntegrationsPanel />

      <Tabs defaultValue="dictionary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dictionary">Data Dictionary</TabsTrigger>
          <TabsTrigger value="graph">Entities Graph</TabsTrigger>
          <TabsTrigger value="flows">Data Flows</TabsTrigger>
          <TabsTrigger value="quality">Quality Dashboard</TabsTrigger>
        </TabsList>
        <TabsContent value="dictionary" className="mt-4">
          <DataDictionaryTable />
        </TabsContent>
        <TabsContent value="graph" className="mt-4">
            <DataEntitiesGraph 
                dataEntities={dataEntities}
                entityRelationships={entityRelationships}
                selectedEntity={selectedEntity} 
                setSelectedEntity={setSelectedEntity} 
            />
        </TabsContent>
        <TabsContent value="flows" className="mt-4">
          <DataFlowDiagram dataFlows={dataFlows} />
        </TabsContent>
        <TabsContent value="quality" className="mt-4">
          <DataQualityDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}