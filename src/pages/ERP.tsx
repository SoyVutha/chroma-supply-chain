
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Layout/Sidebar';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import InventoryTable from '@/components/Inventory/InventoryTable';
import OrdersTable from '@/components/Orders/OrdersTable';
import ProductionSchedule from '@/components/Production/ProductionSchedule';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const ERP = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userRole, setUserRole] = useState<'inventory_manager' | 'production_worker' | 'customer_service'>('inventory_manager');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
            <DashboardStats userRole={userRole} />
          </div>
        );
      case 'inventory':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventory Management</h1>
            <InventoryTable />
          </div>
        );
      case 'orders':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Management</h1>
            <OrdersTable />
          </div>
        );
      case 'production':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Production Schedule</h1>
            <ProductionSchedule />
          </div>
        );
      case 'customers':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Management</h1>
            <p className="text-gray-600">Customer management features coming soon...</p>
          </div>
        );
      case 'tickets':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Support Tickets</h1>
            <p className="text-gray-600">Support ticket management coming soon...</p>
          </div>
        );
      case 'quality':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Quality Control</h1>
            <p className="text-gray-600">Quality control features coming soon...</p>
          </div>
        );
      case 'products':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Management</h1>
            <p className="text-gray-600">Product management features coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">User Role</h2>
              <p className="text-gray-600 mb-4">Current role: <span className="font-medium capitalize">{userRole.replace('_', ' ')}</span></p>
              <div className="space-y-2">
                <Button 
                  variant={userRole === 'inventory_manager' ? 'default' : 'outline'}
                  onClick={() => setUserRole('inventory_manager')}
                  className="mr-2"
                >
                  Inventory Manager
                </Button>
                <Button 
                  variant={userRole === 'production_worker' ? 'default' : 'outline'}
                  onClick={() => setUserRole('production_worker')}
                  className="mr-2"
                >
                  Production Worker
                </Button>
                <Button 
                  variant={userRole === 'customer_service' ? 'default' : 'outline'}
                  onClick={() => setUserRole('customer_service')}
                >
                  Customer Service
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        userRole={userRole}
      />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Welcome, {user.email}
              </h2>
              <p className="text-sm text-gray-600 capitalize">
                {userRole.replace('_', ' ')} Dashboard
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </header>
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ERP;
