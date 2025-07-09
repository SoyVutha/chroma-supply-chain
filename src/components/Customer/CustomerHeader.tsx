
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CustomerHeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({ cartItemCount, onCartClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">MetalFlow Store</h1>
            <p className="text-sm text-gray-600">Premium Manufacturing Products</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/my-orders')}
              className="flex items-center gap-2"
            >
              <Package size={16} />
              My Orders
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onCartClick}
              className="relative flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              Cart
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            
            <div className="flex items-center gap-2 text-sm">
              <User size={16} />
              <span>{user?.user_metadata?.name || user?.email?.split('@')[0]}</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-1"
            >
              <LogOut size={14} />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
