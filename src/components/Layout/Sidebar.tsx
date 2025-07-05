import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Factory,
  Headphones,
  ClipboardCheck,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: 'inventory_manager' | 'production_worker' | 'customer_service';
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, userRole }) => {
  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'settings', label: 'Settings', icon: Settings }
    ];

    const roleSpecificItems = {
      inventory_manager: [
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'products', label: 'Products', icon: BarChart3 }
      ],
      production_worker: [
        { id: 'production', label: 'Production', icon: Factory },
        { id: 'quality', label: 'Quality Control', icon: ClipboardCheck },
        { id: 'inventory', label: 'View Inventory', icon: Package }
      ],
      customer_service: [
        { id: 'tickets', label: 'Support Tickets', icon: Headphones },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'orders', label: 'View Orders', icon: ShoppingCart }
      ]
    };

    return [
      commonItems[0], // Dashboard first
      ...roleSpecificItems[userRole],
      commonItems[1]  // Settings last
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
