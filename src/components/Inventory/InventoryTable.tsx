
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Edit, AlertTriangle } from 'lucide-react';

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

const mockInventoryData: InventoryItem[] = [
  { id: '1', productId: 'PRD-001', productName: 'Steel Widget Type A', quantity: 150, location: 'Warehouse A-1', status: 'in_stock', lastUpdated: '2024-01-15' },
  { id: '2', productId: 'PRD-002', productName: 'Aluminum Component B', quantity: 23, location: 'Warehouse A-2', status: 'low_stock', lastUpdated: '2024-01-15' },
  { id: '3', productId: 'PRD-003', productName: 'Plastic Assembly C', quantity: 0, location: 'Warehouse B-1', status: 'out_of_stock', lastUpdated: '2024-01-14' },
  { id: '4', productId: 'PRD-004', productName: 'Electronic Module D', quantity: 89, location: 'Warehouse B-2', status: 'in_stock', lastUpdated: '2024-01-15' },
  { id: '5', productId: 'PRD-005', productName: 'Rubber Gasket E', quantity: 15, location: 'Warehouse C-1', status: 'low_stock', lastUpdated: '2024-01-15' },
];

const InventoryTable: React.FC = () => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      in_stock: { variant: 'default' as const, label: 'In Stock' },
      low_stock: { variant: 'secondary' as const, label: 'Low Stock' },
      out_of_stock: { variant: 'destructive' as const, label: 'Out of Stock' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package size={20} />
          Inventory Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Product ID</th>
                <th className="text-left p-3 font-medium">Product Name</th>
                <th className="text-left p-3 font-medium">Quantity</th>
                <th className="text-left p-3 font-medium">Location</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Last Updated</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockInventoryData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono text-sm">{item.productId}</td>
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {item.quantity}
                      {item.status === 'low_stock' && <AlertTriangle size={16} className="text-yellow-600" />}
                      {item.status === 'out_of_stock' && <AlertTriangle size={16} className="text-red-600" />}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{item.location}</td>
                  <td className="p-3">{getStatusBadge(item.status)}</td>
                  <td className="p-3 text-sm text-gray-600">{item.lastUpdated}</td>
                  <td className="p-3">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Edit size={14} />
                      Update
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

export default InventoryTable;
