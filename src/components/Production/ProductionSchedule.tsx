
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';

interface ProductionTask {
  id: string;
  productName: string;
  orderId: string;
  quantity: number;
  completed: number;
  assignedWorker: string;
  priority: 'high' | 'medium' | 'low';
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  startDate: string;
  dueDate: string;
}

const mockTasks: ProductionTask[] = [
  {
    id: '1',
    productName: 'Steel Widget Type A',
    orderId: 'ORD-001',
    quantity: 50,
    completed: 35,
    assignedWorker: 'John Smith',
    priority: 'high',
    status: 'in_progress',
    startDate: '2024-01-15',
    dueDate: '2024-01-18'
  },
  {
    id: '2',
    productName: 'Aluminum Component B',
    orderId: 'ORD-002',
    quantity: 25,
    completed: 25,
    assignedWorker: 'Sarah Johnson',
    priority: 'medium',
    status: 'completed',
    startDate: '2024-01-14',
    dueDate: '2024-01-16'
  },
  {
    id: '3',
    productName: 'Electronic Module D',
    orderId: 'ORD-003',
    quantity: 15,
    completed: 0,
    assignedWorker: 'Mike Davis',
    priority: 'high',
    status: 'scheduled',
    startDate: '2024-01-16',
    dueDate: '2024-01-20'
  },
  {
    id: '4',
    productName: 'Plastic Assembly C',
    orderId: 'ORD-004',
    quantity: 30,
    completed: 20,
    assignedWorker: 'Lisa Wilson',
    priority: 'low',
    status: 'delayed',
    startDate: '2024-01-12',
    dueDate: '2024-01-15'
  }
];

const ProductionSchedule: React.FC = () => {
  const [filter, setFilter] = useState<'all' | ProductionTask['status']>('all');

  const filteredTasks = mockTasks.filter(task => 
    filter === 'all' || task.status === filter
  );

  const getPriorityBadge = (priority: ProductionTask['priority']) => {
    const config = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return (
      <Badge className={config[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: ProductionTask['status']) => {
    const config = {
      scheduled: { variant: 'secondary' as const, label: 'Scheduled', className: '' },
      in_progress: { variant: 'default' as const, label: 'In Progress', className: '' },
      completed: { variant: 'secondary' as const, label: 'Completed', className: 'bg-green-100 text-green-800' },
      delayed: { variant: 'destructive' as const, label: 'Delayed', className: '' }
    };
    
    const taskConfig = config[status];
    return (
      <Badge variant={taskConfig.variant} className={taskConfig.className}>
        {taskConfig.label}
      </Badge>
    );
  };

  const getProgress = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Production Schedule</h2>
          <p className="text-gray-600">Track production tasks and progress</p>
        </div>
        <Button className="flex items-center gap-2">
          <Calendar size={16} />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All Tasks
        </Button>
        <Button
          variant={filter === 'scheduled' ? 'default' : 'outline'}
          onClick={() => setFilter('scheduled')}
          size="sm"
        >
          Scheduled
        </Button>
        <Button
          variant={filter === 'in_progress' ? 'default' : 'outline'}
          onClick={() => setFilter('in_progress')}
          size="sm"
        >
          In Progress
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
          size="sm"
        >
          Completed
        </Button>
      </div>

      {/* Production Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{task.productName}</CardTitle>
                  <p className="text-sm text-gray-600">Order: {task.orderId}</p>
                </div>
                <div className="flex gap-2">
                  {getPriorityBadge(task.priority)}
                  {getStatusBadge(task.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{task.completed}/{task.quantity} units</span>
                </div>
                <Progress value={getProgress(task.completed, task.quantity)} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {getProgress(task.completed, task.quantity)}% complete
                </p>
              </div>

              {/* Worker & Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span>{task.assignedWorker}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <span>Due: {task.dueDate}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Update Progress
                </Button>
                {task.status === 'in_progress' && (
                  <Button size="sm" className="flex items-center gap-1">
                    <CheckCircle size={14} />
                    Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductionSchedule;
