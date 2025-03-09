
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppSidebar from '@/components/AppSidebar';
import { supabase } from '@/integrations/supabase/client';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFullName(data.full_name || '');
        setUsername(data.username || '');
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (!user) return;
      
      const updates = {
        id: user.id,
        full_name: fullName,
        username,
        updated_at: new Date()
      };
      
      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });
      
      if (error) throw error;
      
      // Update local storage user data
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.userName = fullName;
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      const updates = {
        id: user.id,
        avatar_url: data.publicUrl,
        updated_at: new Date()
      };
      
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });
      
      if (updateError) throw updateError;
      
      setAvatarUrl(data.publicUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar userName={fullName || 'User'} onLogout={handleLogout} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <Card className="border border-gray-200 shadow-md animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
              <CardDescription>Update your personal information and profile picture</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-2xl">
                        <User size={36} />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="relative">
                    <input
                      style={{ display: 'none' }}
                      type="file"
                      id="single"
                      accept="image/*"
                      onChange={uploadAvatar}
                      disabled={uploading}
                    />
                    <Label
                      htmlFor="single"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer transition-colors"
                    >
                      <Camera size={16} />
                      {uploading ? 'Uploading...' : 'Change Photo'}
                    </Label>
                  </div>
                </div>
                
                <form onSubmit={updateProfile} className="flex-1 w-full">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName || ''}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="transition-shadow focus:shadow-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={username || ''}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a username"
                        className="transition-shadow focus:shadow-sm"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
