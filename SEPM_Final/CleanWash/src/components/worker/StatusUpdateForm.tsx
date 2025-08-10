
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Order, statusOptions } from '@/types/order.types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface StatusUpdateFormProps {
  order: Order;
  onStatusUpdated: () => void;
  onCancel: () => void;
}

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({ 
  order, 
  onStatusUpdated,
  onCancel 
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Get available status options based on current order status
  const getAvailableStatusOptions = () => {
    switch (order.status) {
      case 'pending':
        return statusOptions.filter(option => ['accepted', 'cancelled'].includes(option.value));
      case 'accepted':
        return statusOptions.filter(option => ['processing', 'cancelled'].includes(option.value));
      case 'processing':
        return statusOptions.filter(option => ['completed', 'cancelled'].includes(option.value));
      default:
        return statusOptions.filter(option => option.value !== order.status);
    }
  };

  const updateOrderStatus = async () => {
    if (!selectedStatus) {
      toast({
        title: 'Status required',
        description: 'Please select a status for the order',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const updateData: any = { 
        status: selectedStatus
      };
      
      // Add worker_id if accepting the order
      if (selectedStatus === 'accepted') {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (user?.id) {
          updateData.worker_id = user.id;
        } else {
          throw new Error('Unable to get current user');
        }
      }
      
      // Add delivery date when order is completed
      if (selectedStatus === 'completed') {
        updateData.delivery_date = new Date().toISOString();
      }

      // Add delivery notes if provided
      if (deliveryNotes.trim() && selectedStatus === 'completed') {
        updateData.notes = deliveryNotes.trim();
      }

      console.log('Updating order:', order.id, 'with data:', updateData);

      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', order.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Status updated',
        description: `Order status has been updated to ${selectedStatus}`,
      });

      // Reset form and notify parent
      setSelectedStatus('');
      setDeliveryNotes('');
      onStatusUpdated();
      
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error updating status',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <h4 className="font-medium">Update Status</h4>
        <Select 
          value={selectedStatus} 
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select new status" />
          </SelectTrigger>
          <SelectContent>
            {getAvailableStatusOptions().map(option => (
              <SelectItem 
                key={option.value} 
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedStatus === 'completed' && (
        <div className="space-y-2">
          <h4 className="font-medium">Delivery Notes (Optional)</h4>
          <Textarea
            placeholder="Any notes about the delivery?"
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button 
          onClick={updateOrderStatus}
          disabled={loading || !selectedStatus}
          className="flex-1"
        >
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Updating...
            </>
          ) : (
            "Update Status"
          )}
        </Button>
        <Button 
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default StatusUpdateForm;
