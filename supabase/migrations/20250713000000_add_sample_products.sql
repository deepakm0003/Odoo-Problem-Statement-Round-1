-- Add comprehensive sample products for all categories
-- This migration adds diverse products across all 6 categories

-- Insert additional demo users for variety
INSERT INTO users (id, email, name, points) VALUES 
  ('demo-user-4', 'sarah@rewear.com', 'Sarah Wilson', 180),
  ('demo-user-5', 'alex@rewear.com', 'Alex Chen', 95),
  ('demo-user-6', 'emma@rewear.com', 'Emma Davis', 220)
ON CONFLICT (email) DO NOTHING;

-- TOPS Category Products
INSERT INTO items (title, description, category, size, condition, images, tags, point_value, user_id) VALUES 
  (
    'Classic White T-Shirt',
    'Essential cotton t-shirt in perfect condition. Great for layering or casual wear.',
    'tops',
    'M',
    'Like New',
    ARRAY['https://images.pexels.com/photos/6311479/pexels-photo-6311479.jpeg'],
    ARRAY['basic', 'cotton', 'casual'],
    25,
    'demo-user-1'
  ),
  (
    'Silk Blouse',
    'Elegant silk blouse in navy blue. Perfect for professional settings.',
    'tops',
    'S',
    'Good',
    ARRAY['https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg'],
    ARRAY['silk', 'professional', 'elegant'],
    45,
    'demo-user-2'
  ),
  (
    'Graphic Sweatshirt',
    'Comfortable oversized sweatshirt with vintage graphic print.',
    'tops',
    'L',
    'Good',
    ARRAY['https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'],
    ARRAY['vintage', 'comfortable', 'casual'],
    35,
    'demo-user-3'
  ),
  (
    'Button-Up Oxford Shirt',
    'Classic oxford shirt in light blue. Great for both casual and formal occasions.',
    'tops',
    'M',
    'Like New',
    ARRAY['https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg'],
    ARRAY['oxford', 'classic', 'versatile'],
    40,
    'demo-user-4'
  );

-- BOTTOMS Category Products
INSERT INTO items (title, description, category, size, condition, images, tags, point_value, user_id) VALUES 
  (
    'High-Waisted Jeans',
    'Vintage high-waisted jeans with a perfect fit. Classic blue denim.',
    'bottoms',
    '30',
    'Good',
    ARRAY['https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg'],
    ARRAY['vintage', 'high-waisted', 'denim'],
    50,
    'demo-user-1'
  ),
  (
    'Pleated Skirt',
    'Elegant pleated skirt in black. Perfect for office wear.',
    'bottoms',
    'M',
    'Like New',
    ARRAY['https://images.pexels.com/photos/6311478/pexels-photo-6311478.jpeg'],
    ARRAY['pleated', 'professional', 'elegant'],
    40,
    'demo-user-2'
  ),
  (
    'Cargo Pants',
    'Comfortable cargo pants with multiple pockets. Great for outdoor activities.',
    'bottoms',
    '32',
    'Good',
    ARRAY['https://images.pexels.com/photos/6311477/pexels-photo-6311477.jpeg'],
    ARRAY['cargo', 'comfortable', 'outdoor'],
    35,
    'demo-user-3'
  ),
  (
    'Linen Shorts',
    'Lightweight linen shorts perfect for summer. Breathable and comfortable.',
    'bottoms',
    'S',
    'New',
    ARRAY['https://images.pexels.com/photos/6311476/pexels-photo-6311476.jpeg'],
    ARRAY['linen', 'summer', 'breathable'],
    30,
    'demo-user-4'
  );

-- DRESSES Category Products
INSERT INTO items (title, description, category, size, condition, images, tags, point_value, user_id) VALUES 
  (
    'Little Black Dress',
    'Timeless little black dress. Perfect for special occasions.',
    'dresses',
    'S',
    'Like New',
    ARRAY['https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg'],
    ARRAY['classic', 'elegant', 'versatile'],
    70,
    'demo-user-1'
  ),
  (
    'Maxi Summer Dress',
    'Beautiful maxi dress with floral pattern. Perfect for summer events.',
    'dresses',
    'M',
    'Good',
    ARRAY['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'],
    ARRAY['maxi', 'floral', 'summer'],
    55,
    'demo-user-2'
  ),
  (
    'Wrap Dress',
    'Flattering wrap dress in a neutral color. Great for work or casual wear.',
    'dresses',
    'L',
    'Good',
    ARRAY['https://images.pexels.com/photos/6311474/pexels-photo-6311474.jpeg'],
    ARRAY['wrap', 'flattering', 'versatile'],
    60,
    'demo-user-3'
  ),
  (
    'Cocktail Dress',
    'Elegant cocktail dress for special occasions. Deep blue color.',
    'dresses',
    'S',
    'Like New',
    ARRAY['https://images.pexels.com/photos/6311473/pexels-photo-6311473.jpeg'],
    ARRAY['cocktail', 'elegant', 'formal'],
    80,
    'demo-user-4'
  );

