
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddTaskModal from './AddTaskModal';
import UpdateProgressModal from './UpdateProgressModal';

interface ProductionTask {
  id: string;
  task_name: string;
  product_id?: string;
  assigned_worker_id?: string;
  quantity_target: number;
  quantity_completed: number;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  created_at: string;
  products?: { name: string };
  worker_profiles?: { name: string };
}

const ProductionSchedule: React.FC = () => {
  const [filter, setFilter] = useState<'all' | ProductionTask['status']>('all');
  const [tasks, setTasks] = useState<ProductionTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProductionTask | null>(null);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      // Use a direct query with type assertion since types aren't updated yet
      const { data, error } = await (supabase as any)
        .from('production_tasks')
        .select(`
          *,
          products(name),
          worker_profiles(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.log('Error loading production tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load production tasks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Set up real-time subscription
    const channel = supabase
      .channel('production-tasks-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'production_tasks' },
        () => fetchTasks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredTasks = tasks.filter(task => 
    filter === 'all' || task.status === filter
  );

  const getPriorityBadge = (priority: ProductionTask['priority']) => {
    const config = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
      urgent: 'bg-purple-100 text-purple-800'
    };
    return (
      <Badge className={config[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: ProductionTask['status']) => {
    const config = {
      pending: { variant: 'secondary' as const, label: 'Pending', className: '' },
      in_progress: { variant: 'default' as const, label: 'In Progress', className: '' },
      completed: { variant: 'secondary' as const, label: 'Completed', className: 'bg-green-100 text-green-800' },
      on_hold: { variant: 'destructive' as const, label: 'On Hold', className: '' }
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

  const handleUpdateProgress = (task: ProductionTask) => {
    setSelectedTask(task);
    setIsProgressModalOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading production tasks...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Production Schedule</h2>
          <p className="text-gray-600">Track production tasks and progress</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
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
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          size="sm"
        >
          Pending
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
                  <CardTitle className="text-lg">{task.task_name}</CardTitle>
                  {task.products && (
                    <p className="text-sm text-gray-600">Product: {task.products.name}</p>
                  )}
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
                  <span>{task.quantity_completed}/{task.quantity_target} units</span>
                </div>
                <Progress value={getProgress(task.quantity_completed, task.quantity_target)} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {getProgress(task.quantity_completed, task.quantity_target)}% complete
                </p>
              </div>

              {/* Worker & Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span>{task.worker_profiles?.name || 'Unassigned'}</span>
                </div>
                {task.due_date && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleUpdateProgress(task)}
                >
                  Update Progress
                </Button>
                {task.status === 'in_progress' && task.quantity_completed >= task.quantity_target && (
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

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTaskAdded={fetchTasks}
      />
      
      <UpdateProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        onProgressUpdated={fetchTasks}
        task={selectedTask}
      />
    </div>
  );
};

export default ProductionSchedule;
