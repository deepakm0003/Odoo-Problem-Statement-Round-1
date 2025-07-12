export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  images: string[];
  tags: string[];
  point_value: number;
  status: 'available' | 'pending' | 'swapped';
  user_id: string;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface SwapRequest {
  id: string;
  requester_id: string;
  requester?: User;
  item_id: string;
  item?: Item;
  offered_item_id?: string;
  offered_item?: Item;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  user?: User;
  items: OrderItem[];
  total_points: number;
  payment_method: 'points' | 'upi' | 'cash';
  payment_status: 'pending' | 'completed' | 'failed';
  order_status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: Address;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_id: string;
  item?: Item;
  quantity: number;
  points_value: number;
}

export interface Address {
  full_name: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface PaymentDetails {
  method: 'upi' | 'cash';
  upi_id?: string;
  transaction_id?: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: 'tops', name: 'Tops', icon: 'Shirt' },
  { id: 'bottoms', name: 'Bottoms', icon: 'Scissors' },
  { id: 'dresses', name: 'Dresses', icon: 'Crown' },
  { id: 'outerwear', name: 'Outerwear', icon: 'Zap' },
  { id: 'shoes', name: 'Shoes', icon: 'Footprints' },
  { id: 'accessories', name: 'Accessories', icon: 'Watch' },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42'];