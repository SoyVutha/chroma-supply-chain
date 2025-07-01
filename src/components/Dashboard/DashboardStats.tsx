
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, AlertTriangle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon }) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="text-blue-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className={`flex items-center text-sm ${trendColor}`}>
          <TrendIcon size={14} className="mr-1" />
          <span>{change}</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  userRole: 'inventory_manager' | 'production_worker' | 'customer_service';
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ userRole }) => {
  const getStatsForRole = () => {
    switch (userRole) {
      case 'inventory_manager':
        return [
          { title: 'Total Products', value: '1,247', change: '+12% from last month', trend: 'up' as const, icon: <Package size={20} /> },
          { title: 'Low Stock Items', value: '23', change: '+3 from yesterday', trend: 'down' as const, icon: <AlertTriangle size={20} /> },
          { title: 'Orders Today', value: '89', change: '+23% from yesterday', trend: 'up' as const, icon: <ShoppingCart size={20} /> },
          { title: 'Stock Value', value: '$847K', change: '+8% from last month', trend: 'up' as const, icon: <TrendingUp size={20} /> },
        ];
      
      case 'production_worker':
        return [
          { title: 'Products Made Today', value: '156', change: '+18% from yesterday', trend: 'up' as const, icon: <Package size={20} /> },
          { title: 'Quality Issues', value: '3', change: '-2 from yesterday', trend: 'up' as const, icon: <AlertTriangle size={20} /> },
          { title: 'Production Orders', value: '42', change: '+5 from yesterday', trend: 'up' as const, icon: <ShoppingCart size={20} /> },
          { title: 'Efficiency Rate', value: '94.2%', change: '+2.1% from last week', trend: 'up' as const, icon: <TrendingUp size={20} /> },
        ];
      
      case 'customer_service':
        return [
          { title: 'Active Tickets', value: '34', change: '+7 from yesterday', trend: 'down' as const, icon: <AlertTriangle size={20} /> },
          { title: 'Total Customers', value: '2,847', change: '+127 this month', trend: 'up' as const, icon: <Users size={20} /> },
          { title: 'Resolved Today', value: '28', change: '+12% from yesterday', trend: 'up' as const, icon: <TrendingUp size={20} /> },
          { title: 'Avg Response Time', value: '2.4h', change: '-0.8h from last week', trend: 'up' as const, icon: <TrendingUp size={20} /> },
        ];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
