
import { Database } from '@/integrations/supabase/types';

export interface OrderStudent {
  full_name: string;
  gender: string;
  hostel: string;
  floor: string;
  washes_left?: number;
  total_washes?: number;
}

export type OrderStatus = Database['public']['Enums']['order_status'];

export interface Order {
  id: string;
  student_id: string;
  status: OrderStatus;
  total_price: number;
  pickup_date: string;
  delivery_date: string | null;
  created_at: string;
  notes: string | null;
  worker_id: string | null;
  student: OrderStudent | null;
  items: any[] | null;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  clothing_items: {
    id: string;
    name: string;
    price: number;
    description: string | null;
  };
}

// Status options for dropdown
export const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Type guard to check if the student data is valid
export function isValidStudentData(student: any): student is OrderStudent {
  return student && 
    typeof student === 'object' && 
    'full_name' in student && 
    'gender' in student && 
    'hostel' in student && 
    'floor' in student;
}

// Helper function to create a fallback student object when there's an error
export function createFallbackStudent(): OrderStudent {
  return {
    full_name: 'Unknown Student',
    gender: 'unknown',
    hostel: 'N/A',
    floor: 'N/A',
    washes_left: 0,
    total_washes: 40
  };
}
