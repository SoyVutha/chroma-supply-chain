
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
    issue: '',
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
      // Create a support ticket for the customer interaction
      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          customer_id: formData.customer_id,
          issue: `${formData.priority.toUpperCase()} PRIORITY: ${formData.issue}`,
          status: 'Open'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer interaction logged successfully!",
      });

      setFormData({
        customer_id: '',
        issue: '',
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

          <div>
            <Label htmlFor="issue">Issue Description</Label>
            <Textarea
              id="issue"
              name="issue"
              value={formData.issue}
              onChange={(e) => handleChange('issue', e.target.value)}
              required
              placeholder="Describe the customer issue or interaction"
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
