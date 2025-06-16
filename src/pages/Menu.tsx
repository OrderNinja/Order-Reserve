
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMenuItems } from "@/hooks/useMenuItems";
import MenuItemOptions from "@/components/MenuItemOptions";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  options?: any;
}

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showOptions, setShowOptions] = useState(false);
  const { data: menuItems = [], isLoading } = useMenuItems();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  const categories = ["All", ...Array.from(new Set(menuItems.map(item => item.category)))];

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

  const openOptionsDialog = (menuItem: any) => {
    setSelectedItem(menuItem);
    setShowOptions(true);
  };

  const addToCart = (menuItem: any, options?: any) => {
    const cartItemKey = `${menuItem.id}-${JSON.stringify(options?.selectedOptions || {})}-${JSON.stringify(options?.selectedAddOns || {})}`;
    const existingItem = cart.find(item => 
      item.id === menuItem.id && 
      JSON.stringify(item.options?.selectedOptions || {}) === JSON.stringify(options?.selectedOptions || {}) &&
      JSON.stringify(item.options?.selectedAddOns || {}) === JSON.stringify(options?.selectedAddOns || {})
    );
    
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + (menuItem.quantity || 1));
    } else {
      setCart([...cart, { 
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.totalPrice || menuItem.price,
        image: menuItem.image_url,
        quantity: menuItem.quantity || 1,
        options: options || {}
      }]);
    }
  };

  const getItemQuantity = (itemId: string) => {
    const items = cart.filter(cartItem => cartItem.id === itemId);
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading menu.....</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-600 hover:text-[#951713] transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <Link to="/cart" state={{ cartItems: cart }}>
            <Button variant="outline" className="relative">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-[#951713] text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Thai Menu</h1>
          <p className="text-gray-600">Discover our authentic Thai selection</p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white rounded-full p-2 shadow-sm flex-wrap justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#951713] to-red-700 text-white"
                    : "text-gray-600 hover:text-[#951713]"
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
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-lg font-bold text-[#951713]">฿{item.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                
                {!item.available ? (
                  <Badge variant="secondary" className="bg-red-100 text-red-800 w-full justify-center">
                    Unavailable
                  </Badge>
                ) : getItemQuantity(item.id) > 0 ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const firstItemInCart = cart.find(cartItem => cartItem.id === item.id);
                          if (firstItemInCart) {
                            updateQuantity(firstItemInCart.id, firstItemInCart.quantity - 1);
                          }
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-medium w-8 text-center">{getItemQuantity(item.id)}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(item)}
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
                    onClick={() => openOptionsDialog(item)}
                    className="w-full bg-gradient-to-r from-[#951713] to-red-700 hover:from-red-800 hover:to-red-900 text-white"
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
            <Link to="/cart" state={{ cartItems: cart }}>
              <Button className="bg-gradient-to-r from-[#951713] to-red-700 hover:from-red-800 hover:to-red-900 text-white px-8 py-3 rounded-full shadow-lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Go to Cart ({getTotalItems()})
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Options Dialog */}
      {selectedItem && (
        <MenuItemOptions
          item={selectedItem}
          isOpen={showOptions}
          onClose={() => setShowOptions(false)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default Menu;
