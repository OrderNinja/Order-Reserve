
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";

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

  // Sample options - in a real app, these would come from the database
  const options = {
    spicyLevel: {
      title: "Spicy Level",
      choices: [
        { id: "mild", label: "Mild", price: 0 },
        { id: "medium", label: "Medium", price: 0 },
        { id: "hot", label: "Hot", price: 0 },
        { id: "extra-hot", label: "Extra Hot", price: 0.5 }
      ]
    },
    size: {
      title: "Size",
      choices: [
        { id: "regular", label: "Regular", price: 0 },
        { id: "large", label: "Large", price: 3.00 }
      ]
    }
  };

  const addOns = [
    { id: "extra-cheese", label: "Extra Cheese", price: 2.50 },
    { id: "bacon", label: "Bacon", price: 3.00 },
    { id: "avocado", label: "Avocado", price: 2.00 },
    { id: "mushrooms", label: "Mushrooms", price: 1.50 },
    { id: "extra-sauce", label: "Extra Sauce", price: 0.75 }
  ];

  const handleOptionChange = (optionType: string, choiceId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionType]: choiceId
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
    Object.entries(selectedOptions).forEach(([optionType, choiceId]) => {
      const option = options[optionType as keyof typeof options];
      const choice = option.choices.find(c => c.id === choiceId);
      if (choice) total += choice.price;
    });

    // Add add-on prices
    Object.entries(selectedAddOns).forEach(([addOnId, qty]) => {
      const addOn = addOns.find(a => a.id === addOnId);
      if (addOn) total += addOn.price * qty;
    });

    return total * quantity;
  };

  const handleAddToCart = () => {
    const itemWithOptions = {
      ...item,
      quantity,
      selectedOptions,
      selectedAddOns,
      totalPrice: calculateTotalPrice()
    };
    onAddToCart(itemWithOptions, { selectedOptions, selectedAddOns });
    onClose();
    // Reset form
    setQuantity(1);
    setSelectedOptions({});
    setSelectedAddOns({});
  };

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
              <p className="text-lg font-bold text-orange-600">${item.price}</p>
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

          {/* Options */}
          {Object.entries(options).map(([optionType, option]) => (
            <div key={optionType} className="space-y-3">
              <h4 className="font-medium">{option.title}</h4>
              <div className="grid grid-cols-2 gap-2">
                {option.choices.map((choice) => (
                  <Card
                    key={choice.id}
                    className={`cursor-pointer transition-colors ${
                      selectedOptions[optionType] === choice.id
                        ? 'ring-2 ring-orange-500 bg-orange-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionChange(optionType, choice.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{choice.label}</span>
                        {choice.price > 0 && (
                          <Badge variant="secondary">+${choice.price}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Add-ons */}
          <div className="space-y-3">
            <h4 className="font-medium">Add-ons</h4>
            <div className="space-y-2">
              {addOns.map((addOn) => (
                <div key={addOn.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium">{addOn.label}</span>
                    <Badge variant="secondary" className="ml-2">+${addOn.price}</Badge>
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

          {/* Total and Add to Cart */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-orange-600">${calculateTotalPrice().toFixed(2)}</span>
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
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
