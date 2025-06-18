
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCreateOrder } from "@/hooks/useOrders";
import OrderTypeSelector from "@/components/OrderTypeSelector";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  options?: {
    selectedOptions: Record<string, string>;
    selectedAddOns: Record<string, number>;
    totalAddOnPrice: number;
  };
}

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const createOrderMutation = useCreateOrder();
  
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  
  // Initialize cart items from location state or localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (location.state?.cartItems) {
      return location.state.cartItems;
    }
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const basePrice = item.price;
      const addOnPrice = item.options?.totalAddOnPrice || 0;
      return total + ((basePrice + addOnPrice) * item.quantity);
    }, 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.07; // 7% VAT for Thailand
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const generateOrderNumber = () => {
    return 'ORD' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();
  };

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before ordering.",
        variant: "destructive"
      });
      return;
    }

    const orderData = {
      order_number: generateOrderNumber(),
      customer_name: "Walk-in Customer",
      customer_email: "walkin@restaurant.com",
      customer_phone: null,
      order_type: orderType,
      status: 'new' as const,
      total_amount: getTotal(),
      notes: null,
    };

    const orderItems = cartItems.map(item => ({
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price + (item.options?.totalAddOnPrice || 0),
      selected_options: item.options?.selectedOptions || {},
      selected_add_ons: item.options?.selectedAddOns || {},
    }));

    try {
      await createOrderMutation.mutateAsync({ orderData, items: orderItems });
      // Clear cart after successful order
      setCartItems([]);
      localStorage.removeItem('cartItems');
      
      navigate("/order-confirmation", { 
        state: { 
          orderNumber: orderData.order_number,
          total: getTotal(),
          customerName: orderData.customer_name,
          orderType: orderType
        } 
      });
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <Link to="/menu" className="flex items-center text-gray-600 hover:text-[#951713] transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Menu
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-gray-300 border-dashed rounded-full" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some delicious items from our menu</p>
            <Link to="/menu">
              <Button className="bg-gradient-to-r from-[#951713] to-red-700 hover:from-red-800 hover:to-red-900 text-white">
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/menu" className="flex items-center text-gray-600 hover:text-[#951713] transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Menu
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderTypeSelector 
                    selectedType={orderType}
                    onTypeChange={setOrderType}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          
                          {/* Display options if any */}
                          {item.options && (
                            <div className="text-xs text-gray-500 mt-1">
                              {Object.keys(item.options.selectedOptions || {}).length > 0 && (
                                <div>Options: {Object.values(item.options.selectedOptions).join(", ")}</div>
                              )}
                              {Object.keys(item.options.selectedAddOns || {}).length > 0 && (
                                <div>Add-ons: {Object.entries(item.options.selectedAddOns).map(([key, qty]) => `${key} (${qty})`).join(", ")}</div>
                              )}
                            </div>
                          )}
                          
                          <p className="text-lg font-bold text-[#951713]">
                            ฿{(item.price + (item.options?.totalAddOnPrice || 0)).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Order Type</span>
                      <span className="font-medium capitalize">{orderType.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>฿{getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (7%)</span>
                      <span>฿{getTax().toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>฿{getTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleConfirmOrder}
                    disabled={createOrderMutation.isPending}
                    className="w-full mt-6 bg-gradient-to-r from-[#951713] to-red-700 hover:from-red-800 hover:to-red-900 text-white"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {createOrderMutation.isPending ? "Processing..." : "Place Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
