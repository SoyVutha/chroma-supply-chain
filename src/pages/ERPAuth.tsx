
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useERPAuth } from '@/contexts/ERPAuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle } from 'lucide-react';

const ERPAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, user, userRole, setUserRole } = useERPAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/erp');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up new ERP worker
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              user_type: 'worker',
              role: userRole
            },
            emailRedirectTo: `${window.location.origin}/erp`
          }
        });

        if (error) {
          toast({
            title: "Sign Up Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success",
            description: "Please check your email to confirm your account",
            variant: "default"
          });
          setIsSignUp(false);
        }
      } else {
        // Sign in existing user
        const result = await signIn(email, password);

        if (result.error) {
          // Check if error is due to non-ERP user
          if (result.error.message.includes('Invalid login credentials')) {
            toast({
              title: "Access Denied",
              description: "Only ERP staff members can access this system. If you're a customer, please use the main store.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Authentication Error",
              description: result.error.message,
              variant: "destructive"
            });
          }
        } else {
          navigate('/erp');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Metaflow ERP</h1>
          <p className="text-gray-600">Staff Access Portal</p>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This system is restricted to authorized ERP staff only. Customers should use the main store interface.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <Tabs value={isSignUp ? 'signup' : 'signin'} onValueChange={(value) => setIsSignUp(value === 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <CardTitle>Staff Sign In</CardTitle>
                <CardDescription>
                  Access the ERP system with your staff credentials
                </CardDescription>
              </TabsContent>
              
              <TabsContent value="signup">
                <CardTitle>Staff Registration</CardTitle>
                <CardDescription>
                  Create a new ERP staff account
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="role">Your Role</Label>
                <Select value={userRole} onValueChange={(value: any) => setUserRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
                    <SelectItem value="customer_service">Customer Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isSignUp && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your work email"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create ERP Account' : 'Sign In to ERP')}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-gray-600"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ERPAuth;
