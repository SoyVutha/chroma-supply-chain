
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Headphones,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: 'inventory_manager';
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isInventoryManagement = location.pathname.includes('/inventorymanagement');
  
  const handleNavigation = (path: string, section: string) => {
    navigate(path);
    onSectionChange(section);
  };

  const getMenuItems = () => {
    return [
      {
        id: 'inventory-management',
        label: 'Inventory Management',
        icon: Package,
        isExpandable: true,
        path: '/erp/inventorymanagement',
        section: 'inventory-management',
        subitems: [
          { 
            id: 'inventory-orders', 
            label: 'Orders', 
            icon: ShoppingCart,
            path: '/erp/inventorymanagement/orders',
            section: 'inventory-orders'
          },
          { 
            id: 'inventory-table', 
            label: 'Inventory', 
            icon: Package,
            path: '/erp/inventorymanagement/inventory',
            section: 'inventory-table'
          },
          { 
            id: 'inventory-settings', 
            label: 'Settings', 
            icon: Settings,
            path: '/erp/inventorymanagement/settings',
            section: 'inventory-settings'
          }
        ]
      }
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
          <div key={item.id}>
            {item.isExpandable ? (
              <div>
                <Button
                  variant={isInventoryManagement ? 'default' : 'ghost'}
                  className="w-full justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                  {isInventoryManagement ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </Button>
                
                {isInventoryManagement && item.subitems && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.subitems.map((subitem) => (
                      <Button
                        key={subitem.id}
                        variant={activeSection === subitem.section ? 'default' : 'ghost'}
                        className="w-full justify-start gap-3 text-sm"
                        onClick={() => handleNavigation(subitem.path, subitem.section)}
                      >
                        <subitem.icon size={16} />
                        {subitem.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant={activeSection === item.section ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => handleNavigation(item.path, item.section)}
              >
                <item.icon size={18} />
                {item.label}
              </Button>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
