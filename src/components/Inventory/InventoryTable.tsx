
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Package, Plus, Edit, Search } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minStock: number;
  price: number;
  category: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Steel Widget Type A',
    sku: 'SW-001',
    quantity: 150,
    minStock: 50,
    price: 45.99,
    category: 'Steel Components',
    status: 'in_stock'
  },
  {
    id: '2',
    name: 'Aluminum Component B',
    sku: 'AC-002',
    quantity: 23,
    minStock: 30,
    price: 28.50,
    category: 'Aluminum Parts',
    status: 'low_stock'
  },
  {
    id: '3',
    name: 'Plastic Assembly C',
    sku: 'PA-003',
    quantity: 0,
    minStock: 25,
    price: 15.75,
    category: 'Plastic Components',
    status: 'out_of_stock'
  },
  {
    id: '4',
    name: 'Electronic Module D',
    sku: 'EM-004',
    quantity: 89,
    minStock: 20,
    price: 125.00,
    category: 'Electronics',
    status: 'in_stock'
  }
];

const InventoryTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
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
                  <th className="text-left p-2">SKU</th>
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
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </td>
                    <td className="p-2 font-mono text-sm">{item.sku}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${item.quantity === 0 ? 'text-red-600' : 
                          item.quantity <= item.minStock ? 'text-orange-600' : 'text-green-600'}`}>
                          {item.quantity}
                        </span>
                        {item.quantity <= item.minStock && item.quantity > 0 && (
                          <AlertTriangle size={16} className="text-orange-500" />
                        )}
                        {item.quantity === 0 && (
                          <AlertTriangle size={16} className="text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-gray-600">{item.minStock}</td>
                    <td className="p-2 font-medium">${item.price}</td>
                    <td className="p-2">{getStatusBadge(item.status, item.quantity)}</td>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryTable;
