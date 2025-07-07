
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgressUpdated: () => void;
  task: {
    id: string;
    task_name: string;
    quantity_target: number;
    quantity_completed: number;
    status: string;
  } | null;
}

const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({ 
  isOpen, 
  onClose, 
  onProgressUpdated, 
  task 
}) => {
  const [quantityCompleted, setQuantityCompleted] = useState(task?.quantity_completed.toString() || '');
  const [status, setStatus] = useState(task?.status || 'pending');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (task) {
      setQuantityCompleted(task.quantity_completed.toString());
      setStatus(task.status);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    
    setLoading(true);

    try {
      const completed = parseInt(quantityCompleted);
      let newStatus = status;

      // Auto-update status based on progress
      if (completed >= task.quantity_target) {
        newStatus = 'completed';
      } else if (completed > 0 && status === 'pending') {
        newStatus = 'in_progress';
      }

      const { error } = await supabase
        .from('production_tasks')
        .update({ 
          quantity_completed: completed,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task progress updated successfully",
      });

      onProgressUpdated();
      onClose();
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

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Progress: {task.task_name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Target Quantity</Label>
            <Input value={task.quantity_target} disabled />
          </div>
          
          <div>
            <Label htmlFor="completed">Quantity Completed</Label>
            <Input
              id="completed"
              type="number"
              min="0"
              max={task.quantity_target}
              value={quantityCompleted}
              onChange={(e) => setQuantityCompleted(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Updating...' : 'Update Progress'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProgressModal;
