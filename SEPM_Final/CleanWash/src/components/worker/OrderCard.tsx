import React, { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Order, OrderStudent } from '@/types/order.types';
import StatusUpdateForm from './StatusUpdateForm';
import {
  Clock,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  User,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Building
} from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  // Helper function to display student information safely
  const getStudentName = (student: OrderStudent | null) => {
    return student?.full_name || 'Unknown Student';
  };

  // Updated function to display block and floor details
  const getStudentLocation = (student: OrderStudent | null) => {
    if (!student) return 'N/A';
    
    const blockDisplay = student.block && student.block !== 'N/A'
      ? `Block ${student.block}`
      : 'Block N/A';
    
    const floorDisplay = student.floor && student.floor !== 'N/A'
      ? `Floor ${student.floor}`
      : 'Floor N/A';
    
    return `${blockDisplay}, ${floorDisplay}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Invalid date format:', dateString);
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'completed':
        return <Truck className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div 
          className="cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                <Badge className={getStatusColor(order.status)}>
                  <span className="flex items-center space-x-1">
                    {getStatusIcon(order.status)}
                    <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </span>
                </Badge>
              </div>
              <div className="space-y-1 mt-2">
               
                <p className="text-sm flex items-center text-gray-600">
                  <Building className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  {getStudentLocation(order.student)}
                </p>
                <p className="text-sm flex items-center text-gray-600">
                  <CalendarClock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  Pickup: {formatDate(order.pickup_date)}
                </p>
              </div>
              
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0"
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
          
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {order.items && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex">
                        <span className="text-gray-600">{item.quantity}x</span>
                        <span className="ml-2">{item.clothing_items.name}</span>
                      </div>
                     
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {order.notes && (
              <div className="mb-4">
                <h4 className="font-medium mb-1">Customer Notes</h4>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
            
            <StatusUpdateForm 
              order={order} 
              onStatusUpdated={() => setExpanded(false)}
              onCancel={() => setExpanded(false)}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default OrderCard;
