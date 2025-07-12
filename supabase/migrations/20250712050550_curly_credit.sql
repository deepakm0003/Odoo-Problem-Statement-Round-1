/*
  # Create ReWear Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) 
      - `email` (text, unique)
      - `name` (text)
      - `avatar_url` (text, optional)
      - `points` (integer, default 100)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `items`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `size` (text)
      - `condition` (text)
      - `images` (text array)
      - `tags` (text array)
      - `point_value` (integer)
      - `status` (text, default 'available')
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `swap_requests`
      - `id` (uuid, primary key)
      - `requester_id` (uuid, foreign key)
      - `item_id` (uuid, foreign key)
      - `offered_item_id` (uuid, foreign key, optional)
      - `message` (text)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to items

  3. Features
    - Full-text search on items
    - Automatic timestamp updates
    - Point system for exchanges
    - Status tracking for items and swap requests
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  points integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create items table  
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  size text NOT NULL,
  condition text NOT NULL CHECK (condition IN ('New', 'Like New', 'Good', 'Fair')),
  images text[] NOT NULL DEFAULT '{}',
  tags text[] DEFAULT '{}',
  point_value integer NOT NULL CHECK (point_value > 0),
  status text DEFAULT 'available' CHECK (status IN ('available', 'pending', 'swapped')),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create swap_requests table
CREATE TABLE IF NOT EXISTS swap_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES users(id) ON DELETE CASCADE,
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  offered_item_id uuid REFERENCES items(id) ON DELETE SET NULL,
  message text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS items_user_id_idx ON items(user_id);
CREATE INDEX IF NOT EXISTS items_category_idx ON items(category);
CREATE INDEX IF NOT EXISTS items_status_idx ON items(status);
CREATE INDEX IF NOT EXISTS items_created_at_idx ON items(created_at);
CREATE INDEX IF NOT EXISTS swap_requests_requester_id_idx ON swap_requests(requester_id);
CREATE INDEX IF NOT EXISTS swap_requests_item_id_idx ON swap_requests(item_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Items policies
CREATE POLICY "Anyone can read available items"
  ON items
  FOR SELECT
  TO public
  USING (status = 'available');

CREATE POLICY "Authenticated users can read all items"
  ON items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own items"
  ON items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
  ON items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Swap requests policies
CREATE POLICY "Users can read swap requests they're involved in"
  ON swap_requests
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = requester_id OR 
    auth.uid() = (SELECT user_id FROM items WHERE id = item_id)
  );

CREATE POLICY "Users can create swap requests"
  ON swap_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Item owners can update swap requests"
  ON swap_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = (SELECT user_id FROM items WHERE id = item_id));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_swap_requests_updated_at
  BEFORE UPDATE ON swap_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert demo data
INSERT INTO users (id, email, name, points) VALUES 
  ('demo-user-1', 'demo@rewear.com', 'Demo User', 150),
  ('demo-user-2', 'jane@rewear.com', 'Jane Smith', 200),
  ('demo-user-3', 'mike@rewear.com', 'Mike Johnson', 120)
ON CONFLICT (email) DO NOTHING;

INSERT INTO items (title, description, category, size, condition, images, tags, point_value, user_id) VALUES 
  (
    'Vintage Denim Jacket',
    'Beautiful vintage denim jacket in excellent condition. Perfect for layering and adding a classic touch to any outfit.',
    'outerwear',
    'M',
    'Good',
    ARRAY['https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg'],
    ARRAY['vintage', 'denim', 'casual'],
    75,
    'demo-user-1'
  ),
  (
    'Floral Summer Dress',
    'Light and airy floral dress perfect for summer. Worn only a few times, in like-new condition.',
    'dresses',
    'S',
    'Like New',
    ARRAY['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'],
    ARRAY['floral', 'summer', 'casual'],
    60,
    'demo-user-2'
  ),
  (
    'Designer Leather Boots',
    'High-quality leather boots from a premium brand. Some wear on the soles but overall great condition.',
    'shoes',
    '8',
    'Good',
    ARRAY['https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg'],
    ARRAY['leather', 'boots', 'designer'],
    90,
    'demo-user-3'
  )
ON CONFLICT DO NOTHING;