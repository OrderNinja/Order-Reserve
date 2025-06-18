
-- Add order_type column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'dine-in' CHECK (order_type IN ('dine-in', 'takeaway'));

-- Ensure menu option tables exist (they should from previous migration)
-- Add indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_menu_option_categories_menu_item_id ON menu_option_categories(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_option_choices_category_id ON menu_option_choices(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_add_ons_menu_item_id ON menu_add_ons(menu_item_id);

-- Add selected_options and selected_add_ons columns to order_items for storing customer selections
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS selected_options JSONB DEFAULT '{}';
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS selected_add_ons JSONB DEFAULT '{}';
