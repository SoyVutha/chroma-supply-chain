
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Headphones, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useERPAuth } from '@/contexts/ERPAuthContext';

interface Customer {
  id: string;
  name: string;
  email: string;
}

const CustomerInteractionForm: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    interaction_type: '',
    subject: '',
    description: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useERPAuth();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('customer_interactions')
        .insert([{
          customer_id: formData.customer_id,
          staff_id: user.id,
          interaction_type: formData.interaction_type,
          subject: formData.subject,
          description: formData.description,
          priority: formData.priority
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer interaction logged successfully!",
      });

      setFormData({
        customer_id: '',
        interaction_type: '',
        subject: '',
        description: '',
        priority: 'medium'
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log customer interaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones size={20} />
          Log Customer Interaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_id">Customer</Label>
              <Select value={formData.customer_id} onValueChange={(value) => handleChange('customer_id', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interaction_type">Interaction Type</Label>
              <Select value={formData.interaction_type} onValueChange={(value) => handleChange('interaction_type', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select interaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="support_call">Support Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="order_inquiry">Order Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                required
                placeholder="Enter interaction subject"
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              placeholder="Describe the customer interaction"
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <Plus size={16} className="mr-2" />
            {loading ? 'Logging...' : 'Log Interaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerInteractionForm;
