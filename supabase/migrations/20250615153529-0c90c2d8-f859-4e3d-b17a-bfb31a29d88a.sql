
-- Create menu items table
CREATE TABLE public.menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'ready', 'served', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create order items table (junction table for orders and menu items)
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  confirmation_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guest_count INTEGER NOT NULL,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create restaurant settings table
CREATE TABLE public.restaurant_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read access for menu items, restricted write access)
CREATE POLICY "Allow public read access to menu items" ON public.menu_items
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to orders" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "Allow public update access to orders" ON public.orders
  FOR UPDATE USING (true);

CREATE POLICY "Allow public insert access to order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to order items" ON public.order_items
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to reservations" ON public.reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to reservations" ON public.reservations
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to restaurant settings" ON public.restaurant_settings
  FOR SELECT USING (true);

-- Allow all operations on all tables (for now, you can restrict this later with authentication)
CREATE POLICY "Allow all operations on menu items" ON public.menu_items
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on restaurant settings" ON public.restaurant_settings
  FOR ALL USING (true) WITH CHECK (true);

-- Insert sample menu items
INSERT INTO public.menu_items (name, description, price, category, image_url, available) VALUES
('Margherita Pizza', 'Fresh tomatoes, mozzarella, basil', 15.99, 'pizza', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop', true),
('Chicken Burger', 'Grilled chicken, lettuce, tomato, mayo', 14.99, 'burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', true),
('Caesar Salad', 'Romaine lettuce, parmesan, croutons, caesar dressing', 12.50, 'salads', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop', true),
('Pasta Carbonara', 'Spaghetti with eggs, pancetta, parmesan', 18.50, 'pasta', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop', true),
('Grilled Salmon', 'Fresh Atlantic salmon with herbs and lemon', 28.99, 'main', 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop', true),
('Ribeye Steak', 'Premium cut with garlic butter and herbs', 42.99, 'main', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', true);

-- Insert sample restaurant settings
INSERT INTO public.restaurant_settings (setting_key, setting_value) VALUES
('restaurant_info', '{
  "name": "Savory Delights",
  "description": "A fine dining experience with exceptional cuisine",
  "address": "123 Main Street, City, State 12345",
  "phone": "(555) 123-4567",
  "email": "info@savorydelights.com",
  "website": "www.savorydelights.com"
}'),
('operating_hours', '{
  "monday": {"open": "11:00", "close": "22:00", "closed": false},
  "tuesday": {"open": "11:00", "close": "22:00", "closed": false},
  "wednesday": {"open": "11:00", "close": "22:00", "closed": false},
  "thursday": {"open": "11:00", "close": "22:00", "closed": false},
  "friday": {"open": "11:00", "close": "23:00", "closed": false},
  "saturday": {"open": "10:00", "close": "23:00", "closed": false},
  "sunday": {"open": "10:00", "close": "21:00", "closed": false}
}'),
('service_settings', '{
  "acceptingOrders": true,
  "acceptingReservations": true,
  "maxReservationDays": 30,
  "tableCapacity": 50
}');

-- Enable realtime for all tables
ALTER TABLE public.menu_items REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_items REPLICA IDENTITY FULL;
ALTER TABLE public.reservations REPLICA IDENTITY FULL;
ALTER TABLE public.restaurant_settings REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_settings;
