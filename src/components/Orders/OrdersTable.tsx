
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Eye, Edit } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customer: 'Acme Manufacturing Corp',
    items: 3,
    total: 245.99,
    status: 'processing',
    date: '2024-01-15'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customer: 'Global Tech Solutions',
    items: 1,
    total: 125.00,
    status: 'shipped',
    date: '2024-01-14'
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customer: 'Midwest Assembly LLC',
    items: 5,
    total: 387.50,
    status: 'pending',
    date: '2024-01-13'
  },
  {
    id: '4',
    orderNumber: 'ORD-004',
    customer: 'Tech Innovators Inc',
    items: 2,
    total: 89.98,
    status: 'delivered',
    date: '2024-01-12'
  }
];

const OrdersTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
      processing: { variant: 'default' as const, label: 'Processing', class: 'bg-blue-100 text-blue-800' },
      shipped: { variant: 'secondary' as const, label: 'Shipped', class: 'bg-purple-100 text-purple-800' },
      delivered: { variant: 'default' as const, label: 'Delivered', class: 'bg-green-100 text-green-800' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled', class: '' }
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.class}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All Orders
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
            size="sm"
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'processing' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('processing')}
            size="sm"
          >
            Processing
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart size={20} />
            Customer Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Order #</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Items</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono font-medium">{order.orderNumber}</td>
                    <td className="p-2">{order.customer}</td>
                    <td className="p-2">{order.items} items</td>
                    <td className="p-2 font-medium">${order.total.toFixed(2)}</td>
                    <td className="p-2">{getStatusBadge(order.status)}</td>
                    <td className="p-2 text-gray-600">{order.date}</td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Eye size={14} />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Edit size={14} />
                          Update
                        </Button>
                      </div>
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

export default OrdersTable;
