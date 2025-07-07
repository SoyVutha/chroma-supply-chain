
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock_quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderComplete: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderComplete
}) => {
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let customerId = null;

      // If user is logged in, use their existing customer record or create one
      if (user) {
        // Check if customer record exists
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          // Create customer record for logged-in user
          const { data: newCustomer, error: customerError } = await supabase
            .from('customers')
            .insert({
              user_id: user.id,
              name: customerInfo.name || user.user_metadata?.name || '',
              email: customerInfo.email || user.email || '',
              registered: true
            })
            .select('id')
            .single();

          if (customerError) throw customerError;
          customerId = newCustomer.id;
        }
      } else {
        // Create guest customer record
        const { data: guestCustomer, error: guestError } = await supabase
          .from('customers')
          .insert({
            name: customerInfo.name,
            email: customerInfo.email,
            registered: false
          })
          .select('id')
          .single();

        if (guestError) throw guestError;
        customerId = guestCustomer.id;
      }

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          customer_user_id: user?.id || null,
          status: 'pending'
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update product stock quantities
      for (const item of cartItems) {
        const { error: stockError } = await supabase
          .from('products')
          .update({ 
            stock_quantity: item.stock_quantity - item.quantity 
          })
          .eq('id', item.id);

        if (stockError) throw stockError;
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id.substring(0, 8)} has been placed.`,
      });

      onOrderComplete();
      onClose();
      
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 font-semibold">
              Total: ${totalAmount.toFixed(2)}
            </div>
          </div>

          {/* Customer Information Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="address">Shipping Address</Label>
              <Input
                id="address"
                type="text"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                required
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
