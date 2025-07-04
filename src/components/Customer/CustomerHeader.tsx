
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CustomerHeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({ cartItemCount, onCartClick }) => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">ManufacturingStore</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Products</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Categories</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">About</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Contact</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
              <User size={18} />
              Login
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCartClick}
              className="relative flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
              Cart
            </Button>

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu size={18} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
