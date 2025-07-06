
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardStatsProps {
  userRole: 'inventory_manager' | 'production_worker' | 'customer_service' | 'admin';
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ userRole }) => {
  // Mock data - in real app, this would come from your database
  const stats = {
    inventory_manager: [
      { title: 'Total Products', value: '234', icon: Package, color: 'text-blue-600' },
      { title: 'Low Stock Items', value: '12', icon: AlertTriangle, color: 'text-orange-600' },
      { title: 'Out of Stock', value: '3', icon: AlertTriangle, color: 'text-red-600' },
      { title: 'Reorder Required', value: '8', icon: Package, color: 'text-yellow-600' }
    ],
    production_worker: [
      { title: 'Daily Production Target', value: '150', icon: CheckCircle, color: 'text-green-600' },
      { title: 'Completed Today', value: '89', icon: CheckCircle, color: 'text-blue-600' },
      { title: 'Quality Issues', value: '2', icon: AlertTriangle, color: 'text-red-600' },
      { title: 'Efficiency Rate', value: '94%', icon: CheckCircle, color: 'text-green-600' }
    ],
    customer_service: [
      { title: 'Open Tickets', value: '18', icon: Users, color: 'text-orange-600' },
      { title: 'Resolved Today', value: '7', icon: CheckCircle, color: 'text-green-600' },
      { title: 'High Priority', value: '3', icon: AlertTriangle, color: 'text-red-600' },
      { title: 'Customer Satisfaction', value: '4.8/5', icon: Users, color: 'text-blue-600' }
    ],
    admin: [
      { title: 'Total Users', value: '156', icon: Users, color: 'text-blue-600' },
      { title: 'System Health', value: '98%', icon: CheckCircle, color: 'text-green-600' },
      { title: 'Critical Alerts', value: '1', icon: AlertTriangle, color: 'text-red-600' },
      { title: 'Monthly Revenue', value: '$45.2k', icon: Package, color: 'text-green-600' }
    ]
  };

  const currentStats = stats[userRole];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {currentStats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
