
import { useState } from "react";
import { useReservations } from "@/hooks/useReservations";
import { useTimeSlots, useTimeSlotExceptions } from "@/hooks/useTimeSlots";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, Phone, Mail, MessageSquare, Settings } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import TimeSlotDialog from "@/components/admin/TimeSlotDialog";
import TimeSlotExceptionDialog from "@/components/admin/TimeSlotExceptionDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminReservations = () => {
  const { data: reservations = [], isLoading } = useReservations();
  const { data: timeSlots = [] } = useTimeSlots();
  const { data: timeSlotExceptions = [] } = useTimeSlotExceptions();
  const { toast } = useToast();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Reservation Management</h1>
            <div className="text-sm text-gray-600">
              Total: {reservations.length} reservations
            </div>
          </div>
        </header>

        <div className="p-6">
          <Tabs defaultValue="reservations" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reservations">Reservations</TabsTrigger>
              <TabsTrigger value="time-slots">Time Slots</TabsTrigger>
              <TabsTrigger value="exceptions">Date Exceptions</TabsTrigger>
            </TabsList>

            <TabsContent value="reservations" className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Card>
                  <CardHeader>
                    <CardTitle>All Reservations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Guests</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservations.map((reservation) => (
                          <TableRow key={reservation.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{reservation.customer_name}</div>
                                <div className="text-xs text-gray-500">ID: {reservation.confirmation_id}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-sm">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(reservation.reservation_date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <Clock className="w-3 h-3" />
                                  {reservation.reservation_time}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {reservation.guest_count}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs">
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate max-w-[120px]">{reservation.customer_email}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                  <Phone className="w-3 h-3" />
                                  {reservation.customer_phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(reservation.status)}>
                                {reservation.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {reservation.status === 'confirmed' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => updateReservationStatus(reservation.id, 'completed')}
                                      disabled={updatingStatus === reservation.id}
                                      className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1 h-auto"
                                    >
                                      Complete
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                                      disabled={updatingStatus === reservation.id}
                                      className="text-xs px-2 py-1 h-auto"
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
                                    className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-auto"
                                  >
                                    Reconfirm
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

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {reservations.map((reservation) => (
                  <Card key={reservation.id} className="w-full">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{reservation.customer_name}</CardTitle>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        Confirmation ID: {reservation.confirmation_id}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
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
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="truncate">{reservation.customer_email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{reservation.customer_phone}</span>
                          </div>
                        </div>
                      </div>

                      {reservation.special_requests && (
                        <div className="pt-2 border-t">
                          <div className="flex items-start gap-2 text-sm">
                            <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                            <span className="text-gray-700">{reservation.special_requests}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        {reservation.status === 'confirmed' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateReservationStatus(reservation.id, 'completed')}
                              disabled={updatingStatus === reservation.id}
                              className="bg-blue-600 hover:bg-blue-700 flex-1"
                            >
                              Mark Completed
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                              disabled={updatingStatus === reservation.id}
                              className="flex-1"
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
                            className="bg-green-600 hover:bg-green-700 w-full"
                          >
                            Reconfirm
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {reservations.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No reservations</h3>
                  <p className="text-gray-600">No reservations have been made yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="time-slots" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Weekly Time Slots
                    </CardTitle>
                    <TimeSlotDialog />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeSlots.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="font-medium">{getDayName(slot.day_of_week)}</div>
                          <div className="text-sm text-gray-600">
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Capacity: {slot.max_capacity}
                          </div>
                          <Badge variant={slot.is_available ? "default" : "secondary"}>
                            {slot.is_available ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                        <TimeSlotDialog timeSlot={slot} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exceptions" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Date Exceptions
                    </CardTitle>
                    <TimeSlotExceptionDialog />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeSlotExceptions.map((exception) => (
                      <div key={exception.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="font-medium">
                            {new Date(exception.exception_date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatTime(exception.start_time)} - {formatTime(exception.end_time)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Capacity: {exception.max_capacity}
                          </div>
                          <Badge variant={exception.is_available ? "default" : "secondary"}>
                            {exception.is_available ? "Available" : "Unavailable"}
                          </Badge>
                          {exception.reason && (
                            <div className="text-sm text-gray-500 italic">
                              {exception.reason}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {timeSlotExceptions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No date exceptions configured
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminReservations;
