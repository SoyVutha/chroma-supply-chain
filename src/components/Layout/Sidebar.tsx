
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Factory, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3,
  Wrench,
  Headphones
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: 'inventory_manager' | 'production_worker' | 'customer_service';
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, userRole }) => {
  const menuItems = {
    inventory_manager: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'products', label: 'Products', icon: Factory },
      { id: 'orders', label: 'Orders', icon: ShoppingCart },
    ],
    production_worker: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'production', label: 'Production', icon: Factory },
      { id: 'quality', label: 'Quality Control', icon: Wrench },
      { id: 'inventory', label: 'Inventory', icon: Package },
    ],
    customer_service: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'tickets', label: 'Support Tickets', icon: Headphones },
      { id: 'orders', label: 'Orders', icon: ShoppingCart },
    ]
  };

  const currentMenu = menuItems[userRole];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">ManufacturingERP</h1>
        <p className="text-sm text-slate-400 mt-1 capitalize">{userRole.replace('_', ' ')}</p>
      </div>
      
      <nav className="mt-6">
        {currentMenu.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors hover:bg-slate-800",
                activeSection === item.id ? "bg-blue-600 hover:bg-blue-700" : ""
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 w-full p-6 border-t border-slate-700">
        <button 
          onClick={() => onSectionChange('settings')}
          className="w-full flex items-center space-x-3 px-3 py-2 text-left transition-colors hover:bg-slate-800 rounded"
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
