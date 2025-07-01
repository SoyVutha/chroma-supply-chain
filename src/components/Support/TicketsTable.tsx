
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Headphones, MessageSquare, Clock, User } from 'lucide-react';

interface SupportTicket {
  ticketId: number;
  customerId: number;
  customerName: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdDate: string;
  assignedAgent: string;
}

const mockTicketsData: SupportTicket[] = [
  { ticketId: 5001, customerId: 2001, customerName: 'Acme Manufacturing Corp', subject: 'Product Quality Issue', description: 'Received defective components in last shipment', status: 'open', priority: 'high', createdDate: '2024-01-15', assignedAgent: 'Agent Smith' },
  { ticketId: 5002, customerId: 2002, customerName: 'Global Tech Solutions', subject: 'Delivery Delay Inquiry', description: 'Order #1002 expected delivery date passed', status: 'in_progress', priority: 'medium', createdDate: '2024-01-15', assignedAgent: 'Agent Johnson' },
  { ticketId: 5003, customerId: 2003, customerName: 'Midwest Assembly LLC', subject: 'Account Registration Help', description: 'Unable to complete account registration process', status: 'resolved', priority: 'low', createdDate: '2024-01-14', assignedAgent: 'Agent Brown' },
  { ticketId: 5004, customerId: 2004, customerName: 'Pacific Components Inc', subject: 'Billing Discrepancy', description: 'Invoice amount does not match order total', status: 'in_progress', priority: 'urgent', createdDate: '2024-01-14', assignedAgent: 'Agent Davis' },
  { ticketId: 5005, customerId: 2005, customerName: 'Eastern Industrial Group', subject: 'Technical Specifications', description: 'Need detailed specs for Product PRD-003', status: 'closed', priority: 'low', createdDate: '2024-01-13', assignedAgent: 'Agent Wilson' },
];

const TicketsTable: React.FC = () => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { variant: 'destructive' as const, label: 'Open' },
      in_progress: { variant: 'default' as const, label: 'In Progress' },
      resolved: { variant: 'secondary' as const, label: 'Resolved' },
      closed: { variant: 'outline' as const, label: 'Closed' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { variant: 'outline' as const, label: 'Low', color: 'text-green-600' },
      medium: { variant: 'secondary' as const, label: 'Medium', color: 'text-yellow-600' },
      high: { variant: 'destructive' as const, label: 'High', color: 'text-orange-600' },
      urgent: { variant: 'destructive' as const, label: 'Urgent', color: 'text-red-600' },
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones size={20} />
          Support Tickets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Ticket ID</th>
                <th className="text-left p-3 font-medium">Customer</th>
                <th className="text-left p-3 font-medium">Subject</th>
                <th className="text-left p-3 font-medium">Priority</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Assigned Agent</th>
                <th className="text-left p-3 font-medium">Created</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockTicketsData.map((ticket) => (
                <tr key={ticket.ticketId} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono text-sm">#{ticket.ticketId}</td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{ticket.customerName}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <User size={12} />
                        ID: {ticket.customerId}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{ticket.subject}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                  </td>
                  <td className="p-3">{getPriorityBadge(ticket.priority)}</td>
                  <td className="p-3">{getStatusBadge(ticket.status)}</td>
                  <td className="p-3 text-sm">{ticket.assignedAgent}</td>
                  <td className="p-3 text-sm flex items-center gap-1">
                    <Clock size={12} />
                    {ticket.createdDate}
                  </td>
                  <td className="p-3">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      Respond
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketsTable;
