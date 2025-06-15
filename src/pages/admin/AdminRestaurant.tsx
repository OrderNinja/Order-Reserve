
import { useState } from "react";
import { Save, Clock, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminRestaurant = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Mock data - will be replaced with real database data
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Savory Delights",
    description: "A fine dining experience with exceptional cuisine",
    address: "123 Main Street, City, State 12345",
    phone: "(555) 123-4567",
    email: "info@savorydelights.com",
    website: "www.savorydelights.com",
    openingTime: "11:00",
    closingTime: "22:00",
    acceptingOrders: true,
    acceptingReservations: true,
    maxReservationDays: 30,
    tableCapacity: 50
  });

  const [operatingHours, setOperatingHours] = useState({
    monday: { open: "11:00", close: "22:00", closed: false },
    tuesday: { open: "11:00", close: "22:00", closed: false },
    wednesday: { open: "11:00", close: "22:00", closed: false },
    thursday: { open: "11:00", close: "22:00", closed: false },
    friday: { open: "11:00", close: "23:00", closed: false },
    saturday: { open: "10:00", close: "23:00", closed: false },
    sunday: { open: "10:00", close: "21:00", closed: false }
  });

  const handleSave = () => {
    console.log("Saving restaurant settings:", { restaurantInfo, operatingHours });
    // This will be replaced with actual API call
  };

  const updateRestaurantInfo = (field: string, value: any) => {
    setRestaurantInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateOperatingHours = (day: string, field: string, value: any) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], [field]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Restaurant Settings</h1>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input
                    id="name"
                    value={restaurantInfo.name}
                    onChange={(e) => updateRestaurantInfo("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={restaurantInfo.phone}
                    onChange={(e) => updateRestaurantInfo("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={restaurantInfo.email}
                    onChange={(e) => updateRestaurantInfo("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={restaurantInfo.website}
                    onChange={(e) => updateRestaurantInfo("website", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={restaurantInfo.address}
                  onChange={(e) => updateRestaurantInfo("address", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={restaurantInfo.description}
                  onChange={(e) => updateRestaurantInfo("description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 font-medium capitalize">{day}</div>
                      <Switch
                        checked={!hours.closed}
                        onCheckedChange={(checked) => updateOperatingHours(day, "closed", !checked)}
                      />
                    </div>
                    {!hours.closed && (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => updateOperatingHours(day, "open", e.target.value)}
                          className="w-32"
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => updateOperatingHours(day, "close", e.target.value)}
                          className="w-32"
                        />
                      </div>
                    )}
                    {hours.closed && (
                      <span className="text-gray-500">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Service Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Accept Online Orders</Label>
                  <p className="text-sm text-gray-600">Allow customers to place orders online</p>
                </div>
                <Switch
                  checked={restaurantInfo.acceptingOrders}
                  onCheckedChange={(checked) => updateRestaurantInfo("acceptingOrders", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Accept Reservations</Label>
                  <p className="text-sm text-gray-600">Allow customers to make table reservations</p>
                </div>
                <Switch
                  checked={restaurantInfo.acceptingReservations}
                  onCheckedChange={(checked) => updateRestaurantInfo("acceptingReservations", checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxReservationDays">Max Reservation Days</Label>
                  <Input
                    id="maxReservationDays"
                    type="number"
                    value={restaurantInfo.maxReservationDays}
                    onChange={(e) => updateRestaurantInfo("maxReservationDays", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="tableCapacity">Table Capacity</Label>
                  <Input
                    id="tableCapacity"
                    type="number"
                    value={restaurantInfo.tableCapacity}
                    onChange={(e) => updateRestaurantInfo("tableCapacity", parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminRestaurant;
