import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ICSComponentDetails = ({ component, isOpen, onOpenChange }) => {
  if (!component) return null;

  const getSourceLink = (comp) => {
    // Maps source_type to the correct route path
    const sourceMap = {
        'Applications': '/applications',
        'Technologies': '/technology',
        'Infrastructure': '/infrastructure',
        'Security': '/security',
        'Network': '/network',
        'Data': '/data-architecture',
    };
    const basePath = sourceMap[comp.source_type] || `/${comp.source_type.toLowerCase()}`;
    return basePath;
  };

  const downloadJson = () => {
    const dataStr = JSON.stringify(component.source_data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${component.name}_source_data.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{component.name}</DialogTitle>
          <DialogDescription>{component.role} - from {component.source_type}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-3 items-start gap-4">
            <span className="text-right font-semibold">ICS Level</span>
            <span className="col-span-2">{component.ics_level ?? <Badge variant="destructive">Unclassified</Badge>}</span>
          </div>
          {component.ics_level === null && (
          <div className="grid grid-cols-3 items-start gap-4">
            <span className="text-right font-semibold text-destructive">Reason</span>
            <span className="col-span-2 text-destructive">{component.unclassifiedReason}</span>
          </div>
          )}
          <div className="grid grid-cols-3 items-start gap-4">
            <span className="text-right font-semibold">Domain</span>
            <span className="col-span-2">{component.domain || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <span className="text-right font-semibold">Zone</span>
            <span className="col-span-2">{component.zone || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <span className="text-right font-semibold">Vendor</span>
            <span className="col-span-2">{component.vendor || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <span className="text-right font-semibold">Tags</span>
            <div className="col-span-2 flex flex-wrap gap-1">
              {(component.tags || []).map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
              {(!component.tags || component.tags.length === 0) && 'No tags'}
            </div>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <span className="text-right font-semibold">Source</span>
            <div className="col-span-2">
              <a href={getSourceLink(component)} className="text-primary hover:underline flex items-center gap-1" onClick={(e) => { e.preventDefault(); alert("Deep linking to source records is not yet implemented."); }}>
                <LinkIcon className="h-4 w-4" />
                View in {component.source_type}
              </a>
            </div>
          </div>
           <div className="grid grid-cols-3 items-start gap-4">
            <span className="text-right font-semibold">Raw Data</span>
            <div className="col-span-2">
                <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 max-h-60 overflow-y-auto">
                  <code className="text-white">{JSON.stringify(component.source_data, null, 2)}</code>
                </pre>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={downloadJson}>Download Source Data (JSON)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ICSComponentDetails;
