import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo_anon_key';

// Create a mock client for demo purposes if using fallback values
const isDemoMode = supabaseUrl === 'https://demo.supabase.co';

export const supabase = isDemoMode 
  ? createMockSupabaseClient() 
  : createClient<Database>(supabaseUrl, supabaseAnonKey);

function createMockSupabaseClient() {
  // Mock data for demo purposes
  const getMockItems = () => {
    // Try to get items from localStorage first
    const storedItems = localStorage.getItem('rewear_items');
    if (storedItems) {
      try {
        return JSON.parse(storedItems);
      } catch (error) {
        console.error('Error parsing stored items:', error);
      }
    }
    
    // Fallback to default mock items
    return [
      // TOPS Category
    {
      id: '1',
        title: 'Classic White T-Shirt',
        description: 'Essential cotton t-shirt in perfect condition. Great for layering or casual wear.',
      category: 'tops',
      size: 'M',
        condition: 'Like New',
        point_value: 25,
        images: ['https://images.pexels.com/photos/6311479/pexels-photo-6311479.jpeg'],
        tags: ['basic', 'cotton', 'casual'],
        user_id: 'demo-user-1',
      status: 'available',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
        title: 'Silk Blouse',
        description: 'Elegant silk blouse in navy blue. Perfect for professional settings.',
        category: 'tops',
        size: 'S',
        condition: 'Good',
        point_value: 45,
        images: ['https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg'],
        tags: ['silk', 'professional', 'elegant'],
        user_id: 'demo-user-2',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Graphic Sweatshirt',
        description: 'Comfortable oversized sweatshirt with vintage graphic print.',
        category: 'tops',
        size: 'L',
        condition: 'Good',
        point_value: 35,
        images: ['https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'],
        tags: ['vintage', 'comfortable', 'casual'],
        user_id: 'demo-user-3',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Button-Up Oxford Shirt',
        description: 'Classic oxford shirt in light blue. Great for both casual and formal occasions.',
        category: 'tops',
        size: 'M',
        condition: 'Like New',
        point_value: 40,
        images: ['https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg'],
        tags: ['oxford', 'classic', 'versatile'],
        user_id: 'demo-user-4',
        status: 'available',
        created_at: new Date().toISOString()
      },
      // BOTTOMS Category
      {
        id: '5',
        title: 'High-Waisted Jeans',
        description: 'Vintage high-waisted jeans with a perfect fit. Classic blue denim.',
        category: 'bottoms',
        size: '30',
        condition: 'Good',
        point_value: 50,
        images: ['https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg'],
        tags: ['vintage', 'high-waisted', 'denim'],
        user_id: 'demo-user-1',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '6',
        title: 'Pleated Skirt',
        description: 'Elegant pleated skirt in black. Perfect for office wear.',
        category: 'bottoms',
        size: 'M',
        condition: 'Like New',
        point_value: 40,
        images: ['https://images.pexels.com/photos/6311478/pexels-photo-6311478.jpeg'],
        tags: ['pleated', 'professional', 'elegant'],
        user_id: 'demo-user-2',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '7',
        title: 'Cargo Pants',
        description: 'Comfortable cargo pants with multiple pockets. Great for outdoor activities.',
        category: 'bottoms',
        size: '32',
        condition: 'Good',
        point_value: 35,
        images: ['https://images.pexels.com/photos/6311477/pexels-photo-6311477.jpeg'],
        tags: ['cargo', 'comfortable', 'outdoor'],
        user_id: 'demo-user-3',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '8',
        title: 'Linen Shorts',
        description: 'Lightweight linen shorts perfect for summer. Breathable and comfortable.',
        category: 'bottoms',
        size: 'S',
        condition: 'New',
        point_value: 30,
        images: ['https://images.pexels.com/photos/6311476/pexels-photo-6311476.jpeg'],
        tags: ['linen', 'summer', 'breathable'],
        user_id: 'demo-user-4',
        status: 'available',
        created_at: new Date().toISOString()
      },
      // DRESSES Category
      {
        id: '9',
        title: 'Little Black Dress',
        description: 'Timeless little black dress. Perfect for special occasions.',
        category: 'dresses',
        size: 'S',
        condition: 'Like New',
        point_value: 70,
        images: ['https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg'],
        tags: ['classic', 'elegant', 'versatile'],
        user_id: 'demo-user-1',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '10',
        title: 'Maxi Summer Dress',
        description: 'Beautiful maxi dress with floral pattern. Perfect for summer events.',
        category: 'dresses',
        size: 'M',
        condition: 'Good',
        point_value: 55,
        images: ['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'],
        tags: ['maxi', 'floral', 'summer'],
        user_id: 'demo-user-2',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '11',
        title: 'Wrap Dress',
        description: 'Flattering wrap dress in a neutral color. Great for work or casual wear.',
        category: 'dresses',
        size: 'L',
        condition: 'Good',
        point_value: 60,
        images: ['https://images.pexels.com/photos/6311474/pexels-photo-6311474.jpeg'],
        tags: ['wrap', 'flattering', 'versatile'],
        user_id: 'demo-user-3',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '12',
        title: 'Cocktail Dress',
        description: 'Elegant cocktail dress for special occasions. Deep blue color.',
        category: 'dresses',
        size: 'S',
        condition: 'Like New',
        point_value: 80,
        images: ['https://images.pexels.com/photos/6311473/pexels-photo-6311473.jpeg'],
        tags: ['cocktail', 'elegant', 'formal'],
        user_id: 'demo-user-4',
        status: 'available',
        created_at: new Date().toISOString()
      },
      // OUTERWEAR Category
      {
        id: '13',
        title: 'Leather Jacket',
        description: 'Classic leather jacket with silver hardware. Timeless style.',
        category: 'outerwear',
        size: 'M',
        condition: 'Good',
        point_value: 85,
        images: ['https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg'],
        tags: ['leather', 'classic', 'edgy'],
        user_id: 'demo-user-1',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '14',
        title: 'Wool Coat',
        description: 'Warm wool coat perfect for winter. Classic camel color.',
        category: 'outerwear',
        size: 'L',
        condition: 'Like New',
        point_value: 75,
        images: ['https://images.pexels.com/photos/6311472/pexels-photo-6311472.jpeg'],
        tags: ['wool', 'winter', 'classic'],
        user_id: 'demo-user-2',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '15',
        title: 'Denim Jacket',
        description: 'Vintage denim jacket with distressed details. Perfect for layering.',
        category: 'outerwear',
        size: 'S',
        condition: 'Good',
        point_value: 45,
        images: ['https://images.pexels.com/photos/6311471/pexels-photo-6311471.jpeg'],
        tags: ['denim', 'vintage', 'casual'],
        user_id: 'demo-user-3',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '16',
        title: 'Rain Jacket',
        description: 'Waterproof rain jacket in bright yellow. Great for outdoor activities.',
        category: 'outerwear',
        size: 'M',
        condition: 'New',
        point_value: 50,
        images: ['https://images.pexels.com/photos/6311470/pexels-photo-6311470.jpeg'],
        tags: ['rain', 'waterproof', 'outdoor'],
        user_id: 'demo-user-4',
        status: 'available',
        created_at: new Date().toISOString()
      },
      // SHOES Category
      {
        id: '17',
        title: 'White Sneakers',
        description: 'Classic white sneakers in excellent condition. Perfect for everyday wear.',
        category: 'shoes',
        size: '8',
        condition: 'Like New',
        point_value: 40,
        images: ['https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg'],
        tags: ['sneakers', 'white', 'casual'],
        user_id: 'demo-user-1',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '18',
        title: 'Ankle Boots',
        description: 'Stylish ankle boots with a low heel. Perfect for fall and winter.',
        category: 'shoes',
        size: '7',
        condition: 'Good',
        point_value: 55,
        images: ['https://images.pexels.com/photos/6311469/pexels-photo-6311469.jpeg'],
        tags: ['boots', 'ankle', 'stylish'],
        user_id: 'demo-user-2',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '19',
        title: 'Heeled Sandals',
        description: 'Elegant heeled sandals for summer events. Gold metallic finish.',
        category: 'shoes',
        size: '8',
        condition: 'Good',
        point_value: 45,
        images: ['https://images.pexels.com/photos/6311468/pexels-photo-6311468.jpeg'],
        tags: ['sandals', 'heels', 'summer'],
        user_id: 'demo-user-3',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '20',
        title: 'Running Shoes',
        description: 'Comfortable running shoes with good support. Great for workouts.',
      category: 'shoes',
      size: '9',
        condition: 'Like New',
        point_value: 50,
        images: ['https://images.pexels.com/photos/6311467/pexels-photo-6311467.jpeg'],
        tags: ['running', 'athletic', 'comfortable'],
        user_id: 'demo-user-4',
        status: 'available',
        created_at: new Date().toISOString()
      },
      // ACCESSORIES Category
      {
        id: '21',
        title: 'Leather Handbag',
        description: 'Classic leather handbag in brown. Perfect size for everyday use.',
        category: 'accessories',
        size: 'One Size',
        condition: 'Good',
        point_value: 60,
        images: ['https://images.pexels.com/photos/6311466/pexels-photo-6311466.jpeg'],
        tags: ['leather', 'handbag', 'classic'],
        user_id: 'demo-user-1',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '22',
        title: 'Silk Scarf',
        description: 'Beautiful silk scarf with floral pattern. Perfect for adding color to any outfit.',
        category: 'accessories',
        size: 'One Size',
        condition: 'Like New',
        point_value: 25,
        images: ['https://images.pexels.com/photos/6311465/pexels-photo-6311465.jpeg'],
        tags: ['silk', 'scarf', 'floral'],
        user_id: 'demo-user-2',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '23',
        title: 'Statement Necklace',
        description: 'Bold statement necklace with colorful beads. Great for dressing up any outfit.',
        category: 'accessories',
        size: 'One Size',
        condition: 'Good',
        point_value: 30,
        images: ['https://images.pexels.com/photos/6311464/pexels-photo-6311464.jpeg'],
        tags: ['necklace', 'statement', 'colorful'],
        user_id: 'demo-user-3',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '24',
        title: 'Wide-Brim Hat',
        description: 'Stylish wide-brim hat perfect for summer. Provides great sun protection.',
        category: 'accessories',
        size: 'One Size',
        condition: 'New',
        point_value: 35,
        images: ['https://images.pexels.com/photos/6311463/pexels-photo-6311463.jpeg'],
        tags: ['hat', 'summer', 'stylish'],
        user_id: 'demo-user-4',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '25',
        title: 'Leather Belt',
        description: 'Classic leather belt in black. Perfect for jeans or dress pants.',
        category: 'accessories',
        size: 'M',
        condition: 'Like New',
        point_value: 20,
        images: ['https://images.pexels.com/photos/6311462/pexels-photo-6311462.jpeg'],
        tags: ['leather', 'belt', 'classic'],
        user_id: 'demo-user-5',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: '26',
        title: 'Designer Sunglasses',
        description: 'High-end designer sunglasses with UV protection. Perfect for sunny days.',
        category: 'accessories',
        size: 'One Size',
        condition: 'New',
        point_value: 45,
        images: ['https://images.pexels.com/photos/6311461/pexels-photo-6311461.jpeg'],
        tags: ['sunglasses', 'designer', 'luxury'],
        user_id: 'demo-user-6',
        status: 'available',
        created_at: new Date().toISOString()
      }
    ];
  };

  const getMockOrders = () => {
    // Try to get orders from localStorage first
    const storedOrders = localStorage.getItem('rewear_orders');
    if (storedOrders) {
      try {
        return JSON.parse(storedOrders);
      } catch (error) {
        console.error('Error parsing stored orders:', error);
      }
    }
    
    // Return sample orders for demo
    return [
      {
        id: 'order_1',
        user_id: 'demo-user-1',
        total_points: 75,
        payment_method: 'points',
        payment_status: 'completed',
        order_status: 'delivered',
        shipping_address: {
          full_name: 'Demo User',
          phone: '1234567890',
          street_address: '123 Main St',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'USA'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'order_2',
        user_id: 'demo-user-1',
        total_points: 120,
        payment_method: 'upi',
        payment_status: 'completed',
        order_status: 'shipped',
        shipping_address: {
          full_name: 'Demo User',
          phone: '1234567890',
          street_address: '123 Main St',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'USA'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  };

  const getMockOrderItems = () => {
    // Try to get order items from localStorage first
    const storedOrderItems = localStorage.getItem('rewear_order_items');
    if (storedOrderItems) {
      try {
        return JSON.parse(storedOrderItems);
      } catch (error) {
        console.error('Error parsing stored order items:', error);
      }
    }
    
    // Return sample order items for demo
    return [
      {
        id: 'orderitem_1',
        order_id: 'order_1',
        item_id: '1',
        quantity: 1,
        points_value: 25,
        created_at: new Date().toISOString()
      },
      {
        id: 'orderitem_2',
        order_id: 'order_1',
        item_id: '5',
        quantity: 1,
        points_value: 50,
        created_at: new Date().toISOString()
      },
      {
        id: 'orderitem_3',
        order_id: 'order_2',
        item_id: '9',
        quantity: 1,
        points_value: 70,
        created_at: new Date().toISOString()
      },
      {
        id: 'orderitem_4',
        order_id: 'order_2',
        item_id: '17',
        quantity: 1,
        points_value: 50,
        created_at: new Date().toISOString()
      }
    ];
  };

  const mockUsers = [
    {
      id: 'demo-user-1',
      email: 'demo@rewear.com',
      name: 'Demo User',
      points: 150,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-user-2',
      email: 'jane@rewear.com',
      name: 'Jane Smith',
      points: 200,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-user-3',
      email: 'mike@rewear.com',
      name: 'Mike Johnson',
      points: 120,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-user-4',
      email: 'sarah@rewear.com',
      name: 'Sarah Wilson',
      points: 180,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-user-5',
      email: 'alex@rewear.com',
      name: 'Alex Chen',
      points: 95,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-user-6',
      email: 'emma@rewear.com',
      name: 'Emma Davis',
      points: 220,
      created_at: new Date().toISOString()
    }
  ];

  function getMockSwapRequests(): any[] {
    const stored = localStorage.getItem('rewear_swap_requests');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }
    
    // Return sample swap requests for demo
    return [
      {
        id: 'swap_1',
        requester_id: 'demo-user-1',
        item_id: '2',
        offered_item_id: null,
        message: 'Hi! I\'m interested in swapping for this silk blouse. Would you like to see my items?',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        requester: {
          name: 'Demo User',
          avatar_url: null
        },
        item: {
          title: 'Silk Blouse',
          images: ['https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg']
        },
        offered_item: null
      },
      {
        id: 'swap_2',
        requester_id: 'demo-user-2',
        item_id: '1',
        offered_item_id: null,
        message: 'I love this white t-shirt! Would you be interested in swapping for my vintage jacket?',
        status: 'accepted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        requester: {
          name: 'Jane Smith',
          avatar_url: null
        },
        item: {
          title: 'Classic White T-Shirt',
          images: ['https://images.pexels.com/photos/6311479/pexels-photo-6311479.jpeg']
        },
        offered_item: null
      },
      {
        id: 'swap_3',
        requester_id: 'demo-user-3',
        item_id: '5',
        offered_item_id: null,
        message: 'These jeans look perfect! I have some great shoes to offer in exchange.',
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        requester: {
          name: 'Mike Johnson',
          avatar_url: null
        },
        item: {
          title: 'High-Waisted Jeans',
          images: ['https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg']
        },
        offered_item: null
      }
    ];
  }

  function setMockSwapRequests(requests: any[]): void {
    localStorage.setItem('rewear_swap_requests', JSON.stringify(requests));
  }

  // Create a chainable query builder
  function createMockQueryBuilder(tableName: string, data: any[]) {
    let filteredData = [...data];
    let isSelectingSingle = false;

    const queryBuilder = {
      select: (columns?: string) => queryBuilder,
      eq: (column: string, value: any) => {
        filteredData = filteredData.filter(item => item[column] === value);
        return queryBuilder;
      },
      ilike: (column: string, value: any) => {
        const searchValue = value.replace(/%/g, '');
        filteredData = filteredData.filter(item => 
          item[column]?.toLowerCase().includes(searchValue.toLowerCase())
        );
        return queryBuilder;
      },
      neq: (column: string, value: any) => {
        filteredData = filteredData.filter(item => item[column] !== value);
        return queryBuilder;
      },
      in: (column: string, values: any[]) => {
        filteredData = filteredData.filter(item => values.includes(item[column]));
        return queryBuilder;
      },
      order: (column: string, options?: { ascending?: boolean }) => {
        const ascending = options?.ascending !== false;
        filteredData.sort((a, b) => {
          if (ascending) {
            return a[column] > b[column] ? 1 : -1;
          } else {
            return a[column] < b[column] ? 1 : -1;
          }
        });
        return queryBuilder;
      },
      limit: (count: number) => {
        filteredData = filteredData.slice(0, count);
        return queryBuilder;
      },
      or: (query: string) => {
        // Handle OR queries like "requester_id.eq.user123,item.user_id.eq.user123"
        const conditions = query.split(',');
        
        filteredData = filteredData.filter(item => {
          return conditions.some(condition => {
            const [field, operator, value] = condition.split('.');
            if (operator === 'eq') {
              return item[field] === value;
            } else if (operator === 'ilike') {
              const searchValue = value.replace(/%/g, '');
              return item[field]?.toLowerCase().includes(searchValue.toLowerCase());
            }
            return false;
          });
        });
        return queryBuilder;
      },
      single: () => {
        isSelectingSingle = true;
        return queryBuilder;
      },
      insert: (values: any) => {
        if (tableName === 'swap_requests') {
          const requests = getMockSwapRequests();
          const newRequest = {
            ...values,
            id: `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            status: values.status || 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          requests.push(newRequest);
          setMockSwapRequests(requests);
          return Promise.resolve({ data: [newRequest], error: null });
        }
        
        if (tableName === 'orders') {
          const orders = getMockOrders();
          const newOrder = {
            ...values,
            id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          orders.push(newOrder);
          localStorage.setItem('rewear_orders', JSON.stringify(orders));
          return Promise.resolve({ data: [newOrder], error: null });
        }
        
        return Promise.resolve({ data: values, error: null });
      },
      update: (values: any) => {
        if (tableName === 'swap_requests') {
          const requests = getMockSwapRequests();
          const idx = requests.findIndex((r: any) => r.id === values.id);
          if (idx !== -1) {
            requests[idx] = { ...requests[idx], ...values, updated_at: new Date().toISOString() };
            setMockSwapRequests(requests);
            return Promise.resolve({ data: [requests[idx]], error: null });
          }
          return Promise.resolve({ data: null, error: 'Not found' });
        }
        return Promise.resolve({ data: values, error: null });
      },
      delete: () => {
        return Promise.resolve({ data: null, error: null });
      },
      then: (resolve: (result: any) => void) => {
        const result = isSelectingSingle 
          ? { data: filteredData[0] || null, error: null }
          : { data: filteredData, error: null };
        return Promise.resolve(result).then(resolve);
      }
    };

    return queryBuilder;
  }

  function seedSampleItems() {
    const items = [
      {
        id: 'item_tops_1', title: 'Classic White Shirt', description: 'A timeless white shirt, perfect for any occasion.', category: 'tops', size: 'M', condition: 'Like New', images: ['https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg'], tags: ['tops', 'classic', 'white'], point_value: 50, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      },
      { id: 'item_tops_2', title: 'Blue Casual Tee', description: 'Soft blue t-shirt for everyday comfort.', category: 'tops', size: 'L', condition: 'Good', images: ['https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg'], tags: ['tops', 'casual', 'blue'], point_value: 45, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_tops_3', title: 'Striped Polo', description: 'Stylish striped polo for a smart-casual look.', category: 'tops', size: 'S', condition: 'New', images: ['https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg'], tags: ['tops', 'polo', 'striped'], point_value: 55, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_tops_4', title: 'Floral Blouse', description: 'Light and breezy floral blouse.', category: 'tops', size: 'M', condition: 'Fair', images: ['https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'], tags: ['tops', 'blouse', 'floral'], point_value: 40, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_tops_5', title: 'Black Tank Top', description: 'Essential black tank for layering.', category: 'tops', size: 'XS', condition: 'Like New', images: ['https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg'], tags: ['tops', 'tank', 'black'], point_value: 35, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_tops_6', title: 'Red Button-Up', description: 'Vibrant red shirt for a bold statement.', category: 'tops', size: 'XL', condition: 'Good', images: ['https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg'], tags: ['tops', 'red', 'button-up'], point_value: 48, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },

      // BOTTOMS
      { id: 'item_bottoms_1', title: 'Classic Blue Jeans', description: 'Comfortable blue denim jeans.', category: 'bottoms', size: '32', condition: 'Good', images: ['https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg'], tags: ['bottoms', 'jeans', 'blue'], point_value: 60, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_bottoms_2', title: 'Black Chinos', description: 'Versatile black chinos for work or play.', category: 'bottoms', size: '34', condition: 'Like New', images: ['https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg'], tags: ['bottoms', 'chinos', 'black'], point_value: 55, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_bottoms_3', title: 'Grey Joggers', description: 'Soft grey joggers for lounging.', category: 'bottoms', size: 'M', condition: 'Fair', images: ['https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg'], tags: ['bottoms', 'joggers', 'grey'], point_value: 38, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_bottoms_4', title: 'White Shorts', description: 'Crisp white shorts for summer.', category: 'bottoms', size: 'S', condition: 'New', images: ['https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'], tags: ['bottoms', 'shorts', 'white'], point_value: 42, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_bottoms_5', title: 'Khaki Trousers', description: 'Classic khaki trousers.', category: 'bottoms', size: '36', condition: 'Good', images: ['https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg'], tags: ['bottoms', 'trousers', 'khaki'], point_value: 50, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_bottoms_6', title: 'Denim Skirt', description: 'Trendy denim skirt for casual outings.', category: 'bottoms', size: 'XS', condition: 'Like New', images: ['https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg'], tags: ['bottoms', 'skirt', 'denim'], point_value: 45, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },

      // DRESSES
      { id: 'item_dresses_1', title: 'Summer Floral Dress', description: 'Light floral dress for warm days.', category: 'dresses', size: 'M', condition: 'New', images: ['https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg'], tags: ['dresses', 'floral', 'summer'], point_value: 65, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_dresses_2', title: 'Evening Gown', description: 'Elegant evening gown for special occasions.', category: 'dresses', size: 'L', condition: 'Like New', images: ['https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'], tags: ['dresses', 'gown', 'evening'], point_value: 80, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_dresses_3', title: 'Casual T-Shirt Dress', description: 'Comfortable t-shirt dress for daily wear.', category: 'dresses', size: 'S', condition: 'Good', images: ['https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg'], tags: ['dresses', 't-shirt', 'casual'], point_value: 55, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_dresses_4', title: 'Polka Dot Dress', description: 'Fun polka dot dress.', category: 'dresses', size: 'XS', condition: 'Fair', images: ['https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'], tags: ['dresses', 'polka', 'dot'], point_value: 40, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_dresses_5', title: 'Denim Overall Dress', description: 'Playful denim overall dress.', category: 'dresses', size: 'M', condition: 'Like New', images: ['https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg'], tags: ['dresses', 'denim', 'overall'], point_value: 60, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_dresses_6', title: 'Red Party Dress', description: 'Eye-catching red party dress.', category: 'dresses', size: 'L', condition: 'Good', images: ['https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg'], tags: ['dresses', 'party', 'red'], point_value: 70, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },

      // OUTERWEAR
      { id: 'item_outerwear_1', title: 'Black Leather Jacket', description: 'Stylish black leather jacket.', category: 'outerwear', size: 'L', condition: 'Good', images: ['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'], tags: ['outerwear', 'jacket', 'leather'], point_value: 75, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_outerwear_2', title: 'Blue Denim Jacket', description: 'Classic blue denim jacket.', category: 'outerwear', size: 'M', condition: 'Like New', images: ['https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg'], tags: ['outerwear', 'jacket', 'denim'], point_value: 65, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_outerwear_3', title: 'Grey Hoodie', description: 'Cozy grey hoodie.', category: 'outerwear', size: 'XL', condition: 'Fair', images: ['https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'], tags: ['outerwear', 'hoodie', 'grey'], point_value: 40, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_outerwear_4', title: 'Beige Trench Coat', description: 'Elegant beige trench coat.', category: 'outerwear', size: 'M', condition: 'New', images: ['https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg'], tags: ['outerwear', 'coat', 'trench'], point_value: 80, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_outerwear_5', title: 'Green Parka', description: 'Warm green parka for winter.', category: 'outerwear', size: 'L', condition: 'Good', images: ['https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg'], tags: ['outerwear', 'parka', 'green'], point_value: 70, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_outerwear_6', title: 'Red Windbreaker', description: 'Sporty red windbreaker.', category: 'outerwear', size: 'S', condition: 'Like New', images: ['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'], tags: ['outerwear', 'windbreaker', 'red'], point_value: 55, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },

      // SHOES
      { id: 'item_shoes_1', title: 'White Sneakers', description: 'Clean white sneakers for any outfit.', category: 'shoes', size: '40', condition: 'New', images: ['https://images.pexels.com/photos/19090/pexels-photo.jpg'], tags: ['shoes', 'sneakers', 'white'], point_value: 60, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_shoes_2', title: 'Black Running Shoes', description: 'Lightweight black running shoes.', category: 'shoes', size: '42', condition: 'Like New', images: ['https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg'], tags: ['shoes', 'running', 'black'], point_value: 55, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_shoes_3', title: 'Brown Loafers', description: 'Classic brown loafers.', category: 'shoes', size: '38', condition: 'Good', images: ['https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg'], tags: ['shoes', 'loafers', 'brown'], point_value: 50, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_shoes_4', title: 'Blue Sandals', description: 'Comfortable blue sandals.', category: 'shoes', size: '36', condition: 'Fair', images: ['https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'], tags: ['shoes', 'sandals', 'blue'], point_value: 35, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_shoes_5', title: 'Grey Boots', description: 'Durable grey boots.', category: 'shoes', size: '41', condition: 'Good', images: ['https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg'], tags: ['shoes', 'boots', 'grey'], point_value: 65, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_shoes_6', title: 'Red Heels', description: 'Stylish red heels for parties.', category: 'shoes', size: '39', condition: 'Like New', images: ['https://images.pexels.com/photos/19090/pexels-photo.jpg'], tags: ['shoes', 'heels', 'red'], point_value: 70, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },

      // ACCESSORIES
      { id: 'item_accessories_1', title: 'Gold Watch', description: 'Elegant gold watch.', category: 'accessories', size: 'M', condition: 'Good', images: ['https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg'], tags: ['accessories', 'watch', 'gold'], point_value: 80, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_accessories_2', title: 'Leather Belt', description: 'Classic brown leather belt.', category: 'accessories', size: 'L', condition: 'Like New', images: ['https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'], tags: ['accessories', 'belt', 'leather'], point_value: 45, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_accessories_3', title: 'Silk Scarf', description: 'Soft silk scarf.', category: 'accessories', size: 'S', condition: 'New', images: ['https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg'], tags: ['accessories', 'scarf', 'silk'], point_value: 38, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_accessories_4', title: 'Black Sunglasses', description: 'Trendy black sunglasses.', category: 'accessories', size: 'M', condition: 'Fair', images: ['https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'], tags: ['accessories', 'sunglasses', 'black'], point_value: 55, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_accessories_5', title: 'Canvas Tote Bag', description: 'Eco-friendly canvas tote.', category: 'accessories', size: 'L', condition: 'Good', images: ['https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg'], tags: ['accessories', 'tote', 'canvas'], point_value: 35, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
      { id: 'item_accessories_6', title: 'Silver Bracelet', description: 'Shiny silver bracelet.', category: 'accessories', size: 'S', condition: 'Like New', images: ['https://ibb.co/Q7xz4bfr'], tags: ['accessories', 'bracelet', 'silver'], point_value: 60, status: 'available', user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
    ];
    localStorage.setItem('rewear_items', JSON.stringify(items));
    localStorage.setItem('mock_supabase_items', JSON.stringify(items));
  }

  if (!localStorage.getItem('rewear_items') || JSON.parse(localStorage.getItem('rewear_items') || '[]').length === 0) {
    seedSampleItems();
  }

  return {
    auth: {
      signUp: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: (tableName: string) => {
      let data;
      if (tableName === 'items') data = getMockItems();
      else if (tableName === 'users') data = mockUsers;
      else if (tableName === 'swap_requests') data = getMockSwapRequests();
      else if (tableName === 'orders') data = getMockOrders();
      else if (tableName === 'order_items') data = getMockOrderItems();
      else data = [];
      return createMockQueryBuilder(tableName, data);
    }
  } as any;
}