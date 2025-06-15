
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);

  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with herbs and lemon",
      price: 28.99,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop",
      category: "Main Course",
      available: true
    },
    {
      id: "2",
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with parmesan and croutons",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop",
      category: "Appetizers",
      available: true
    },
    {
      id: "3",
      name: "Ribeye Steak",
      description: "Premium cut with garlic butter and herbs",
      price: 42.99,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop",
      category: "Main Course",
      available: true
    },
    {
      id: "4",
      name: "Chocolate Cake",
      description: "Rich chocolate cake with berry compote",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop",
      category: "Desserts",
      available: true
    },
    {
      id: "5",
      name: "Margherita Pizza",
      description: "Fresh tomatoes, mozzarella, and basil",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop",
      category: "Main Course",
      available: true
    },
    {
      id: "6",
      name: "Bruschetta",
      description: "Toasted bread with tomatoes and garlic",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop",
      category: "Appetizers",
      available: true
    }
  ];

  const categories = ["All", "Appetizers", "Main Course", "Desserts"];

  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      const existingItem = cart.find(item => item.id === itemId);
      if (existingItem) {
        setCart(cart.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
      }
    }
  };

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find(item => item.id === menuItem.id);
    if (existingItem) {
      updateQuantity(menuItem.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { ...menuItem, quantity: 1 }]);
    }
  };

  const getItemQuantity = (itemId: string) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-600 hover:text-orange-600 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <Link to="/cart" className="relative">
            <Button variant="outline" className="relative">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h1>
          <p className="text-gray-600">Discover our delicious selection</p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white rounded-full p-2 shadow-sm">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-lg font-bold text-orange-600">${item.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                
                {getItemQuantity(item.id) > 0 ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, getItemQuantity(item.id) - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-medium w-8 text-center">{getItemQuantity(item.id)}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, getItemQuantity(item.id) + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      In Cart
                    </Badge>
                  </div>
                ) : (
                  <Button
                    onClick={() => addToCart(item)}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                    disabled={!item.available}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Go to Cart Button */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <Link to="/cart">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-full shadow-lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Go to Cart ({getTotalItems()})
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
