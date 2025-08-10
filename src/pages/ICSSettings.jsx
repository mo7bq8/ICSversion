import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, PlusCircle, Save, AlertTriangle, FileJson } from 'lucide-react';
import IcsZoneForm from '@/components/pages/ICSSettings/IcsZoneForm';
import IcsRuleForm from '@/components/pages/ICSSettings/IcsRuleForm';

const ICSSettings = () => {
  const {
    icsZones,
    addIcsZones,
    updateIcsZones,
    deleteIcsZones,
    icsLevelRules,
    addIcsLevelRules,
    updateIcsLevelRules,
    deleteIcsLevelRules,
    aggregatedIcsComponents,
  } = useData();
  const { toast } = useToast();

  const [editingZone, setEditingZone] = useState(null);
  const [editingRule, setEditingRule] = useState(null);

  const unclassifiedComponents = useMemo(() => {
    return aggregatedIcsComponents.filter(c => c.ics_level === null || c.ics_level === undefined);
  }, [aggregatedIcsComponents]);

  const handleZoneSave = (zone) => {
    if (zone.id) {
      updateIcsZones(zone);
      toast({ title: 'Zone Updated' });
    } else {
      addIcsZones(zone);
      toast({ title: 'Zone Added' });
    }
    setEditingZone(null);
  };

  const handleRuleSave = (rule) => {
    if (rule.id) {
      updateIcsLevelRules(rule);
      toast({ title: 'Rule Updated' });
    } else {
      addIcsLevelRules(rule);
      toast({ title: 'Rule Added' });
    }
    setEditingRule(null);
  };
  
  const downloadJson = (data, filename) => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export Successful', description: `${filename} downloaded.` });
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ICS Settings & Diagnostics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Zones</CardTitle>
            <CardDescription>Define the network zones used for ICS level classification.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {icsZones.map(zone => (
                <div key={zone.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                  <span>{zone.name}</span>
                  <div className="space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingZone(zone)}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteIcsZones(zone.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4" onClick={() => setEditingZone({})}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Zone
            </Button>
            {editingZone && <IcsZoneForm zone={editingZone} onSave={handleZoneSave} onCancel={() => setEditingZone(null)} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Classification Rules</CardTitle>
            <CardDescription>Define rules to automatically assign ICS levels based on component properties.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {icsLevelRules.sort((a,b) => a.priority - b.priority).map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                  <span className="font-mono text-xs bg-gray-700 text-white px-2 py-1 rounded-full mr-2">{rule.priority}</span>
                  <span>{rule.name}</span>
                  <div className="space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingRule(rule)}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteIcsLevelRules(rule.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4" onClick={() => setEditingRule({ priority: (icsLevelRules.length + 1) * 10, is_enabled: true })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Rule
            </Button>
            {editingRule && <IcsRuleForm rule={editingRule} onSave={handleRuleSave} onCancel={() => setEditingRule(null)} zones={icsZones} />}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-yellow-400" />Diagnostics: Unclassified Components</CardTitle>
          <CardDescription>These components could not be automatically assigned an ICS level. Review them or add new rules to classify them.</CardDescription>
        </CardHeader>
        <CardContent>
            {unclassifiedComponents.length === 0 ? (
                <p>All components have been successfully classified. Well done!</p>
            ) : (
                <div className="max-h-96 overflow-y-auto pr-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">Name</th>
                                <th className="text-left p-2">Source Type</th>
                                <th className="text-left p-2">Role</th>
                                <th className="text-left p-2">Reason</th>
                                <th className="text-left p-2">Payload</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unclassifiedComponents.map(c => (
                                <tr key={c.id} className="border-b hover:bg-muted">
                                    <td className="p-2 font-semibold">{c.name}</td>
                                    <td className="p-2">{c.source_type}</td>
                                    <td className="p-2">{c.role}</td>
                                    <td className="p-2 text-destructive">{c.unclassifiedReason}</td>
                                    <td className="p-2">
                                        <Button variant="ghost" size="icon" onClick={() => downloadJson(c, `${c.name}_payload.json`)}>
                                            <FileJson className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ICSSettings;
