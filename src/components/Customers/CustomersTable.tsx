
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Mail, Phone, Eye } from 'lucide-react';

interface Customer {
  customerId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'new' | 'registered';
  totalOrders: number;
  totalSpent: number;
}

const mockCustomersData: Customer[] = [
  { customerId: 2001, name: 'Acme Manufacturing Corp', email: 'orders@acme.com', phone: '+1-555-0101', address: '123 Industrial Ave, Detroit, MI', type: 'registered', totalOrders: 45, totalSpent: 125000.00 },
  { customerId: 2002, name: 'Global Tech Solutions', email: 'procurement@globaltech.com', phone: '+1-555-0102', address: '456 Tech Park Blvd, Austin, TX', type: 'registered', totalOrders: 23, totalSpent: 67500.50 },
  { customerId: 2003, name: 'Midwest Assembly LLC', email: 'contact@midwestasm.com', phone: '+1-555-0103', address: '789 Factory Rd, Chicago, IL', type: 'new', totalOrders: 2, totalSpent: 3200.00 },
  { customerId: 2004, name: 'Pacific Components Inc', email: 'buyers@pacificcomp.com', phone: '+1-555-0104', address: '321 Harbor St, Seattle, WA', type: 'registered', totalOrders: 67, totalSpent: 198750.25 },
  { customerId: 2005, name: 'Eastern Industrial Group', email: 'orders@eastern-ind.com', phone: '+1-555-0105', address: '654 Mill St, Atlanta, GA', type: 'registered', totalOrders: 34, totalSpent: 89400.75 },
];

const CustomersTable: React.FC = () => {
  const getTypeBadge = (type: string) => {
    const typeConfig = {
      new: { variant: 'secondary' as const, label: 'New Customer' },
      registered: { variant: 'default' as const, label: 'Registered' },
    };
    
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={20} />
          Customer Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Customer ID</th>
                <th className="text-left p-3 font-medium">Company Name</th>
                <th className="text-left p-3 font-medium">Contact</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Orders</th>
                <th className="text-left p-3 font-medium">Total Spent</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCustomersData.map((customer) => (
                <tr key={customer.customerId} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono text-sm">{customer.customerId}</td>
                  <td className="p-3">
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.address}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail size={12} />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone size={12} />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{getTypeBadge(customer.type)}</td>
                  <td className="p-3 font-semibold">{customer.totalOrders}</td>
                  <td className="p-3 font-semibold">${customer.totalSpent.toLocaleString()}</td>
                  <td className="p-3">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye size={14} />
                      View
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

export default CustomersTable;
