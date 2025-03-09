
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AppSidebar from '@/components/AppSidebar';

const AddEvent: React.FC = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [rooms, setRooms] = useState<string[]>([]);
  const [roomInput, setRoomInput] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get user from local storage
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
  
  const handleAddRoom = () => {
    if (roomInput.trim() !== '' && !rooms.includes(roomInput.trim())) {
      setRooms([...rooms, roomInput.trim()]);
      setRoomInput('');
    }
  };
  
  const handleRemoveRoom = (roomToRemove: string) => {
    setRooms(rooms.filter(room => room !== roomToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !date || !duration || rooms.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save the event to a database
    toast({
      title: "Event Added",
      description: `Successfully added ${name}`,
    });
    
    navigate('/');
  };
  
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar userName={userData.userName} onLogout={handleLogout} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 pl-0"
            onClick={() => navigate('/')}
          >
            <ChevronLeft size={18} className="mr-1" />
            Back to Dashboard
          </Button>
          
          <Card className="border border-gray-200 shadow-md animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Add New Event</CardTitle>
              <CardDescription>Fill in the details to create a new music event</CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter event name"
                    className="transition-shadow focus:shadow-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    className="transition-shadow focus:shadow-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input 
                    id="duration" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 2 hours"
                    className="transition-shadow focus:shadow-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Rooms</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={roomInput}
                      onChange={(e) => setRoomInput(e.target.value)}
                      placeholder="Add a room"
                      className="transition-shadow focus:shadow-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRoom();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddRoom}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rooms.map((room, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                      >
                        {room}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveRoom(room)}
                          className="text-blue-700 hover:text-blue-900"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                  >
                    Create Event
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddEvent;
