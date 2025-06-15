
import { useState } from "react";
import { useReservations } from "@/hooks/useReservations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Phone, Mail, MessageSquare } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminReservations = () => {
  const { data: reservations = [], isLoading } = useReservations();
  const { toast } = useToast();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const updateReservationStatus = async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    setUpdatingStatus(id);
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Reservation Updated",
        description: `Reservation status changed to ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reservation status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar isOpen={true} onToggle={() => {}} />
          <main className="flex-1 p-6">
            <SidebarTrigger />
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Loading reservations...</div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar isOpen={true} onToggle={() => {}} />
        <main className="flex-1 p-6">
          <SidebarTrigger />
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Reservation Management</h1>
              <div className="text-sm text-gray-600">
                Total: {reservations.length} reservations
              </div>
            </div>

            <div className="grid gap-6">
              {reservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {reservation.customer_name}
                      </CardTitle>
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>{new Date(reservation.reservation_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{reservation.reservation_time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>{reservation.guest_count} guests</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{reservation.customer_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{reservation.customer_phone}</span>
                        </div>
                        {reservation.special_requests && (
                          <div className="flex items-start gap-2 text-sm">
                            <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                            <span>{reservation.special_requests}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      {reservation.status === 'confirmed' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateReservationStatus(reservation.id, 'completed')}
                            disabled={updatingStatus === reservation.id}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Mark Completed
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                            disabled={updatingStatus === reservation.id}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {reservation.status === 'cancelled' && (
                        <Button
                          size="sm"
                          onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                          disabled={updatingStatus === reservation.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Reconfirm
                        </Button>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                      Confirmation ID: {reservation.confirmation_id}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {reservations.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations</h3>
                <p className="text-gray-600">No reservations have been made yet.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminReservations;
