
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  inStock: boolean;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Steel Widget Type A',
    price: 89.99,
    category: 'steel',
    rating: 4.5,
    reviews: 24,
    image: '/placeholder.svg',
    description: 'High-grade steel widget perfect for industrial applications',
    inStock: true
  },
  {
    id: '2',
    name: 'Aluminum Component B',
    price: 129.99,
    category: 'aluminum',
    rating: 4.8,
    reviews: 18,
    image: '/placeholder.svg',
    description: 'Lightweight aluminum component with superior durability',
    inStock: true
  },
  {
    id: '3',
    name: 'Plastic Assembly C',
    price: 45.99,
    category: 'plastic',
    rating: 4.2,
    reviews: 35,
    image: '/placeholder.svg',
    description: 'Precision-molded plastic assembly for various applications',
    inStock: false
  },
  {
    id: '4',
    name: 'Electronic Module D',
    price: 199.99,
    category: 'electronic',
    rating: 4.9,
    reviews: 12,
    image: '/placeholder.svg',
    description: 'Advanced electronic module with integrated circuitry',
    inStock: true
  },
  {
    id: '5',
    name: 'Steel Bracket Set',
    price: 34.99,
    category: 'steel',
    rating: 4.3,
    reviews: 28,
    image: '/placeholder.svg',
    description: 'Heavy-duty steel brackets for mounting applications',
    inStock: true
  },
  {
    id: '6',
    name: 'Aluminum Heat Sink',
    price: 75.99,
    category: 'aluminum',
    rating: 4.6,
    reviews: 16,
    image: '/placeholder.svg',
    description: 'Efficient aluminum heat sink for thermal management',
    inStock: true
  }
];

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ searchQuery, selectedCategory, onAddToCart }) => {
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            {!product.inStock && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Out of Stock
              </Badge>
            )}
          </div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-600">({product.reviews})</span>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                ${product.price}
              </span>
              <Button
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
                className="flex items-center gap-2"
                size="sm"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
