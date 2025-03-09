
import React from 'react';
import { LogOut, Plus, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

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

  const initials = getInitials(userName);
  
  // Check if the route is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col items-center py-8 animate-fade-in shadow-md">
      <div className="flex-1 flex flex-col items-center gap-8 w-full">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center gap-3">
          <Avatar 
            className="w-20 h-20 border-4 border-white shadow-lg transition-transform hover:scale-105 duration-300 cursor-pointer"
            onClick={handleGoToSettings}
          >
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={userName} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-2xl">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium text-gray-700">{userName}</span>
        </div>

        {/* Navigation Menu */}
        <div className="w-full px-4 space-y-2">
          <Button 
            variant={isActive('/') ? "default" : "ghost"}
            className={`w-full justify-start text-base ${
              isActive('/') 
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'text-gray-700 hover:bg-gray-100'
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
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={handleAddEvent}
          >
            <Plus size={18} className="mr-2" />
            Add Event
          </Button>
          
          <Button 
            variant={isActive('/settings') ? "default" : "ghost"}
            className={`w-full justify-start text-base ${
              isActive('/settings') 
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'text-gray-700 hover:bg-gray-100'
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
