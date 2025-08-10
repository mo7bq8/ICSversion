import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FilterControls = ({ 
  searchTerm, setSearchTerm,
  filterLifecycle, setFilterLifecycle,
  filterCriticality, setFilterCriticality,
  viewMode, setViewMode
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <Select value={filterLifecycle} onValueChange={setFilterLifecycle}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Lifecycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lifecycle</SelectItem>
            <SelectItem value="Production">Production</SelectItem>
            <SelectItem value="Development">Development</SelectItem>
            <SelectItem value="Testing">Testing</SelectItem>
            <SelectItem value="Deprecated">Deprecated</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterCriticality} onValueChange={setFilterCriticality}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Criticality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Criticality</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          onClick={() => setViewMode('table')}
        >
          Table
        </Button>
        <Button
          variant={viewMode === 'dependency' ? 'default' : 'outline'}
          onClick={() => setViewMode('dependency')}
        >
          Dependencies
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;