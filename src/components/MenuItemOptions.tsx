
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { useMenuOptions } from "@/hooks/useMenuOptions";

interface MenuItemOptionsProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any, options: any) => void;
}

const MenuItemOptions = ({ item, isOpen, onClose, onAddToCart }: MenuItemOptionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});
  const [selectedAddOns, setSelectedAddOns] = useState<{[key: string]: number}>({});

  const { data: options, isLoading } = useMenuOptions(item.id);

  const handleOptionChange = (categoryId: string, choiceId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [categoryId]: choiceId
    }));
  };

  const handleAddOnChange = (addOnId: string, quantity: number) => {
    if (quantity === 0) {
      const newAddOns = { ...selectedAddOns };
      delete newAddOns[addOnId];
      setSelectedAddOns(newAddOns);
    } else {
      setSelectedAddOns(prev => ({
        ...prev,
        [addOnId]: quantity
      }));
    }
  };

  const calculateTotalPrice = () => {
    let total = item.price;

    // Add option prices
    if (options?.categories) {
      Object.entries(selectedOptions).forEach(([categoryId, choiceId]) => {
        const category = options.categories.find(c => c.id === categoryId);
        const choice = category?.choices?.find(c => c.id === choiceId);
        if (choice) total += choice.price;
      });
    }

    // Add add-on prices
    if (options?.addOns) {
      Object.entries(selectedAddOns).forEach(([addOnId, qty]) => {
        const addOn = options.addOns.find(a => a.id === addOnId);
        if (addOn) total += addOn.price * qty;
      });
    }

    return total * quantity;
  };

  const handleAddToCart = () => {
    const totalAddOnPrice = Object.entries(selectedAddOns).reduce((total, [addOnId, qty]) => {
      const addOn = options?.addOns.find(a => a.id === addOnId);
      return total + (addOn ? addOn.price * qty : 0);
    }, 0);

    const itemWithOptions = {
      ...item,
      quantity,
      selectedOptions,
      selectedAddOns,
      totalPrice: calculateTotalPrice()
    };
    
    onAddToCart(itemWithOptions, { 
      selectedOptions, 
      selectedAddOns,
      totalAddOnPrice 
    });
    onClose();
    // Reset form
    setQuantity(1);
    setSelectedOptions({});
    setSelectedAddOns({});
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="text-center py-8">Loading options...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Preview */}
          <div className="flex gap-4">
            <img
              src={item.image_url || "/placeholder.svg"}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-lg font-bold text-[#951713]">฿{item.price}</p>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <h4 className="font-medium">Quantity</h4>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-medium w-8 text-center">{quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Dynamic Options */}
          {options?.categories && options.categories.length > 0 && options.categories.map((category) => (
            <div key={category.id} className="space-y-3">
              <h4 className="font-medium">{category.title}</h4>
              <div className="grid grid-cols-2 gap-2">
                {category.choices?.map((choice) => (
                  <Card
                    key={choice.id}
                    className={`cursor-pointer transition-colors ${
                      selectedOptions[category.id] === choice.id
                        ? 'ring-2 ring-[#951713] bg-red-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionChange(category.id, choice.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{choice.label}</span>
                        {choice.price > 0 && (
                          <Badge variant="secondary">+฿{choice.price}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Dynamic Add-ons */}
          {options?.addOns && options.addOns.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Add-ons</h4>
              <div className="space-y-2">
                {options.addOns.map((addOn) => (
                  <div key={addOn.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium">{addOn.label}</span>
                      <Badge variant="secondary" className="ml-2">+฿{addOn.price}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddOnChange(addOn.id, Math.max(0, (selectedAddOns[addOn.id] || 0) - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{selectedAddOns[addOn.id] || 0}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddOnChange(addOn.id, (selectedAddOns[addOn.id] || 0) + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total and Add to Cart */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-[#951713]">฿{calculateTotalPrice().toFixed(2)}</span>
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-[#951713] to-red-700 hover:from-red-800 hover:to-red-900 text-white"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemOptions;
