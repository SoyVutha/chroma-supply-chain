
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Package, Plus, Edit, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  created_at: string;
}

const InventoryTable: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');

  useEffect(() => {
    fetchInventory();
    
    // Set up real-time subscription for inventory changes
    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          console.log('Inventory updated, refreshing...');
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filter === 'low_stock') {
      matchesFilter = item.stock_quantity > 0 && item.stock_quantity <= 10;
    } else if (filter === 'out_of_stock') {
      matchesFilter = item.stock_quantity === 0;
    }
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (stockQuantity: number) => {
    if (stockQuantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stockQuantity <= 10) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Low Stock</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Inventory Management</h2>
            <p className="text-gray-600">Track and manage your product inventory</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-gray-600">Track and manage your product inventory</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All Items
          </Button>
          <Button
            variant={filter === 'low_stock' ? 'default' : 'outline'}
            onClick={() => setFilter('low_stock')}
            size="sm"
          >
            Low Stock
          </Button>
          <Button
            variant={filter === 'out_of_stock' ? 'default' : 'outline'}
            onClick={() => setFilter('out_of_stock')}
            size="sm"
          >
            Out of Stock
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package size={20} />
            Inventory Items ({filteredInventory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Stock</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="font-medium">{item.name}</div>
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {item.description || 'No description'}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${item.stock_quantity === 0 ? 'text-red-600' : 
                          item.stock_quantity <= 10 ? 'text-orange-600' : 'text-green-600'}`}>
                          {item.stock_quantity}
                        </span>
                        {item.stock_quantity <= 10 && item.stock_quantity > 0 && (
                          <AlertTriangle size={16} className="text-orange-500" />
                        )}
                        {item.stock_quantity === 0 && (
                          <AlertTriangle size={16} className="text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-2 font-medium">${Number(item.price).toFixed(2)}</td>
                    <td className="p-2">{getStatusBadge(item.stock_quantity)}</td>
                    <td className="p-2">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Edit size={14} />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredInventory.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No products found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryTable;
