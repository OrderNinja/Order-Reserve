
import { useState } from "react";
import { Clock, CheckCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useOrders, useUpdateOrderStatus } from "@/hooks/useOrders";

const AdminOrders = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  const { data: orders = [], isLoading } = useOrders();
  const updateOrderStatusMutation = useUpdateOrderStatus();

  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: "New", className: "bg-blue-100 text-blue-800" },
      preparing: { label: "Preparing", className: "bg-yellow-100 text-yellow-800" },
      ready: { label: "Ready", className: "bg-green-100 text-green-800" },
      served: { label: "Served", className: "bg-gray-100 text-gray-800" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({
        id: orderId,
        status: newStatus as any
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading orders...</div>
      </div>
    );
  }

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
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_name}</div>
                          <div className="text-sm text-gray-500">{order.customer_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.order_items?.map((item, index) => (
                            <div key={index} className="text-sm">
                              {item.quantity}x {item.menu_items?.name || 'Unknown Item'}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>${order.total_amount}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{formatTime(order.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {order.status === "new" && (
                            <Button 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, "preparing")}
                              disabled={updateOrderStatusMutation.isPending}
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Start
                            </Button>
                          )}
                          {order.status === "preparing" && (
                            <Button 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, "ready")}
                              disabled={updateOrderStatusMutation.isPending}
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
                              disabled={updateOrderStatusMutation.isPending}
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
