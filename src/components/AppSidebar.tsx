
import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Home, Settings, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface AppSidebarProps {
  userName?: string;
  onLogout: () => void;
  avatarUrl?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ 
  userName = "User", 
  onLogout,
  avatarUrl
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [eventDates, setEventDates] = useState<Date[]>([]);

  // Fetch event dates from Supabase
  useEffect(() => {
    const fetchEventDates = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('date');
        
        if (error) throw error;
        
        if (data) {
          // Convert string dates to Date objects
          const dates = data.map(event => new Date(event.date));
          setEventDates(dates);
        }
      } catch (error) {
        console.error('Error fetching event dates:', error);
      }
    };
    
    fetchEventDates();
  }, []);

  const handleAddEvent = () => {
    navigate('/add-event');
    toast({
      title: "Add Event",
      description: "Create a new event",
    });
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const handleGoToSettings = () => {
    navigate('/settings');
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Helper to check if a date has events
  const hasEvent = (date: Date) => {
    return eventDates.some(eventDate => 
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  };

  // Handle date selection in calendar
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && hasEvent(date)) {
      // Navigate to dashboard with date filter
      navigate(`/?date=${format(date, 'yyyy-MM-dd')}`);
      toast({
        title: "Date Selected",
        description: `Showing events for ${format(date, 'MMMM dd, yyyy')}`,
      });
    }
  };

  const initials = getInitials(userName);
  
  // Check if the route is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 min-h-screen bg-scheme-dominant border-r border-scheme-accent/20 flex flex-col items-center py-8 animate-fade-in shadow-md">
      <div className="flex-1 flex flex-col items-center gap-8 w-full">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center gap-3">
          <Avatar 
            className="w-20 h-20 border-4 border-scheme-secondary shadow-lg transition-transform hover:scale-105 duration-300 cursor-pointer"
            onClick={handleGoToSettings}
          >
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={userName} />
            ) : (
              <AvatarFallback className="bg-scheme-secondary text-scheme-dominant text-2xl">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium text-scheme-accent">{userName}</span>
        </div>

        {/* Navigation Menu */}
        <div className="w-full px-4 space-y-2">
          <Button 
            variant={isActive('/') ? "default" : "ghost"}
            className={`w-full justify-start text-base ${
              isActive('/') 
                ? 'bg-scheme-secondary hover:bg-scheme-secondary/90 text-scheme-dominant'
                : 'text-scheme-accent hover:bg-scheme-dominant/80 hover:text-scheme-secondary'
            }`}
            onClick={handleGoHome}
          >
            <Home size={18} className="mr-2" />
            Dashboard
          </Button>
          
          <Button 
            variant={isActive('/add-event') ? "default" : "ghost"}
            className={`w-full justify-start text-base ${
              isActive('/add-event') 
                ? 'bg-scheme-secondary hover:bg-scheme-secondary/90 text-scheme-dominant'
                : 'text-scheme-accent hover:bg-scheme-dominant/80 hover:text-scheme-secondary'
            }`}
            onClick={handleAddEvent}
          >
            <Plus size={18} className="mr-2" />
            Add Event
          </Button>
          
          {/* Calendar Button & Popover */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost"
                className="w-full justify-start text-base text-scheme-accent hover:bg-scheme-dominant/80 hover:text-scheme-secondary"
                onClick={() => setIsCalendarOpen(true)}
              >
                <CalendarIcon size={18} className="mr-2" />
                Calendar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-scheme-dominant border border-scheme-accent/20" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="p-3 pointer-events-auto text-scheme-accent"
                components={{
                  DayContent: ({ date }) => (
                    <div className="relative">
                      {date.getDate()}
                      {hasEvent(date) && (
                        <Badge 
                          className="absolute top-0 right-0 w-2 h-2 p-0 bg-scheme-secondary rounded-full"
                          aria-label="This date has events"
                        />
                      )}
                    </div>
                  ),
                }}
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            variant={isActive('/settings') ? "default" : "ghost"}
            className={`w-full justify-start text-base ${
              isActive('/settings') 
                ? 'bg-scheme-secondary hover:bg-scheme-secondary/90 text-scheme-dominant'
                : 'text-scheme-accent hover:bg-scheme-dominant/80 hover:text-scheme-secondary'
            }`}
            onClick={handleGoToSettings}
          >
            <Settings size={18} className="mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Logout Button */}
      <Button 
        variant="destructive" 
        className="mt-auto w-4/5 gap-2 transition-all duration-300 hover:shadow-md"
        onClick={onLogout}
      >
        <LogOut size={18} />
        <span>LOG OUT</span>
      </Button>
    </div>
  );
};

export default AppSidebar;
