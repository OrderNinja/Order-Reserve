
import { Link } from "react-router-dom";
import { Calendar, ShoppingCart, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#951713] to-red-700 rounded-full flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Order Ninja</h1>
          </div>
          <Link to="/admin" className="text-sm text-gray-600 hover:text-[#951713] transition-colors">
            Admin Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[#951713] to-red-700 bg-clip-text text-transparent">
              Order Ninja
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 animate-fade-in">
            Experience authentic Thai cuisine with convenient ordering and reservations
          </p>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#951713] to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Make a Reservation</h3>
                <p className="text-gray-600 mb-6">Book your table for an unforgettable Thai dining experience</p>
                <Link to="/reservation">
                  <Button className="w-full bg-gradient-to-r from-[#951713] to-red-700 hover:from-red-800 hover:to-red-900 text-white">
                    Reserve Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#951713] to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Order Online</h3>
                <p className="text-gray-600 mb-6">Browse our Thai menu and order for pickup or delivery</p>
                <Link to="/menu">
                  <Button className="w-full bg-gradient-to-r from-[#951713] to-red-700 hover:from-red-800 hover:to-red-900 text-white">
                    Order Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#F6F6F6] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Order Ninja?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine authentic Thai cuisine with modern convenience to deliver an outstanding experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#951713] to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentic Thai Ingredients</h3>
              <p className="text-gray-600">Imported spices and fresh ingredients for authentic Thai flavors</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#951713] to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Reservations</h3>
              <p className="text-gray-600">Book your table instantly with our simple reservation system</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#951713] to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Orders</h3>
              <p className="text-gray-600">Fast and convenient online ordering for pickup or delivery</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
