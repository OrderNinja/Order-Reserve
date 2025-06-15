
import { Link } from "react-router-dom";
import { CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const OrderConfirmation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center animate-scale-in">
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center text-amber-700 mb-2">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">Your order is being prepared</span>
            </div>
            <p className="text-sm text-amber-600">
              Estimated preparation time: 15-20 minutes
            </p>
          </div>

          <div className="text-center space-y-2 mb-6">
            <p className="text-gray-600">Order ID: <span className="font-mono font-semibold">ORD123456</span></p>
            <p className="text-sm text-gray-500">
              You will receive updates about your order status
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/" className="block">
              <Button className="w-full">Return to Home</Button>
            </Link>
            <Link to="/menu" className="block">
              <Button variant="outline" className="w-full">
                Order More Items
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmation;
