
import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export type FilterOption = {
  id: string;
  label: string;
};

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  onSelect: (option: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, onSelect }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-scheme-dominant/70 border-scheme-accent/20 hover:bg-scheme-dominant hover:border-scheme-secondary text-scheme-accent transition-colors duration-300 min-w-28 justify-between"
        >
          <span>{label}</span>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-scheme-dominant border-scheme-accent/20 rounded-lg w-full min-w-28 animate-slide-down shadow-lg">
        {options.map((option) => (
          <DropdownMenuItem 
            key={option.id} 
            className="cursor-pointer hover:bg-scheme-secondary/10 text-scheme-accent hover:text-scheme-secondary transition-colors"
            onClick={() => onSelect(option.id)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface EventFiltersProps {
  onFilterChange: (filterType: string, value: string) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({ onFilterChange }) => {
  // Filter options
  const dateFilters: FilterOption[] = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'today', label: 'Today' },
    { id: 'this-week', label: 'This Week' },
    { id: 'this-month', label: 'This Month' },
  ];

  const durationFilters: FilterOption[] = [
    { id: 'short', label: 'Short (< 2h)' },
    { id: 'medium', label: 'Medium (2-4h)' },
    { id: 'long', label: 'Long (> 4h)' },
  ];

  const roomFilters: FilterOption[] = [
    { id: 'main-hall', label: 'Main Hall' },
    { id: 'studio-a', label: 'Studio A' },
    { id: 'studio-b', label: 'Studio B' },
    { id: 'lounge', label: 'Lounge' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      <FilterDropdown 
        label="Date" 
        options={dateFilters} 
        onSelect={(value) => onFilterChange('date', value)} 
      />
      <FilterDropdown 
        label="Duration" 
        options={durationFilters} 
        onSelect={(value) => onFilterChange('duration', value)} 
      />
      <FilterDropdown 
        label="Room" 
        options={roomFilters} 
        onSelect={(value) => onFilterChange('room', value)} 
      />
    </div>
  );
};

export default EventFilters;
