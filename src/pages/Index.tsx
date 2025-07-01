
import React, { useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import InventoryTable from '@/components/Inventory/InventoryTable';
import OrdersTable from '@/components/Orders/OrdersTable';
import ProductionSchedule from '@/components/Production/ProductionSchedule';
import CustomersTable from '@/components/Customers/CustomersTable';
import TicketsTable from '@/components/Support/TicketsTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userRole, setUserRole] = useState<'inventory_manager' | 'production_worker' | 'customer_service'>('inventory_manager');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats userRole={userRole} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userRole === 'inventory_manager' && <InventoryTable />}
              {userRole === 'production_worker' && <ProductionSchedule />}
              {userRole === 'customer_service' && <TicketsTable />}
              <OrdersTable />
            </div>
          </div>
        );
      
      case 'inventory':
        return <InventoryTable />;
      
      case 'orders':
        return <OrdersTable />;
      
      case 'production':
        return <ProductionSchedule />;
      
      case 'customers':
        return <CustomersTable />;
      
      case 'tickets':
        return <TicketsTable />;
      
      case 'products':
      case 'quality':
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">{activeSection}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">This section is under development. More features coming soon!</p>
            </CardContent>
          </Card>
        );
      
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Manufacturing ERP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Select a section from the sidebar to get started.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        userRole={userRole}
      />
      
      <div className="ml-64 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {activeSection === 'dashboard' ? 'Dashboard' : activeSection.replace('_', ' ')}
            </h1>
            <p className="text-gray-600 mt-1">
              Manufacturing ERP System - {userRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Portal
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              <Select value={userRole} onValueChange={(value: any) => setUserRole(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
                  <SelectItem value="production_worker">Production Worker</SelectItem>
                  <SelectItem value="customer_service">Customer Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
