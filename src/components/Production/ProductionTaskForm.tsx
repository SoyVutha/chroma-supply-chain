
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    quantity_produced: '',
    quality_checked: true,
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
      // Create a production log entry
      const { error } = await supabase
        .from('production_logs')
        .insert([{
          product_id: formData.product_id,
          worker_id: user.id,
          quantity_produced: parseInt(formData.quantity_produced),
          quality_checked: formData.quality_checked
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Production task logged successfully!",
      });

      setFormData({
        product_id: '',
        quantity_produced: '',
        quality_checked: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log production task",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: string | boolean) => {
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
          Log Production Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="quantity_produced">Quantity Produced</Label>
            <Input
              id="quantity_produced"
              name="quantity_produced"
              type="number"
              min="1"
              value={formData.quantity_produced}
              onChange={(e) => handleChange('quantity_produced', e.target.value)}
              required
              placeholder="Enter quantity produced"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="quality_checked"
              checked={formData.quality_checked}
              onChange={(e) => handleChange('quality_checked', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="quality_checked">Quality Check Passed</Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <Plus size={16} className="mr-2" />
            {loading ? 'Logging...' : 'Log Production Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionTaskForm;
