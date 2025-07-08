
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

  // Set initial section based on user role and current route
  useEffect(() => {
    if (user && userRole) {
      const currentPath = window.location.pathname;
      
      // Set section based on current route
      if (currentPath.includes('/inventory')) {
        setActiveSection('inventory');
      } else if (currentPath.includes('/customerservice')) {
        setActiveSection('customers');
      } else if (currentPath.includes('/orders')) {
        setActiveSection('orders');
      } else if (currentPath.includes('/customer-orders')) {
        setActiveSection('customer-orders');
      } else if (currentPath.includes('/customers')) {
        setActiveSection('customers');
      } else if (currentPath.includes('/tickets')) {
        setActiveSection('tickets');
      } else if (currentPath.includes('/settings')) {
        setActiveSection('settings');
      } else {
        // Default redirect based on role if on base /erp route
        if (currentPath === '/erp' || currentPath === '/erp/') {
          if (userRole === 'inventory_manager') {
            navigate('/erp/inventory');
          } else if (userRole === 'customer_service') {
            navigate('/erp/customerservice');
          }
        }
      }
    }
  }, [user, userRole, navigate]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    // Navigate to the appropriate route
    const routeMap: { [key: string]: string } = {
      'dashboard': '/erp',
      'inventory': '/erp/inventory',
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
    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">ERP Dashboard</h1>
            <DashboardStats userRole={userRole} />
          </div>
        );
      case 'inventory':
        return userRole === 'inventory_manager' ? <InventoryTable /> : (
          <div className="text-center p-8">
            <p className="text-gray-600">Access denied. This section is for Inventory Managers only.</p>
          </div>
        );
      case 'orders':
        return userRole === 'inventory_manager' ? <OrdersTable /> : (
          <div className="text-center p-8">
            <p className="text-gray-600">Access denied. This section is for Inventory Managers only.</p>
          </div>
        );
      case 'customer-orders':
        return userRole === 'customer_service' ? <CustomerOrdersTable /> : (
          <div className="text-center p-8">
            <p className="text-gray-600">Access denied. This section is for Customer Service only.</p>
          </div>
        );
      case 'customers':
        return userRole === 'customer_service' ? <CustomersTable /> : (
          <div className="text-center p-8">
            <p className="text-gray-600">Access denied. This section is for Customer Service only.</p>
          </div>
        );
      case 'tickets':
        return userRole === 'customer_service' ? (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Support Tickets</h1>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">Support ticket management system coming soon.</p>
              <p className="text-sm text-gray-500">Track and resolve customer support requests efficiently.</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-600">Access denied. This section is for Customer Service only.</p>
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
                  <li><strong>Inventory Manager:</strong> Full access to inventory and order management</li>
                  <li><strong>Customer Service:</strong> Access to customer management, support tickets, and customer order viewing</li>
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
