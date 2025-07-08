
import React, { useState, useEffect } from 'react';
import { useERPAuth } from '@/contexts/ERPAuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Layout/Sidebar';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import InventoryTable from '@/components/Inventory/InventoryTable';
import OrdersTable from '@/components/Orders/OrdersTable';
import CustomerOrdersTable from '@/components/Orders/CustomerOrdersTable';
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

  // Set initial section based on current route
  useEffect(() => {
    if (user && userRole) {
      const currentPath = window.location.pathname;
      console.log('Current path:', currentPath, 'User role:', userRole);
      
      // Set section based on current route
      if (currentPath.includes('/inventorymanagement/orders')) {
        setActiveSection('inventory-orders');
      } else if (currentPath.includes('/inventorymanagement/inventory')) {
        setActiveSection('inventory-table');
      } else if (currentPath.includes('/inventorymanagement/settings')) {
        setActiveSection('inventory-settings');
      } else if (currentPath.includes('/inventorymanagement')) {
        setActiveSection('inventory-table'); // Default to inventory table for base route
      } else {
        // Default redirect based on role if on base /erp route
        if (currentPath === '/erp' || currentPath === '/erp/') {
          navigate('/erp/inventorymanagement/inventory');
        }
      }
    }
  }, [user, userRole, navigate]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    // Navigate to the appropriate route
    const routeMap: { [key: string]: string } = {
      'dashboard': '/erp',
      'inventory': '/erp/inventorymanagement',
      'orders': '/erp/orders',
      'customers': '/erp/customerservice',
      'customer-orders': '/erp/customer-orders',
      'tickets': '/erp/tickets',
      'settings': '/erp/settings'
    };
    
    if (routeMap[section]) {
      navigate(routeMap[section]);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const renderContent = () => {
    console.log('renderContent called with activeSection:', activeSection, 'userRole:', userRole);
    switch (activeSection) {
      case 'inventory-orders':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Orders</h1>
            <OrdersTable />
          </div>
        );
      
      case 'inventory-table':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventory Management</h1>
            <InventoryTable />
          </div>
        );
      
      case 'inventory-settings':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventory Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Inventory Management Settings</h2>
              <p className="text-gray-600 mb-4">
                Configure your inventory management preferences and system settings.
              </p>
              <p className="text-sm text-gray-500 mb-4">Current role: <span className="font-medium capitalize">{userRole.replace('_', ' ')}</span></p>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Inventory Manager Access:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li><strong>Orders:</strong> Manage and view customer orders</li>
                  <li><strong>Inventory:</strong> Add, edit, and manage product inventory</li>
                  <li><strong>Settings:</strong> Configure inventory system preferences</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">ERP Dashboard</h1>
            <DashboardStats userRole={userRole} />
          </div>
        );
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
        onSectionChange={handleSectionChange}
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