-- OUTERWEAR Category Products
INSERT INTO items (title, description, category, size, condition, images, tags, point_value, user_id) VALUES 
  (
    'Leather Jacket',
    'Classic leather jacket with silver hardware. Timeless style.',
    'outerwear',
    'M',
    'Good',
    ARRAY['https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg'],
    ARRAY['leather', 'classic', 'edgy'],
    85,
    'demo-user-1'
  ),
  (
    'Wool Coat',
    'Warm wool coat perfect for winter. Classic camel color.',
    'outerwear',
    'L',
    'Like New',
    ARRAY['https://images.pexels.com/photos/6311472/pexels-photo-6311472.jpeg'],
    ARRAY['wool', 'winter', 'classic'],
    75,
    'demo-user-2'
  ),
  (
    'Denim Jacket',
    'Vintage denim jacket with distressed details. Perfect for layering.',
    'outerwear',
    'S',
    'Good',
    ARRAY['https://images.pexels.com/photos/6311471/pexels-photo-6311471.jpeg'],
    ARRAY['denim', 'vintage', 'casual'],
    45,
    'demo-user-3'
  ),
  (
    'Rain Jacket',
    'Waterproof rain jacket in bright yellow. Great for outdoor activities.',
    'outerwear',
    'M',
    'New',
    ARRAY['https://images.pexels.com/photos/6311470/pexels-photo-6311470.jpeg'],
    ARRAY['rain', 'waterproof', 'outdoor'],
    50,
    'demo-user-4'
  );

-- SHOES Category Products
INSERT INTO items (title, description, category, size, condition, images, tags, point_value, user_id) VALUES 
  (
    'White Sneakers',
    'Classic white sneakers in excellent condition. Perfect for everyday wear.',
    'shoes',
    '8',
    'Like New',
    ARRAY['https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg'],
    ARRAY['sneakers', 'white', 'casual'],
    40,
    'demo-user-1'
  ),
  (
    'Ankle Boots',
    'Stylish ankle boots with a low heel. Perfect for fall and winter.',
    'shoes',
    '7',
    'Good',
    ARRAY['https://images.pexels.com/photos/6311469/pexels-photo-6311469.jpeg'],
    ARRAY['boots', 'ankle', 'stylish'],
    55,
    'demo-user-2'
  ),
  (
    'Heeled Sandals',
    'Elegant heeled sandals for summer events. Gold metallic finish.',
    'shoes',
    '8',
    'Good',
    ARRAY['https://images.pexels.com/photos/6311468/pexels-photo-6311468.jpeg'],
    ARRAY['sandals', 'heels', 'summer'],
    45,
    'demo-user-3'
  ),
  (
    'Running Shoes',
    'Comfortable running shoes with good support. Great for workouts.',
    'shoes',
    '9',
    'Like New',
    ARRAY['https://images.pexels.com/photos/6311467/pexels-photo-6311467.jpeg'],
    ARRAY['running', 'athletic', 'comfortable'],
    50,
    'demo-user-4'
  );

