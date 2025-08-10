import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Order, createFallbackStudent } from '@/types/order.types';

export function useOrdersData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState({
    orders: true,
    activeOrders: true,
  });

  /**
   * Processes raw order data by fetching order items and constructing a student-like profile.
   * It retrieves the floor and block values directly from the orders table.
   */
  const processOrderData = async (orderData: any[]): Promise<Order[]> => {
    if (!orderData?.length) return [];

    const ordersWithItems = await Promise.all(
      orderData.map(async (order) => {
        try {
          // Log the raw order data to verify the block value is present.
          console.log('Raw order data for order', order.id, order);

          // Construct a student-like profile including both floor and block values.
          // Use nullish coalescing so that only null/undefined are replaced with 'N/A'
          const studentProfile = {
            full_name: 'Unknown Student',
            gender: 'unknown',
            hostel: 'N/A',
            floor: order.floor ?? 'N/A',
            block: order.block ?? 'N/A',
          };

          console.log(`Student-like profile for order ${order.id}:`, studentProfile);

          // Fetch order items for the order.
          const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              id,
              quantity,
              price,
              clothing_items (
                id,
                name,
                price,
                description
              )
            `)
            .eq('order_id', order.id);

          if (itemsError) {
            console.error('Failed to fetch order items for order', order.id, itemsError);
            return { ...order, items: [], student: studentProfile } as Order;
          }

          return {
            ...order,
            items: items || [],
            student: studentProfile,
          } as Order;
        } catch (err) {
          console.error('Error processing order data for order', order.id, err);
          return { 
            ...order, 
            items: [], 
            student: createFallbackStudent() 
          } as Order;
        }
      })
    );

    return ordersWithItems;
  };

  const fetchAllOrders = async () => {
    try {
      setLoading({ orders: true, activeOrders: true });

      // 1) Fetch pending orders – explicitly selecting the block column.
      const { data: pendingData, error: pendingError } = await supabase
        .from('orders')
        .select('*, block') // explicit selection of block (and all other columns)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (pendingError) {
        console.error('Error fetching pending orders:', pendingError);
        toast({
          title: 'Error',
          description: 'Failed to load pending orders.',
          variant: 'destructive',
        });
      } else {
        console.log('Fetched pending orders:', pendingData?.length || 0);
        const processed = await processOrderData(pendingData || []);
        setOrders(processed);
      }
      setLoading((prev) => ({ ...prev, orders: false }));

      // 2) Fetch active orders – explicitly selecting the block column.
      const { data: activeData, error: activeError } = await supabase
        .from('orders')
        .select('*, block')
        .in('status', ['accepted', 'processing'])
        .order('created_at', { ascending: false });

      if (activeError) {
        console.error('Error fetching active orders:', activeError);
        toast({
          title: 'Error',
          description: 'Failed to load active orders.',
          variant: 'destructive',
        });
      } else {
        console.log('Fetched active orders:', activeData?.length || 0);
        const processed = await processOrderData(activeData || []);
        setActiveOrders(processed);
      }
      setLoading((prev) => ({ ...prev, activeOrders: false }));
      
    } catch (err) {
      console.error('Unexpected fetch error:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while loading orders.',
        variant: 'destructive',
      });
      setLoading({ orders: false, activeOrders: false });
    }
  };

  useEffect(() => {
    fetchAllOrders();

    // Subscribe to real-time order changes.
    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events: INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Real-time order change detected:', payload);
          fetchAllOrders();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to orders changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to orders changes');
          toast({
            title: 'Connection Error',
            description: 'Failed to establish real-time connection for order updates.',
            variant: 'destructive',
          });
        }
      });

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  return {
    orders,
    activeOrders,
    loading,
    refreshOrders: fetchAllOrders,
  };
}
