
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/');
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isRegister) {
        // Handle registration
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          toast({
            title: "Registration successful",
            description: "Please check your email to confirm your account",
          });
          
          // Store user data in local storage
          localStorage.setItem('user', JSON.stringify({
            isLoggedIn: true,
            userName: fullName
          }));
          
          navigate('/');
        }
      } else {
        // Handle login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Get user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          // Store user data in local storage
          localStorage.setItem('user', JSON.stringify({
            isLoggedIn: true,
            userName: profileData?.full_name || profileData?.username || 'User'
          }));
          
          toast({
            title: "Login successful",
            description: "Welcome to the Music Event Dashboard",
          });
          
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Set a user-friendly error message
      if (error.message.includes("Invalid login credentials")) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else if (error.message.includes("User already registered")) {
        setErrorMessage("This email is already registered. Please log in instead.");
      } else if (error.message.includes("Email not confirmed")) {
        setErrorMessage("Please check your email and confirm your account before logging in.");
      } else {
        setErrorMessage(error.message || "An error occurred during authentication. Please try again.");
      }
      
      toast({
        title: isRegister ? "Registration failed" : "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md mx-auto animate-fade-in">
        <Card className="shadow-xl border-blue-100">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-blue-700">Music Event Manager</CardTitle>
            <CardDescription>
              {isRegister 
                ? "Create an account to manage your events" 
                : "Enter your credentials to access your dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    type="text" 
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isRegister}
                    className="transition-all focus:border-blue-400 focus:ring-blue-300"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all focus:border-blue-400 focus:ring-blue-300"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isRegister && (
                    <Button variant="link" className="text-sm text-blue-600 p-0 h-auto">
                      Forgot password?
                    </Button>
                  )}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-all focus:border-blue-400 focus:ring-blue-300"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isRegister ? "Creating account..." : "Logging in...") 
                  : (isRegister ? "Register" : "Login")}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              <p>For testing, you can register a new account</p>
              <p>or use any valid email and password combination</p>
            </div>
            
            <Button 
              variant="link" 
              className="text-sm text-blue-600"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMessage(null);
              }}
            >
              {isRegister 
                ? "Already have an account? Login" 
                : "Don't have an account? Register"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
