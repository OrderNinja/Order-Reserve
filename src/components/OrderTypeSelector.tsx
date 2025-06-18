
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ShoppingBag } from "lucide-react";

interface OrderTypeSelectorProps {
  selectedType: 'dine-in' | 'takeaway';
  onTypeChange: (type: 'dine-in' | 'takeaway') => void;
}

const OrderTypeSelector = ({ selectedType, onTypeChange }: OrderTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Order Type</h3>
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all ${
            selectedType === 'dine-in' 
              ? 'ring-2 ring-[#951713] bg-red-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onTypeChange('dine-in')}
        >
          <CardContent className="p-4 text-center">
            <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 text-[#951713]" />
            <h4 className="font-medium">Dine In</h4>
            <p className="text-sm text-gray-600">Eat at the restaurant</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            selectedType === 'takeaway' 
              ? 'ring-2 ring-[#951713] bg-red-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onTypeChange('takeaway')}
        >
          <CardContent className="p-4 text-center">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-[#951713]" />
            <h4 className="font-medium">Takeaway</h4>
            <p className="text-sm text-gray-600">Take your order to go</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderTypeSelector;
