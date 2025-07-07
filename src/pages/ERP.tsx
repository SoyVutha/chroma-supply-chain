
import React, { useState, useEffect } from 'react';
import { useERPAuth } from '@/contexts/ERPAuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Layout/Sidebar';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import InventoryTable from '@/components/Inventory/InventoryTable';
import OrdersTable from '@/components/Orders/OrdersTable';
import ProductionSchedule from '@/components/Production/ProductionSchedule';
import CustomersTable from '@/components/Customers/CustomersTable';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const ERP = () => {
  const { user, signOut, loading, userRole } = useERPAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/erp-auth');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">ERP Dashboard</h1>
            <DashboardStats userRole={userRole} />
          </div>
        );
      case 'inventory':
        return <InventoryTable />;
      case 'inventory-view':
        // Read-only inventory view for production workers
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventory Overview</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">View current inventory levels and product information.</p>
              <InventoryTable />
            </div>
          </div>
        );
      case 'orders':
        return <OrdersTable />;
      case 'orders-view':
        // Read-only orders view for customer service
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Orders</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">View and track customer orders.</p>
              <OrdersTable />
            </div>
          </div>
        );
      case 'production':
        return <ProductionSchedule />;
      case 'customers':
        return <CustomersTable />;
      case 'tickets':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Support Tickets</h1>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">Support ticket management system coming soon.</p>
              <p className="text-sm text-gray-500">Track and resolve customer support requests efficiently.</p>
            </div>
          </div>
        );
      case 'quality':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Quality Control</h1>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">Quality control management features in development.</p>
              <p className="text-sm text-gray-500">Monitor product quality, inspection schedules, and compliance metrics.</p>
            </div>
          </div>
        );
      case 'products':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Management</h1>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">Product catalog management tools coming soon.</p>
              <p className="text-sm text-gray-500">Manage product specifications, pricing, and availability.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">ERP Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Staff Role Information</h2>
              <p className="text-gray-600 mb-4">
                Your current role determines what features and data you can access in the ERP system.
              </p>
              <p className="text-sm text-gray-500 mb-4">Current role: <span className="font-medium capitalize">{userRole.replace('_', ' ')}</span></p>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Role Access Rights:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li><strong>Inventory Manager:</strong> Full access to inventory, orders, and product management</li>
                  <li><strong>Production Worker:</strong> Focus on production schedules, quality control, and inventory viewing</li>
                  <li><strong>Customer Service:</strong> Access to customer management, support tickets, and order viewing</li>
                </ul>
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
        <div className="text-lg">Loading ERP System...</div>
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
                Welcome to Metaflow ERP, {user.user_metadata?.name || user.email?.split('@')[0]}
              </h2>
              <p className="text-sm text-gray-600 capitalize">
                {userRole.replace('_', ' ')} Dashboard - Manage Operations Efficiently
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
