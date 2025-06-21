
import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Clock, DollarSign, ShoppingBag, Calendar, Users, Settings, Menu as MenuIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useOrders } from "@/hooks/useOrders";
import { useReservations } from "@/hooks/useReservations";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Fetch real data
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: reservations = [], isLoading: reservationsLoading } = useReservations();

  // Calculate today's data
  const today = new Date().toDateString();
  const todayOrders = orders.filter(order => 
    new Date(order.created_at).toDateString() === today
  );
  const todayReservations = reservations.filter(reservation => 
    new Date(reservation.reservation_date).toDateString() === today
  );

  // Calculate stats
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total_amount, 0);
  const activeOrders = orders.filter(order => 
    ['new', 'preparing', 'ready'].includes(order.status)
  ).length;
  
  // Calculate average wait time (simplified - using order count as proxy)
  const avgWaitTime = activeOrders > 0 ? Math.round(18 + (activeOrders * 2)) : 15;

  // Get recent orders (last 5)
  const recentOrders = orders.slice(0, 5).map(order => ({
    id: order.order_number,
    customer: order.customer_name,
    items: order.order_items?.length || 0,
    total: order.total_amount,
    status: order.status,
    time: new Date(order.created_at).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  // Get today's reservations (first 5)
  const recentReservations = todayReservations.slice(0, 5).map(reservation => ({
    id: reservation.confirmation_id,
    customer: reservation.customer_name,
    guests: reservation.guest_count,
    date: new Date(reservation.reservation_date).toDateString() === today ? "Today" : "Tomorrow",
    time: reservation.reservation_time,
    status: reservation.status
  }));

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

  if (ordersLoading || reservationsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

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
                <div className="text-2xl font-bold">${todayRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{todayOrders.length} orders today</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeOrders}</div>
                <p className="text-xs text-muted-foreground">{orders.filter(o => o.status === 'new').length} new orders</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reservations</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayReservations.length}</div>
                <p className="text-xs text-muted-foreground">For today</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgWaitTime}m</div>
                <p className="text-xs text-muted-foreground">Based on current orders</p>
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
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
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
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No orders yet</p>
                  )}
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
                  {recentReservations.length > 0 ? (
                    recentReservations.map((reservation) => (
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
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No reservations today</p>
                  )}
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
