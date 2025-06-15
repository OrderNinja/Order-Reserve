
import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Clock, DollarSign, ShoppingBag, Calendar, Users, Settings, Menu as MenuIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock data - will be replaced with real database data
  const recentOrders = [
    { id: "ORD001", customer: "John Doe", items: 3, total: 45.99, status: "preparing", time: "10:30 AM" },
    { id: "ORD002", customer: "Jane Smith", items: 2, total: 32.50, status: "new", time: "10:45 AM" },
    { id: "ORD003", customer: "Mike Johnson", items: 4, total: 67.80, status: "ready", time: "11:00 AM" },
  ];

  const recentReservations = [
    { id: "RES001", customer: "Sarah Wilson", guests: 4, date: "Today", time: "7:00 PM", status: "confirmed" },
    { id: "RES002", customer: "Tom Brown", guests: 2, date: "Today", time: "8:30 PM", status: "confirmed" },
    { id: "RES003", customer: "Lisa Davis", guests: 6, date: "Tomorrow", time: "6:00 PM", status: "pending" },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: "New", variant: "default" as const, className: "bg-blue-100 text-blue-800" },
      preparing: { label: "Preparing", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" },
      ready: { label: "Ready", variant: "secondary" as const, className: "bg-green-100 text-green-800" },
      served: { label: "Served", variant: "secondary" as const, className: "bg-gray-100 text-gray-800" },
      confirmed: { label: "Confirmed", variant: "secondary" as const, className: "bg-green-100 text-green-800" },
      pending: { label: "Pending", variant: "secondary" as const, className: "bg-orange-100 text-orange-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                <MenuIcon className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <Link to="/" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
              View Customer Site
            </Link>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,234</div>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">5 new orders</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reservations</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">For today</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18m</div>
                <p className="text-xs text-muted-foreground">-2m from avg</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Orders
                  <Link to="/admin/orders">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.items} items • ${order.total}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status)}
                        <p className="text-sm text-gray-500 mt-1">{order.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Reservations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Today's Reservations
                  <Link to="/admin/reservations">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReservations.map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">{reservation.customer}</p>
                        <p className="text-sm text-gray-600">{reservation.guests} guests</p>
                        <p className="text-sm text-gray-500">{reservation.date} at {reservation.time}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(reservation.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
