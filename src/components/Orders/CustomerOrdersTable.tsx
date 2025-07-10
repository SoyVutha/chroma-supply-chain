
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderWithDetails {
  id: string;
  created_at: string;
  status: string;
  customer: {
    name: string;
    email: string;
  };
  items: {
    product_name: string;
    quantity: number;
    price: number;
  }[];
  total_amount: number;
}

const CustomerOrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      // Fetch orders with customer and order items data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          customer_id,
          customers(name, email),
          order_items(
            quantity,
            price,
            products(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Transform the data to match our interface
      const transformedOrders: OrderWithDetails[] = (ordersData || []).map(order => ({
        id: order.id,
        created_at: order.created_at,
        status: order.status,
        customer: {
          name: order.customers?.name || 'Unknown Customer',
          email: order.customers?.email || 'Unknown Email'
        },
        items: (order.order_items || []).map(item => ({
          product_name: item.products?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: (order.order_items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0)
      }));

      setOrders(transformedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load customer orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('customer-orders-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'order_items' },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredOrders = orders.filter(order =>
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
      processing: { variant: 'default' as const, label: 'Processing', class: 'bg-blue-100 text-blue-800' },
      completed: { variant: 'default' as const, label: 'Completed', class: 'bg-green-100 text-green-800' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled', class: '' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.class}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading customer orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Customer Orders</h2>
          <p className="text-gray-600">View and manage all customer orders</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart size={20} />
            Customer Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Order ID</th>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium">Items</th>
                  <th className="text-left p-3 font-medium">Total</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <div className="font-mono text-sm">{order.id.substring(0, 8)}</div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-gray-600">{order.customer.email}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        {order.items.map((item, index) => (
                          <div key={index}>
                            {item.product_name} × {item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">${order.total_amount.toFixed(2)}</div>
                    </td>
                    <td className="p-3">{getStatusBadge(order.status)}</td>
                    <td className="p-3 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye size={14} />
                        View Details
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

export default CustomerOrdersTable;
