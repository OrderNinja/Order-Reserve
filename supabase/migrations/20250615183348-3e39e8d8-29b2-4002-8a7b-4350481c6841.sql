
-- Update existing menu items with Thai local foods and THB pricing
UPDATE menu_items SET
  name = 'Pad Thai',
  description = 'Classic Thai stir-fried rice noodles with shrimp, tofu, bean sprouts, and tamarind sauce',
  category = 'noodles',
  price = 120,
  image_url = 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400'
WHERE id = (SELECT id FROM menu_items LIMIT 1 OFFSET 0);

UPDATE menu_items SET
  name = 'Tom Yum Goong',
  description = 'Spicy and sour Thai soup with prawns, mushrooms, lemongrass, and lime leaves',
  category = 'soups',
  price = 150,
  image_url = 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400'
WHERE id = (SELECT id FROM menu_items LIMIT 1 OFFSET 1);

UPDATE menu_items SET
  name = 'Green Curry Chicken',
  description = 'Creamy Thai green curry with chicken, Thai eggplant, and basil leaves',
  category = 'curries',
  price = 140,
  image_url = 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400'
WHERE id = (SELECT id FROM menu_items LIMIT 1 OFFSET 2);

-- Insert additional Thai menu items if there are fewer than 3 items
INSERT INTO menu_items (name, description, category, price, image_url, available)
SELECT 'Som Tam', 'Refreshing Thai green papaya salad with tomatoes, green beans, and peanuts', 'salads', 80, 'https://images.unsplash.com/photo-1563379091339-03246963d49a?w=400', true
WHERE (SELECT COUNT(*) FROM menu_items) < 4;

INSERT INTO menu_items (name, description, category, price, image_url, available)
SELECT 'Massaman Curry', 'Rich and mild Thai curry with beef, potatoes, and roasted peanuts', 'curries', 160, 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400', true
WHERE (SELECT COUNT(*) FROM menu_items) < 5;

INSERT INTO menu_items (name, description, category, price, image_url, available)
SELECT 'Mango Sticky Rice', 'Traditional Thai dessert with sweet sticky rice and fresh mango slices', 'desserts', 90, 'https://images.unsplash.com/photo-1541832676-9b763b443c6a?w=400', true
WHERE (SELECT COUNT(*) FROM menu_items) < 6;

INSERT INTO menu_items (name, description, category, price, image_url, available)
SELECT 'Pad See Ew', 'Thai stir-fried wide rice noodles with dark soy sauce, Chinese broccoli, and egg', 'noodles', 110, 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400', true
WHERE (SELECT COUNT(*) FROM menu_items) < 7;

INSERT INTO menu_items (name, description, category, price, image_url, available)
SELECT 'Thai Fried Rice', 'Fragrant jasmine rice stir-fried with vegetables, egg, and your choice of protein', 'rice', 100, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', true
WHERE (SELECT COUNT(*) FROM menu_items) < 8;
