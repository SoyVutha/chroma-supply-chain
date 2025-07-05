
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, CreditCard, MapPin, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onOrderComplete: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totalPrice,
  onOrderComplete
}) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  if (!isOpen) return null;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    
    // Simulate order processing
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Order Placed Successfully!",
        description: `Your order of $${totalPrice.toFixed(2)} has been confirmed.`,
      });
      onOrderComplete();
      onClose();
      setStep('shipping'); // Reset for next time
    }, 2000);
  };

  const shippingCost = 15.99;
  const tax = totalPrice * 0.08; // 8% tax
  const finalTotal = totalPrice + shippingCost + tax;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-semibold">Checkout</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step === 'shipping' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className={`text-sm ${step === 'shipping' ? 'font-medium' : 'text-gray-500'}`}>
                  Shipping
                </span>
                <div className="flex-1 h-px bg-gray-200" />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`text-sm ${step === 'payment' ? 'font-medium' : 'text-gray-500'}`}>
                  Payment
                </span>
                <div className="flex-1 h-px bg-gray-200" />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <span className={`text-sm ${step === 'review' ? 'font-medium' : 'text-gray-500'}`}>
                  Review
                </span>
              </div>

              {/* Shipping Form */}
              {step === 'shipping' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin size={20} />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            required
                            value={shippingData.fullName}
                            onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={shippingData.email}
                            onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          required
                          value={shippingData.address}
                          onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            required
                            value={shippingData.city}
                            onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            required
                            value={shippingData.zipCode}
                            onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        Continue to Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Payment Form */}
              {step === 'payment' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard size={20} />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required
                          value={paymentData.cardNumber}
                          onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            required
                            value={paymentData.expiryDate}
                            onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            required
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input
                          id="nameOnCard"
                          required
                          value={paymentData.nameOnCard}
                          onChange={(e) => setPaymentData({...paymentData, nameOnCard: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => setStep('shipping')} className="flex-1">
                          Back
                        </Button>
                        <Button type="submit" className="flex-1">
                          Review Order
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Review Step */}
              {step === 'review' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User size={20} />
                      Order Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {shippingData.fullName}<br />
                        {shippingData.address}<br />
                        {shippingData.city}, {shippingData.zipCode}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Payment Method</h4>
                      <p className="text-sm text-gray-600">
                        Card ending in {paymentData.cardNumber.slice(-4)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setStep('payment')} className="flex-1">
                        Back
                      </Button>
                      <Button onClick={handleFinalSubmit} disabled={loading} className="flex-1">
                        {loading ? 'Processing...' : 'Place Order'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;
