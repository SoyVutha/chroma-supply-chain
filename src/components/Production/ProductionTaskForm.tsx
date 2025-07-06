
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Factory, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useERPAuth } from '@/contexts/ERPAuthContext';

interface Product {
  id: string;
  name: string;
}

const ProductionTaskForm: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    product_id: '',
    task_type: '',
    quantity_target: '',
    priority: 'medium',
    notes: '',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useERPAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('production_tasks')
        .insert([{
          product_id: formData.product_id,
          worker_id: user.id,
          task_type: formData.task_type,
          quantity_target: parseInt(formData.quantity_target),
          priority: formData.priority,
          notes: formData.notes || null,
          due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Production task created successfully!",
      });

      setFormData({
        product_id: '',
        task_type: '',
        quantity_target: '',
        priority: 'medium',
        notes: '',
        due_date: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create production task",
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
          <Factory size={20} />
          Create Production Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product_id">Product</Label>
              <Select value={formData.product_id} onValueChange={(value) => handleChange('product_id', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="task_type">Task Type</Label>
              <Select value={formData.task_type} onValueChange={(value) => handleChange('task_type', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="quality_check">Quality Check</SelectItem>
                  <SelectItem value="assembly">Assembly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity_target">Target Quantity</Label>
              <Input
                id="quantity_target"
                name="quantity_target"
                type="number"
                min="1"
                value={formData.quantity_target}
                onChange={(e) => handleChange('quantity_target', e.target.value)}
                required
                placeholder="Enter target quantity"
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
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              name="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Enter any additional notes"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <Plus size={16} className="mr-2" />
            {loading ? 'Creating...' : 'Create Production Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionTaskForm;
