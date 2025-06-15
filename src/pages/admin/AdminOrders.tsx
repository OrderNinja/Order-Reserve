
import { useState } from "react";
import { Clock, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminOrders = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock data - will be replaced with real database data
  const orders = [
    { 
      id: "ORD001", 
      customer: "John Doe", 
      email: "john@example.com",
      items: [
        { name: "Margherita Pizza", quantity: 1, price: 15.99 },
        { name: "Caesar Salad", quantity: 1, price: 12.50 }
      ],
      total: 28.49, 
      status: "preparing", 
      time: "10:30 AM",
      date: "2024-01-15"
    },
    { 
      id: "ORD002", 
      customer: "Jane Smith", 
      email: "jane@example.com",
      items: [
        { name: "Chicken Burger", quantity: 2, price: 14.99 }
      ],
      total: 29.98, 
      status: "new", 
      time: "10:45 AM",
      date: "2024-01-15"
    },
    { 
      id: "ORD003", 
      customer: "Mike Johnson", 
      email: "mike@example.com",
      items: [
        { name: "Pasta Carbonara", quantity: 1, price: 18.50 },
        { name: "Garlic Bread", quantity: 2, price: 8.99 }
      ],
      total: 36.48, 
      status: "ready", 
      time: "11:00 AM",
      date: "2024-01-15"
    },
  ];

  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: "New", className: "bg-blue-100 text-blue-800" },
      preparing: { label: "Preparing", className: "bg-yellow-100 text-yellow-800" },
      ready: { label: "Ready", className: "bg-green-100 text-green-800" },
      served: { label: "Served", className: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // This will be replaced with actual API call
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        </header>

        <div className="p-6">
          {/* Status Filter */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "all", label: "All Orders" },
                  { key: "new", label: "New" },
                  { key: "preparing", label: "Preparing" },
                  { key: "ready", label: "Ready" },
                  { key: "served", label: "Served" }
                ].map((filter) => (
                  <Button
                    key={filter.key}
                    variant={selectedStatus === filter.key ? "default" : "outline"}
                    onClick={() => setSelectedStatus(filter.key)}
                    size="sm"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer}</div>
                          <div className="text-sm text-gray-500">{order.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm">
                              {item.quantity}x {item.name}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>${order.total}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.time}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {order.status === "new" && (
                            <Button 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, "preparing")}
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Start
                            </Button>
                          )}
                          {order.status === "preparing" && (
                            <Button 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, "ready")}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Ready
                            </Button>
                          )}
                          {order.status === "ready" && (
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => updateOrderStatus(order.id, "served")}
                            >
                              Served
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
