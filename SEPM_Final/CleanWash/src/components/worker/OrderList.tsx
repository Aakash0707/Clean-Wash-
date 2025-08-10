
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import OrderCard from './OrderCard';
import { Order } from '@/types/order.types';
import { LucideIcon } from 'lucide-react';

interface OrderListProps {
  title: string;
  description: string;
  icon: LucideIcon;
  orders: Order[];
  loading: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
}

const OrderList: React.FC<OrderListProps> = ({
  title,
  description,
  icon: Icon,
  orders,
  loading,
  emptyMessage = 'No orders available',
  emptySubMessage = 'Check back later for new orders'
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{emptyMessage}</p>
            <p className="text-sm text-gray-400 mt-1">{emptySubMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderList;
