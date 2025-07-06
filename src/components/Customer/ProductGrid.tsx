
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  description: string;
  created_at: string;
}

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ searchQuery, selectedCategory, onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    
    // Set up real-time subscription for products
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          console.log('Products updated, refreshing...');
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderStars = (rating: number = 4.5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-200"></div>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src="/placeholder.svg"
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            {product.stock_quantity === 0 && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Out of Stock
              </Badge>
            )}
            {product.stock_quantity > 0 && product.stock_quantity <= 10 && (
              <Badge variant="secondary" className="absolute top-2 right-2 bg-orange-100 text-orange-800">
                Low Stock
              </Badge>
            )}
          </div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars()}
              </div>
              <span className="text-sm text-gray-600">(24)</span>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">{product.description || 'High-quality product'}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                ${Number(product.price).toFixed(2)}
              </span>
              <Button
                onClick={() => onAddToCart(product)}
                disabled={product.stock_quantity === 0}
                className="flex items-center gap-2"
                size="sm"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </Button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Stock: {product.stock_quantity} units
            </div>
          </CardContent>
        </Card>
      ))}
      {filteredProducts.length === 0 && !loading && (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">No products found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
