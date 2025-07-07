
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

interface Product {
  id: string;
  name: string;
}

interface Worker {
  id: string;
  name: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onTaskAdded }) => {
  const [taskName, setTaskName] = useState('');
  const [productId, setProductId] = useState('');
  const [assignedWorkerId, setAssignedWorkerId] = useState('');
  const [quantityTarget, setQuantityTarget] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchWorkers();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, name')
      .order('name');
    setProducts(data || []);
  };

  const fetchWorkers = async () => {
    const { data } = await supabase
      .from('worker_profiles')
      .select('id, name')
      .eq('role', 'production_worker')
      .order('name');
    setWorkers(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const taskData = {
        task_name: taskName,
        product_id: productId || null,
        assigned_worker_id: assignedWorkerId || null,
        quantity_target: parseInt(quantityTarget),
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        status: 'pending'
      };

      const { error } = await supabase
        .from('production_tasks')
        .insert([taskData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Production task added successfully",
      });

      onTaskAdded();
      onClose();
      
      // Reset form
      setTaskName('');
      setProductId('');
      setAssignedWorkerId('');
      setQuantityTarget('');
      setPriority('medium');
      setDueDate('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Production Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              placeholder="Enter task name"
            />
          </div>
          
          <div>
            <Label htmlFor="product">Product (Optional)</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="worker">Assign to Worker (Optional)</Label>
            <Select value={assignedWorkerId} onValueChange={setAssignedWorkerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a worker" />
              </SelectTrigger>
              <SelectContent>
                {workers.map((worker) => (
                  <SelectItem key={worker.id} value={worker.id}>
                    {worker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quantity">Target Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantityTarget}
              onChange={(e) => setQuantityTarget(e.target.value)}
              required
              placeholder="0"
            />
          </div>
          
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding...' : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
