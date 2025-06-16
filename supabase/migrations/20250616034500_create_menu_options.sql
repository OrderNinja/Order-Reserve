
-- Create menu_option_categories table
CREATE TABLE menu_option_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  required BOOLEAN DEFAULT false,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create menu_option_choices table
CREATE TABLE menu_option_choices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  category_id UUID REFERENCES menu_option_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create add_ons table (separate from categories)
CREATE TABLE menu_add_ons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_menu_option_categories_menu_item_id ON menu_option_categories(menu_item_id);
CREATE INDEX idx_menu_option_choices_category_id ON menu_option_choices(category_id);
CREATE INDEX idx_menu_add_ons_menu_item_id ON menu_add_ons(menu_item_id);
