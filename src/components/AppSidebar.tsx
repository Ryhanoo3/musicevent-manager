
import React from 'react';
import { LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AppSidebarProps {
  userName?: string;
  onLogout: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ 
  userName = "PFP", 
  onLogout 
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddEvent = () => {
    navigate('/add-event');
    toast({
      title: "Add Event",
      description: "Create a new event",
    });
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

  return (
    <div className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col items-center py-8 animate-fade-in">
      <div className="flex-1 flex flex-col items-center gap-8 w-full">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center gap-2">
          <div 
            className="w-24 h-24 rounded-full bg-profile-bg text-profile-text flex items-center justify-center text-2xl font-bold shadow-md transition-transform hover:scale-105 duration-300"
          >
            {initials}
          </div>
          <span className="font-medium text-gray-700">{userName}</span>
        </div>

        {/* Add Event Button */}
        <Button 
          className="w-4/5 gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 transition-all duration-300 hover:shadow-md"
          onClick={handleAddEvent}
        >
          <Plus size={18} />
          <span>ADD EVENT</span>
        </Button>
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
