
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AppSidebar from '@/components/AppSidebar';
import { supabase } from '@/integrations/supabase/client';

const AddEvent: React.FC = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [rooms, setRooms] = useState<string[]>([]);
  const [roomInput, setRoomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is logged in and get profile data
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      getProfile(user.id);
    };
    
    getUser();
  }, [navigate]);
  
  const getProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setProfile(data);
        // Update local storage
        localStorage.setItem('user', JSON.stringify({
          userName: data.full_name || data.username,
          isLoggedIn: true
        }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      setLoading(true);
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create an event",
          variant: "destructive"
        });
        return;
      }
      
      // Insert event to Supabase
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          name,
          date,
          duration,
          user_id: user.id
        })
        .select('id')
        .single();
      
      if (eventError) throw eventError;
      
      // Insert rooms
      const roomsToInsert = rooms.map(room => ({
        event_id: event.id,
        room_name: room
      }));
      
      const { error: roomsError } = await supabase
        .from('event_rooms')
        .insert(roomsToInsert);
      
      if (roomsError) throw roomsError;
      
      toast({
        title: "Event Added",
        description: `Successfully added ${name}`,
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar 
        userName={profile?.full_name || 'User'} 
        onLogout={handleLogout}
        avatarUrl={profile?.avatar_url}
      />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 pl-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
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
                    className="transition-all focus:border-blue-400 focus:ring-blue-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    className="transition-all focus:border-blue-400 focus:ring-blue-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input 
                    id="duration" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 2 hours"
                    className="transition-all focus:border-blue-400 focus:ring-blue-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Rooms</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={roomInput}
                      onChange={(e) => setRoomInput(e.target.value)}
                      placeholder="Add a room"
                      className="transition-all focus:border-blue-400 focus:ring-blue-300"
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
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full group hover:bg-blue-200 transition-colors"
                      >
                        {room}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveRoom(room)}
                          className="text-blue-700 group-hover:text-blue-900 hover:bg-blue-300 rounded-full p-0.5"
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
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {loading ? "Creating..." : "Create Event"}
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
