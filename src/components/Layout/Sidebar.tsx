
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Headphones,
  ClipboardCheck,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: 'inventory_manager' | 'customer_service' | 'admin';
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, userRole }) => {
  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ];

    const roleSpecificItems = {
      inventory_manager: [
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'products', label: 'Products', icon: BarChart3 },
        { id: 'production', label: 'Production', icon: ClipboardCheck }
      ],
      customer_service: [
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'tickets', label: 'Support Tickets', icon: Headphones },
        { id: 'customer-orders', label: 'Customer Orders', icon: ShoppingCart }
      ],
      admin: [
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'tickets', label: 'Support Tickets', icon: Headphones },
        { id: 'products', label: 'Products', icon: BarChart3 },
        { id: 'customer-orders', label: 'Customer Orders', icon: ShoppingCart }
      ]
    };

    const settingsItem = { id: 'settings', label: 'Settings', icon: Settings };

    return [
      ...commonItems,
      ...roleSpecificItems[userRole],
      settingsItem
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">Metaflow ERP</h1>
        <p className="text-sm text-gray-600 capitalize mt-1">
          {userRole.replace('_', ' ')} Portal
        </p>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? 'default' : 'ghost'}
            className="w-full justify-start gap-3"
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon size={18} />
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
