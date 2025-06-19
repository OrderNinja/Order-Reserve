
-- Add order_type column to orders table if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'dine-in' CHECK (order_type IN ('dine-in', 'takeaway'));

-- Ensure menu option tables exist (they should from previous migration but let's make sure)
CREATE TABLE IF NOT EXISTS menu_option_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  required BOOLEAN DEFAULT false,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_option_choices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  category_id UUID REFERENCES menu_option_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_add_ons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add selected_options and selected_add_ons columns to order_items for storing customer selections
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS selected_options JSONB DEFAULT '{}';
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS selected_add_ons JSONB DEFAULT '{}';

-- Add indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_menu_option_categories_menu_item_id ON menu_option_categories(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_option_choices_category_id ON menu_option_choices(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_add_ons_menu_item_id ON menu_add_ons(menu_item_id);

-- Enable Row Level Security for the menu option tables
ALTER TABLE menu_option_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_option_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_add_ons ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (if they exist) to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to menu option categories" ON menu_option_categories;
DROP POLICY IF EXISTS "Allow all operations on menu option categories" ON menu_option_categories;
DROP POLICY IF EXISTS "Allow public read access to menu option choices" ON menu_option_choices;
DROP POLICY IF EXISTS "Allow all operations on menu option choices" ON menu_option_choices;
DROP POLICY IF EXISTS "Allow public read access to menu add ons" ON menu_add_ons;
DROP POLICY IF EXISTS "Allow all operations on menu add ons" ON menu_add_ons;

-- Create policies to allow public read access (since this is a restaurant app)
CREATE POLICY "Allow public read access to menu option categories" ON menu_option_categories
  FOR SELECT USING (true);

CREATE POLICY "Allow all operations on menu option categories" ON menu_option_categories
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to menu option choices" ON menu_option_choices
  FOR SELECT USING (true);

CREATE POLICY "Allow all operations on menu option choices" ON menu_option_choices
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to menu add ons" ON menu_add_ons
  FOR SELECT USING (true);

CREATE POLICY "Allow all operations on menu add ons" ON menu_add_ons
  FOR ALL USING (true) WITH CHECK (true);
