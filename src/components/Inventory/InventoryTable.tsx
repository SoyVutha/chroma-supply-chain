
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
  description: string | null;
  price: number;
  stock_quantity: number;
  created_at: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  minStock: number; // We'll calculate this as 20% of initial stock or minimum 10
}

const InventoryTable: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      
      const transformedInventory = (data || []).map(product => ({
        ...product,
        minStock: Math.max(Math.floor(product.stock_quantity * 0.2), 10),
        status: getStockStatus(product.stock_quantity, Math.max(Math.floor(product.stock_quantity * 0.2), 10)) as 'in_stock' | 'low_stock' | 'out_of_stock'
      }));
      
      setInventory(transformedInventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (quantity: number, minStock: number): string => {
    if (quantity === 0) return 'out_of_stock';
    if (quantity <= minStock) return 'low_stock';
    return 'in_stock';
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string, quantity: number) => {
    switch (status) {
      case 'out_of_stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      case 'low_stock':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Low Stock</Badge>;
      default:
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
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Add Product
          </Button>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Min Stock</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          {item.description || 'No description available'}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 font-mono text-sm">{item.id.slice(0, 8)}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${item.stock_quantity === 0 ? 'text-red-600' : 
                          item.stock_quantity <= item.minStock ? 'text-orange-600' : 'text-green-600'}`}>
                          {item.stock_quantity}
                        </span>
                        {item.stock_quantity <= item.minStock && item.stock_quantity > 0 && (
                          <AlertTriangle size={16} className="text-orange-500" />
                        )}
                        {item.stock_quantity === 0 && (
                          <AlertTriangle size={16} className="text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-gray-600">{item.minStock}</td>
                    <td className="p-2 font-medium">${item.price.toFixed(2)}</td>
                    <td className="p-2">{getStatusBadge(item.status, item.stock_quantity)}</td>
                    <td className="p-2">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Edit size={14} />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredInventory.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryTable;
