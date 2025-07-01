
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye, Package } from 'lucide-react';

interface Order {
  orderId: number;
  customerId: number;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: number;
}

const mockOrdersData: Order[] = [
  { orderId: 1001, customerId: 2001, orderDate: '2024-01-15', status: 'pending', total: 1250.00, items: 3 },
  { orderId: 1002, customerId: 2002, orderDate: '2024-01-15', status: 'processing', total: 750.50, items: 2 },
  { orderId: 1003, customerId: 2003, orderDate: '2024-01-14', status: 'shipped', total: 2100.75, items: 5 },
  { orderId: 1004, customerId: 2004, orderDate: '2024-01-14', status: 'delivered', total: 425.00, items: 1 },
  { orderId: 1005, customerId: 2005, orderDate: '2024-01-13', status: 'processing', total: 1875.25, items: 4 },
];

const OrdersTable: React.FC = () => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      processing: { variant: 'default' as const, label: 'Processing' },
      shipped: { variant: 'outline' as const, label: 'Shipped' },
      delivered: { variant: 'default' as const, label: 'Delivered' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart size={20} />
          Order Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Order ID</th>
                <th className="text-left p-3 font-medium">Customer ID</th>
                <th className="text-left p-3 font-medium">Order Date</th>
                <th className="text-left p-3 font-medium">Items</th>
                <th className="text-left p-3 font-medium">Total</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockOrdersData.map((order) => (
                <tr key={order.orderId} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono text-sm">#{order.orderId}</td>
                  <td className="p-3 font-mono text-sm">{order.customerId}</td>
                  <td className="p-3 text-sm text-gray-600">{order.orderDate}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Package size={14} className="text-gray-500" />
                      {order.items}
                    </div>
                  </td>
                  <td className="p-3 font-semibold">${order.total.toFixed(2)}</td>
                  <td className="p-3">{getStatusBadge(order.status)}</td>
                  <td className="p-3">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye size={14} />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersTable;
