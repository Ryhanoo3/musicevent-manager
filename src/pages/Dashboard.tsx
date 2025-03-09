
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import EventCard, { EventData } from '@/components/EventCard';
import EventSearch from '@/components/EventSearch';
import EventFilters from '@/components/EventFilters';
import AppSidebar from '@/components/AppSidebar';
import { supabase } from '@/integrations/supabase/client';

// Function to parse query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const query = useQuery();
  const dateFilter = query.get('date');
  
  // Check if user is logged in and fetch events
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      fetchEvents();
    };
    
    checkAuth();
  }, [navigate]);
  
  // Apply date filter from URL if present
  useEffect(() => {
    if (dateFilter) {
      setActiveFilters(prev => ({
        ...prev,
        specificDate: dateFilter
      }));
      
      toast({
        title: "Date Filter Applied",
        description: `Showing events for ${new Date(dateFilter).toLocaleDateString()}`,
      });
    }
  }, [dateFilter, toast]);
  
  // Fetch events from Supabase
  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          name,
          date,
          duration,
          event_rooms(room_name)
        `);
      
      if (error) throw error;

      if (data) {
        // Transform data to match EventData structure
        const formattedEvents: EventData[] = data.map(event => ({
          id: event.id,
          name: event.name,
          date: event.date,
          duration: event.duration,
          rooms: event.event_rooms ? event.event_rooms.map((r: any) => r.room_name) : []
        }));
        
        setEvents(formattedEvents);
        setFilteredEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get user data
  const userDataString = localStorage.getItem('user');
  const userData = userDataString ? JSON.parse(userDataString) : { userName: 'Guest' };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
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
    
    // Apply filters
    if (activeFilters.date) {
      if (activeFilters.date === 'upcoming') {
        result = result.filter(event => new Date(event.date) > new Date());
      } else if (activeFilters.date === 'past') {
        result = result.filter(event => new Date(event.date) < new Date());
      }
    }
    
    // Apply specific date filter if coming from calendar
    if (activeFilters.specificDate) {
      const filterDate = new Date(activeFilters.specificDate);
      result = result.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === filterDate.getDate() &&
               eventDate.getMonth() === filterDate.getMonth() &&
               eventDate.getFullYear() === filterDate.getFullYear();
      });
    }
    
    if (activeFilters.duration) {
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
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse text-gray-500">Loading events...</div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No events match your search or filters.</p>
              <Button 
                className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
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
