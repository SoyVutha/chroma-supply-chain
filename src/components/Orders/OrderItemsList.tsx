
import React from 'react';

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface OrderItemsListProps {
  items: OrderItem[];
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return <span className="text-gray-500">No items</span>;
  }

  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <div key={index} className="text-sm">
          <span className="font-medium">{item.product_name}</span>
          <span className="text-gray-600"> × {item.quantity}</span>
          <span className="text-gray-500"> (${item.price.toFixed(2)} each)</span>
        </div>
      ))}
    </div>
  );
};

export default OrderItemsList;
