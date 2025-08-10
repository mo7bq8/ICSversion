import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { 
  Search, Download, Filter, FileImage, FileText, RefreshCw, Settings, Link as LinkIcon, Route, Edit2, Check, X, EyeOff, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import ICSDiagram from '@/components/pages/ICSLevels/ICSDiagram';
import ICSComponentDetails from '@/components/pages/ICSLevels/ICSComponentDetails';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';
import { getAggregatorSyncStatus } from '@/services/ics/aggregator';
import { Textarea } from '@/components/ui/textarea';
import { jsonToCsv } from '@/lib/csvUtils';

const MemoizedICSDiagram = React.memo(ICSDiagram);

const ICSLevels = () => {
  const { 
    aggregatedIcsComponents, 
    aggregatedIcsEdges,
    icsNotes,
    addIcsNotes,
    updateIcsNotes,
    icsZones,
    loading, 
    refreshAggregatedIcsData 
  } = useData();
  const { toast } = useToast();
  const diagramRef = useRef(null);

  const [filters, setFilters] = useState({
    searchTerm: '',
    domain: [],
    zone: [],
    role: [],
    level: [],
    vendor: [],
  });
  
  const [showUnclassified, setShowUnclassified] = useState(true);

  const [viewingComponent, setViewingComponent] = useState(null);
  const [syncStatus, setSyncStatus] = useState({ lastRun: null, processed: 0, unclassified: 0, errors: 0 });
  const [pathTraceNodes, setPathTraceNodes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    setSyncStatus(getAggregatorSyncStatus(aggregatedIcsComponents));
  }, [aggregatedIcsComponents]);

  const uniqueFilterValues = useMemo(() => {
    const domains = new Set();
    const zones = new Set();
    const roles = new Set();
    const levels = new Set();
    const vendors = new Set();
    (aggregatedIcsComponents || []).forEach(c => {
      if (c.domain) domains.add(c.domain);
      if (c.zone) zones.add(c.zone);
      if (c.role) roles.add(c.role);
      if (c.ics_level !== null && c.ics_level !== undefined) levels.add(c.ics_level);
      if (c.vendor) vendors.add(c.vendor);
    });
    return {
      domains: Array.from(domains).sort(),
      zones: Array.from(zones).sort(),
      roles: Array.from(roles).sort(),
      levels: Array.from(levels).sort((a,b) => a-b),
      vendors: Array.from(vendors).sort(),
    };
  }, [aggregatedIcsComponents]);

  const filteredData = useMemo(() => {
    let nodes = aggregatedIcsComponents || [];
    let edges = aggregatedIcsEdges || [];

    if (!showUnclassified) {
        nodes = nodes.filter(c => c.ics_level !== null && c.ics_level !== undefined);
    }
    
    if (filters.searchTerm) {
      nodes = nodes.filter(c => 
        c.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (c.role && c.role.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }
    if (filters.domain.length > 0) nodes = nodes.filter(c => c.domain && filters.domain.includes(c.domain));
    if (filters.zone.length > 0) nodes = nodes.filter(c => c.zone && filters.zone.includes(c.zone));
    if (filters.role.length > 0) nodes = nodes.filter(c => c.role && filters.role.includes(c.role));
    if (filters.level.length > 0) nodes = nodes.filter(c => c.ics_level !== null && filters.level.includes(c.ics_level));
    if (filters.vendor.length > 0) nodes = nodes.filter(c => c.vendor && filters.vendor.includes(c.vendor));
    
    const nodeIds = new Set(nodes.map(n => n.id));
    edges = edges.filter(e => nodeIds.has(e.from_id) && nodeIds.has(e.to_id));

    return { nodes, edges };
  }, [aggregatedIcsComponents, aggregatedIcsEdges, filters, showUnclassified]);
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        const newValues = prev[filterType].includes(value) 
          ? prev[filterType].filter(v => v !== value) 
          : [...prev[filterType], value];
        return { ...prev, [filterType]: newValues };
      }
      return { ...prev, [filterType]: value };
    });
  };

  const clearFilters = () => {
    setFilters({ searchTerm: '', domain: [], zone: [], role: [], level: [], vendor: [] });
    toast({ title: 'Filters Cleared' });
  };

  const handleNodeClick = useCallback((component) => {
    if (pathTraceNodes.length === 1 && pathTraceNodes[0] !== component.id) {
      setPathTraceNodes(prev => [...prev, component.id]);
    } else {
      setViewingComponent(component);
    }
  }, [pathTraceNodes]);

  const handleTogglePathTrace = () => {
    if (pathTraceNodes.length > 0) {
      setPathTraceNodes([]);
      toast({title: "Path Trace Deactivated"});
    } else {
      setPathTraceNodes([]);
      toast({title: "Path Trace Activated", description: "Select two nodes to trace the path between them."});
    }
  };
  
  const handleExport = (format) => {
    if (format === 'json') {
      const dataStr = JSON.stringify(filteredData.nodes, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'ics-diagram-nodes.json';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Export Successful', description: 'Diagram data exported as JSON.' });
      return;
    }
    if (format === 'csv') {
      jsonToCsv(filteredData.nodes, 'ics-diagram-nodes.csv');
      toast({ title: 'Export Successful', description: 'Diagram data exported as CSV.' });
      return;
    }

    const diagramEl = diagramRef.current;
    if (!diagramEl) {
      toast({ title: 'Error', description: 'Diagram element not found.', variant: 'destructive' });
      return;
    }
    toast({ title: "Exporting diagram...", description: "Please wait while we generate the image."});
    toPng(diagramEl, { backgroundColor: 'hsl(var(--background))', pixelRatio: 2, cacheBust: true })
      .then((dataUrl) => {
        if (format === 'png') {
          const link = document.createElement('a');
          link.download = 'ics-diagram.png';
          link.href = dataUrl;
          link.click();
          toast({ title: 'Export Successful', description: 'Diagram exported as PNG.' });
        } else if (format === 'pdf') {
          const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [diagramEl.offsetWidth, diagramEl.offsetHeight] });
          pdf.addImage(dataUrl, 'PNG', 0, 0, diagramEl.offsetWidth, diagramEl.offsetHeight);
          pdf.save('ics-diagram.pdf');
          toast({ title: 'Export Successful', description: 'Diagram exported as PDF.' });
        }
      })
      .catch((err) => {
        toast({ title: 'Export Failed', description: err.message, variant: 'destructive' });
      });
  };

  const handleNoteChange = (note) => {
    if (note.id) {
      updateIcsNotes(note);
    } else {
      addIcsNotes(note);
    }
    setEditingNote(null);
  };
  
  const handleAddNote = (position) => {
    const newNote = {
      note_text: 'New Note',
      target_id: 'canvas',
      target_type: 'node',
      position: position || { x: 200, y: 200 },
    };
    setEditingNote(newNote);
  };
  
  const bandCounts = useMemo(() => {
    const counts = {
      '0-2': 0,
      '3': 0,
      '3.5': 0,
      '4': 0,
      'unclassified': 0,
    };

    filteredData.nodes.forEach(node => {
      const level = node.ics_level;
      if (level === null || level === undefined) {
        counts.unclassified++;
      } else if (level >= 0 && level <= 2) {
        counts['0-2']++;
      } else if (level === 3) {
        counts['3']++;
      } else if (level === 3.5) {
        counts['3.5']++;
      } else if (level >= 4) {
        counts['4']++;
      }
    });

    return counts;
  }, [filteredData.nodes]);

  if (loading) {
    return <div className="text-center p-8">Loading ICS Levels...</div>;
  }

  const FilterPopover = ({ title, options, selected, onValueChange }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline"><Filter className="h-4 w-4 mr-2" />{title} ({selected.length})</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 max-h-80 overflow-y-auto">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Filter by {title}</h4>
          <div className="space-y-1">
            {options.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox id={`${title}-${option}`} checked={selected.includes(option)} onCheckedChange={() => onValueChange(option)} />
                <Label htmlFor={`${title}-${option}`}>{String(option)}</Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <ICSComponentDetails component={viewingComponent} isOpen={!!viewingComponent} onOpenChange={() => setViewingComponent(null)} />
      {editingNote && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-card p-4 rounded-lg shadow-2xl border w-96">
            <h3 className="font-bold mb-2">Edit Note</h3>
            <Textarea 
              defaultValue={editingNote.note_text}
              onBlur={(e) => setEditingNote(prev => ({...prev, note_text: e.target.value}))}
              className="mb-2"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditingNote(null)}>Cancel</Button>
              <Button onClick={() => handleNoteChange(editingNote)}>Save</Button>
            </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ICS Architecture Diagram</h1>
          <p className="text-muted-foreground mt-2">Live, auto-generated visualization of the ISA-95 automation pyramid.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshAggregatedIcsData}><RefreshCw className="h-4 w-4 mr-2" />Rebuild ICS</Button>
          <Link to="/ics-settings"><Button variant="outline"><Settings className="h-4 w-4 mr-2" />Manage & Diagnose</Button></Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Sync Status</CardTitle>
          <CardDescription>
            {syncStatus.lastRun ? `Last successful sync at ${new Date(syncStatus.lastRun).toLocaleString()}` : 'No sync data available.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-around text-center pt-2">
          <div><p className="text-sm text-muted-foreground">Processed</p><p className="text-lg font-bold">{syncStatus.processed}</p></div>
          <div><p className="text-sm text-muted-foreground flex items-center gap-1 justify-center">Unclassified <Link to="/ics-settings" className="text-yellow-400 hover:text-yellow-300"><LinkIcon className="h-3 w-3"/></Link></p><p className="text-lg font-bold text-yellow-400">{syncStatus.unclassified}</p></div>
          <div><p className="text-sm text-muted-foreground">Errors</p><p className="text-lg font-bold text-red-400">{syncStatus.errors}</p></div>
        </CardContent>
      </Card>

      <Card className="flex-grow flex flex-col min-h-[60vh]">
        <div className="p-2 border-b flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-grow">
            <div className="relative flex-grow max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search components..." value={filters.searchTerm} onChange={(e) => handleFilterChange('searchTerm', e.target.value)} className="pl-10" />
            </div>
            <FilterPopover title="Domain" options={uniqueFilterValues.domains} selected={filters.domain} onValueChange={(v) => handleFilterChange('domain', v)} />
            <FilterPopover title="Zone" options={uniqueFilterValues.zones} selected={filters.zone} onValueChange={(v) => handleFilterChange('zone', v)} />
            <FilterPopover title="Role" options={uniqueFilterValues.roles} selected={filters.role} onValueChange={(v) => handleFilterChange('role', v)} />
            <FilterPopover title="Vendor" options={uniqueFilterValues.vendors} selected={filters.vendor} onValueChange={(v) => handleFilterChange('vendor', v)} />
            <Button variant="ghost" onClick={clearFilters} className="text-destructive hover:bg-destructive/10"><X className="h-4 w-4 mr-1"/> Clear Filters</Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch id="show-unclassified" checked={showUnclassified} onCheckedChange={setShowUnclassified} />
              <Label htmlFor="show-unclassified">{showUnclassified ? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4"/>}</Label>
            </div>
            <Button variant={pathTraceNodes.length > 0 ? 'default' : 'outline'} onClick={handleTogglePathTrace}><Route className="h-4 w-4 mr-2" />Trace Path</Button>
            <Button variant="outline" onClick={() => handleAddNote()}><Edit2 className="h-4 w-4 mr-2" />Add Note</Button>
            <Popover>
              <PopoverTrigger asChild><Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button></PopoverTrigger>
              <PopoverContent className="w-48"><div className="grid gap-2">
                  <Button variant="ghost" onClick={() => handleExport('png')}><FileImage className="h-4 w-4 mr-2" />Export as PNG</Button>
                  <Button variant="ghost" onClick={() => handleExport('pdf')}><FileText className="h-4 w-4 mr-2" />Export as PDF</Button>
                  <Button variant="ghost" onClick={() => handleExport('json')}><FileText className="h-4 w-4 mr-2" />Export as JSON</Button>
                  <Button variant="ghost" onClick={() => handleExport('csv')}><FileText className="h-4 w-4 mr-2" />Export as CSV</Button>
              </div></PopoverContent>
            </Popover>
          </div>
        </div>
        <CardContent className="p-0 flex-grow relative">
          {filteredData.nodes.length === 0 && (aggregatedIcsComponents?.length || 0) > 0 ? (
  <div className="text-sm text-muted-foreground px-2 py-2">
    No nodes match current filters. Click <strong>Clear Filters</strong> or enable <strong>Show Unclassified</strong>.
  </div>
) : null}
<MemoizedICSDiagram 
            nodes={filteredData.nodes} 
            edges={filteredData.edges}
            notes={icsNotes}
            onNoteChange={handleNoteChange}
            onNodeClick={handleNodeClick}
            pathTraceNodes={pathTraceNodes}
            diagramRef={diagramRef}
            zones={icsZones}
            showUnclassified={showUnclassified}
            bandCounts={bandCounts}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ICSLevels;
