
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import EventCard, { EventData } from '@/components/EventCard';
import EventSearch from '@/components/EventSearch';
import EventFilters from '@/components/EventFilters';
import AppSidebar from '@/components/AppSidebar';

// Mock data
const MOCK_EVENTS: EventData[] = [
  {
    id: 'EVT-001',
    name: 'Summer Music Festival',
    date: '2023-07-15',
    duration: '8 hours',
    rooms: ['Main Hall', 'Studio A', 'Lounge']
  },
  {
    id: 'EVT-002',
    name: 'Jazz Night',
    date: '2023-07-22',
    duration: '3 hours',
    rooms: ['Studio B']
  },
  {
    id: 'EVT-003',
    name: 'Classical Concert',
    date: '2023-08-05',
    duration: '2 hours',
    rooms: ['Main Hall']
  },
  {
    id: 'EVT-004',
    name: 'Rock Band Showcase',
    date: '2023-08-12',
    duration: '4 hours',
    rooms: ['Studio A', 'Studio B']
  }
];

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>(MOCK_EVENTS);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>(MOCK_EVENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    }
  }, [navigate]);
  
  // Get user data
  const userDataString = localStorage.getItem('user');
  const userData = userDataString ? JSON.parse(userDataString) : { userName: 'Guest' };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);
    
    toast({
      title: "Filter Applied",
      description: `${filterType}: ${value}`,
    });
  };
  
  // Apply filters and search
  useEffect(() => {
    let result = [...events];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(event => 
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters - this is simplified filtering logic
    // In a real app, this would be more sophisticated
    if (activeFilters.date) {
      // Simple filtering example
      if (activeFilters.date === 'upcoming') {
        result = result.filter(event => new Date(event.date) > new Date());
      } else if (activeFilters.date === 'past') {
        result = result.filter(event => new Date(event.date) < new Date());
      }
    }
    
    if (activeFilters.duration) {
      // Simple filtering example
      if (activeFilters.duration === 'short') {
        result = result.filter(event => event.duration.includes('2 hours') || event.duration.includes('1 hour'));
      }
    }
    
    if (activeFilters.room) {
      result = result.filter(event => 
        event.rooms.some(room => room.toLowerCase().includes(activeFilters.room.toLowerCase()))
      );
    }
    
    setFilteredEvents(result);
  }, [events, searchTerm, activeFilters]);
  
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar userName={userData.userName} onLogout={handleLogout} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">EVENT DASHBOARD</h1>
            <p className="text-lg text-gray-700 mb-6">List of events:</p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
              <EventSearch onSearch={handleSearch} />
            </div>
            
            <div className="mb-8">
              <EventFilters onFilterChange={handleFilterChange} />
            </div>
          </div>
          
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No events match your search or filters.</p>
              <Button 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilters({});
                  setFilteredEvents(events);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
