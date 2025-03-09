
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EventSearchProps {
  onSearch: (term: string) => void;
}

const EventSearch: React.FC<EventSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-3xl gap-2">
      <Input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 border-gray-300 focus:border-blue-400 focus:ring-blue-300 rounded-lg transition-shadow duration-300"
      />
      <Button 
        type="submit" 
        className="bg-gray-700 hover:bg-gray-800 gap-2 transition-all duration-300"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
};

export default EventSearch;
