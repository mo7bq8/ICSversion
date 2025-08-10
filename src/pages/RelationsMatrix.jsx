import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Search,
  Save,
  RefreshCw,
  Edit,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';

const relationshipTypes = [
  { id: 'uses', name: 'Uses', color: 'bg-blue-500' },
  { id: 'hosts', name: 'Hosts', color: 'bg-green-500' },
  { id: 'connects', name: 'Connects', color: 'bg-purple-500' },
  { id: 'depends', name: 'Depends On', color: 'bg-orange-500' },
  { id: 'implements', name: 'Implements', color: 'bg-yellow-500' },
  { id: 'secures', name: 'Secures', color: 'bg-red-500' },
];

export default function RelationsMatrix() {
  const { relationNodes, relations, setRelations, saveRelations } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCell, setSelectedCell] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();

  const filteredNodes = relationNodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) || node.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || node.type === filterType;
    return matchesSearch && matchesType;
  });

  const getRelation = (fromId, toId) => relations.find(rel => rel.from === fromId && rel.to === toId);
  const getRelationshipType = (typeId) => relationshipTypes.find(type => type.id === typeId);

  const handleCellClick = (fromId, toId) => {
    if (fromId === toId) return;
    setSelectedCell({ from: fromId, to: toId });
    if (editMode) {
      const existingRelation = getRelation(fromId, toId);
      if (existingRelation) {
        setRelations(prev => prev.filter(rel => !(rel.from === fromId && rel.to === toId)));
      } else {
        setRelations(prev => [...prev, { from: fromId, to: toId, type: 'uses' }]);
      }
    } else {
      toast({ title: "Cell Selected", description: "Enable edit mode to modify relationships. 🚀" });
    }
  };
  
  const toggleEditMode = () => setEditMode(!editMode);

  const handleSaveChanges = () => {
    saveRelations();
    setEditMode(false);
    toast({ title: "Changes Saved", description: "All relationship changes have been saved successfully." });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Relations Matrix</h1>
          <p className="text-gray-400 mt-2">Grid view of all node relationships with real-time editing</p>
        </div>
        <div className="flex gap-2">
          <Button variant={editMode ? "default" : "outline"} onClick={toggleEditMode}><Edit className="h-4 w-4 mr-2" />{editMode ? 'Exit Edit' : 'Edit Mode'}</Button>
          {editMode && <Button onClick={handleSaveChanges} className="bg-gradient-to-r from-blue-600 to-purple-600"><Save className="h-4 w-4 mr-2" />Save Changes</Button>}
        </div>
      </div>

      <Card className="glass-effect">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Search nodes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/></div></div>
            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Node Type" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="Application">Application</SelectItem><SelectItem value="Service">Service</SelectItem><SelectItem value="Technology">Technology</SelectItem><SelectItem value="Business">Business</SelectItem><SelectItem value="Security">Security</SelectItem></SelectContent>
              </Select>
              <Button variant="outline" onClick={() => window.location.reload()}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader><CardTitle className="text-white text-lg">Relationship Types</CardTitle></CardHeader>
        <CardContent><div className="flex flex-wrap gap-3">{relationshipTypes.map((type) => (<Badge key={type.id} className={`${type.color} text-white`}>{type.name}</Badge>))}</div></CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader><CardTitle className="text-white flex items-center gap-2"><Network className="h-5 w-5" />Relations Matrix ({filteredNodes.length} × {filteredNodes.length}){editMode && (<Badge variant="secondary" className="ml-2">Edit Mode Active</Badge>)}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-[60vh] scrollbar-thin">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky top-0 left-0 z-20 bg-slate-800 border border-white/10 p-2 text-gray-300 text-sm min-w-[200px]">From / To</th>
                  {filteredNodes.map((node) => (<th key={node.id} className="sticky top-0 z-10 bg-slate-800 border border-white/10 p-2 text-gray-300 text-xs min-w-[120px] max-w-[120px]"><div className="transform -rotate-45 origin-center whitespace-nowrap">{node.name}</div></th>))}
                </tr>
              </thead>
              <tbody>
                {filteredNodes.map((fromNode) => (
                  <tr key={fromNode.id}>
                    <td className="sticky left-0 z-10 bg-slate-800 border border-white/10 p-2 text-white text-sm font-medium min-w-[200px]"><div className="flex items-center gap-2"><Badge variant="outline" className="text-xs">{fromNode.type}</Badge><span className="truncate">{fromNode.name}</span></div></td>
                    {filteredNodes.map((toNode) => {
                      const relation = getRelation(fromNode.id, toNode.id);
                      const relationshipType = relation ? getRelationshipType(relation.type) : null;
                      const isSelected = selectedCell?.from === fromNode.id && selectedCell?.to === toNode.id;
                      const isDiagonal = fromNode.id === toNode.id;
                      return (
                        <td key={toNode.id} className={`matrix-cell border border-white/10 p-1 text-center cursor-pointer min-w-[120px] max-w-[120px] h-12 ${isDiagonal ? 'bg-gray-600 cursor-not-allowed' : relation ? relationshipType?.color + ' text-white' : 'bg-slate-700 hover:bg-slate-600'} ${isSelected ? 'ring-2 ring-blue-400' : ''} ${editMode ? 'hover:scale-105' : ''}`} onClick={() => handleCellClick(fromNode.id, toNode.id)}>
                          {!isDiagonal && relation && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs font-medium">{relationshipType?.name}</motion.div>)}
                          {isDiagonal && (<div className="text-gray-400 text-xs">—</div>)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}