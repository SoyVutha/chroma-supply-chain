
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  description?: string;
  created_at: string;
}

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  searchQuery, 
  selectedCategory, 
  onAddToCart 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gt('stock_quantity', 0) // Only show products in stock
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Set up real-time subscription for product changes from ERP
    const channel = supabase
      .channel('product-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        () => {
          console.log('Product updated from ERP, refreshing...');
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Simple category filtering based on product name
    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      matchesCategory = product.name.toLowerCase().includes(selectedCategory.toLowerCase());
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    if (product.stock_quantity > 0) {
      onAddToCart(product);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      });
    } else {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-4">No products found</p>
        <p className="text-gray-500">Try adjusting your search or category filter</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
            <div className="text-6xl text-blue-500 opacity-50">📦</div>
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={16} fill="currentColor" />
                <span className="text-sm text-gray-600">4.5</span>
              </div>
            </div>
            
            {product.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            )}
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-2xl font-bold text-blue-600">${product.price}</span>
              <Badge variant={product.stock_quantity > 10 ? "default" : "secondary"}>
                {product.stock_quantity} in stock
              </Badge>
            </div>
            
            <Button 
              onClick={() => handleAddToCart(product)}
              className="w-full flex items-center gap-2"
              disabled={product.stock_quantity === 0}
            >
              <ShoppingCart size={16} />
              {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