-- ACCESSORIES Category Products
INSERT INTO items (title, description, category, size, condition, images, tags, point_value, user_id) VALUES 
  (
    'Leather Handbag',
    'Classic leather handbag in brown. Perfect size for everyday use.',
    'accessories',
    'One Size',
    'Good',
    ARRAY['https://images.pexels.com/photos/6311466/pexels-photo-6311466.jpeg'],
    ARRAY['leather', 'handbag', 'classic'],
    60,
    'demo-user-1'
  ),
  (
    'Silk Scarf',
    'Beautiful silk scarf with floral pattern. Perfect for adding color to any outfit.',
    'accessories',
    'One Size',
    'Like New',
    ARRAY['https://images.pexels.com/photos/6311465/pexels-photo-6311465.jpeg'],
    ARRAY['silk', 'scarf', 'floral'],
    25,
    'demo-user-2'
  ),
  (
    'Statement Necklace',
    'Bold statement necklace with colorful beads. Great for dressing up any outfit.',
    'accessories',
    'One Size',
    'Good',
    ARRAY['https://images.pexels.com/photos/6311464/pexels-photo-6311464.jpeg'],
    ARRAY['necklace', 'statement', 'colorful'],
    30,
    'demo-user-3'
  ),
  (
    'Wide-Brim Hat',
    'Stylish wide-brim hat perfect for summer. Provides great sun protection.',
    'accessories',
    'One Size',
    'New',
    ARRAY['https://images.pexels.com/photos/6311463/pexels-photo-6311463.jpeg'],
    ARRAY['hat', 'summer', 'stylish'],
    35,
    'demo-user-4'
  ),
  (
    'Leather Belt',
    'Classic leather belt in black. Perfect for jeans or dress pants.',
    'accessories',
    'M',
    'Like New',
    ARRAY['https://images.pexels.com/photos/6311462/pexels-photo-6311462.jpeg'],
    ARRAY['leather', 'belt', 'classic'],
    20,
    'demo-user-5'
  ),
  (
    'Designer Sunglasses',
    'High-end designer sunglasses with UV protection. Perfect for sunny days.',
    'accessories',
    'One Size',
    'New',
    ARRAY['https://images.pexels.com/photos/6311461/pexels-photo-6311461.jpeg'],
    ARRAY['sunglasses', 'designer', 'luxury'],
    45,
    'demo-user-6'
  );

-- Additional items for variety
INSERT INTO items (title, description, category, size, condition, images, tags, point_value, user_id) VALUES 
  (
    'Vintage Concert T-Shirt',
    'Rare vintage concert t-shirt from the 90s. Some wear but still very cool.',
    'tops',
    'L',
    'Fair',
    ARRAY['https://images.pexels.com/photos/6311460/pexels-photo-6311460.jpeg'],
    ARRAY['vintage', 'concert', 'rare'],
    65,
    'demo-user-5'
  ),
  (
    'Designer Handbag',
    'Luxury designer handbag in excellent condition. Perfect for special occasions.',
    'accessories',
    'One Size',
    'New',
    ARRAY['https://images.pexels.com/photos/6311459/pexels-photo-6311459.jpeg'],
    ARRAY['designer', 'luxury', 'special'],
    120,
    'demo-user-6'
  );

-- Add sample orders for testing
INSERT INTO orders (id, user_id, total_points, payment_method, payment_status, order_status, shipping_address) VALUES 
  (
    'order_1',
    'demo-user-1',
    75,
    'points',
    'completed',
    'delivered',
    '{"full_name": "Demo User", "phone": "1234567890", "street_address": "123 Main St", "city": "New York", "state": "NY", "postal_code": "10001", "country": "USA"}'
  ),
  (
    'order_2',
    'demo-user-1',
    120,
    'upi',
    'completed',
    'shipped',
    '{"full_name": "Demo User", "phone": "1234567890", "street_address": "123 Main St", "city": "New York", "state": "NY", "postal_code": "10001", "country": "USA"}'
  ),
  (
    'order_3',
    'demo-user-2',
    90,
    'cash',
    'completed',
    'confirmed',
    '{"full_name": "Jane Smith", "phone": "0987654321", "street_address": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "postal_code": "90210", "country": "USA"}'
  );

-- Add sample order items
INSERT INTO order_items (id, order_id, item_id, quantity, points_value) VALUES 
  (
    'orderitem_1',
    'order_1',
    '1',
    1,
    25
  ),
  (
    'orderitem_2',
    'order_1',
    '5',
    1,
    50
  ),
  (
    'orderitem_3',
    'order_2',
    '9',
    1,
    70
  ),
  (
    'orderitem_4',
    'order_2',
    '17',
    1,
    50
  ),
  (
    'orderitem_5',
    'order_3',
    '13',
    1,
    85
  ),
  (
    'orderitem_6',
    'order_3',
    '21',
    1,
    60
  );

-- Add sample swap requests for testing
INSERT INTO swap_requests (id, requester_id, item_id, offered_item_id, message, status) VALUES 
  (
    'swap_1',
    'demo-user-1',
    '2',
    NULL,
    'Hi! I''m interested in swapping for this silk blouse. Would you like to see my items?',
    'pending'
  ),
  (
    'swap_2',
    'demo-user-2',
    '1',
    NULL,
    'I love this white t-shirt! Would you be interested in swapping for my vintage jacket?',
    'accepted'
  ),
  (
    'swap_3',
    'demo-user-3',
    '5',
    NULL,
    'These jeans look perfect! I have some great shoes to offer in exchange.',
    'completed'
  ),
  (
    'swap_4',
    'demo-user-4',
    '9',
    NULL,
    'This dress is exactly what I need for an upcoming event. Would you consider swapping?',
    'pending'
  ); 

  