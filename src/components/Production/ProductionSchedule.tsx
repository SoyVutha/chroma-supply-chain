
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Factory, Play, Pause, CheckCircle } from 'lucide-react';

interface ProductionJob {
  jobId: string;
  productId: string;
  productName: string;
  quantity: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'paused';
  assignedWorker: string;
  startTime: string;
  estimatedCompletion: string;
}

const mockProductionData: ProductionJob[] = [
  { jobId: 'JOB-001', productId: 'PRD-001', productName: 'Steel Widget Type A', quantity: 50, status: 'in_progress', assignedWorker: 'John Smith', startTime: '08:00', estimatedCompletion: '14:00' },
  { jobId: 'JOB-002', productId: 'PRD-002', productName: 'Aluminum Component B', quantity: 30, status: 'scheduled', assignedWorker: 'Sarah Johnson', startTime: '14:00', estimatedCompletion: '18:00' },
  { jobId: 'JOB-003', productId: 'PRD-003', productName: 'Plastic Assembly C', quantity: 75, status: 'completed', assignedWorker: 'Mike Brown', startTime: '06:00', estimatedCompletion: '12:00' },
  { jobId: 'JOB-004', productId: 'PRD-004', productName: 'Electronic Module D', quantity: 25, status: 'paused', assignedWorker: 'Lisa Davis', startTime: '10:00', estimatedCompletion: '16:00' },
];

const ProductionSchedule: React.FC = () => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { variant: 'secondary' as const, label: 'Scheduled' },
      in_progress: { variant: 'default' as const, label: 'In Progress' },
      completed: { variant: 'default' as const, label: 'Completed' },
      paused: { variant: 'outline' as const, label: 'Paused' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getActionButton = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Button variant="outline" size="sm" className="flex items-center gap-1"><Play size={14} />Start</Button>;
      case 'in_progress':
        return <Button variant="outline" size="sm" className="flex items-center gap-1"><Pause size={14} />Pause</Button>;
      case 'paused':
        return <Button variant="outline" size="sm" className="flex items-center gap-1"><Play size={14} />Resume</Button>;
      case 'completed':
        return <Button variant="outline" size="sm" className="flex items-center gap-1"><CheckCircle size={14} />View</Button>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Factory size={20} />
          Production Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Job ID</th>
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-left p-3 font-medium">Quantity</th>
                <th className="text-left p-3 font-medium">Assigned Worker</th>
                <th className="text-left p-3 font-medium">Start Time</th>
                <th className="text-left p-3 font-medium">Est. Completion</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockProductionData.map((job) => (
                <tr key={job.jobId} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono text-sm">{job.jobId}</td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{job.productName}</div>
                      <div className="text-sm text-gray-500">{job.productId}</div>
                    </div>
                  </td>
                  <td className="p-3 font-semibold">{job.quantity}</td>
                  <td className="p-3">{job.assignedWorker}</td>
                  <td className="p-3 text-sm">{job.startTime}</td>
                  <td className="p-3 text-sm">{job.estimatedCompletion}</td>
                  <td className="p-3">{getStatusBadge(job.status)}</td>
                  <td className="p-3">{getActionButton(job.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionSchedule;
