
import { useState } from "react";
import { Clock, Calendar, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminSidebar from "@/components/admin/AdminSidebar";
import TimeSlotDialog from "@/components/admin/TimeSlotDialog";
import TimeSlotExceptionDialog from "@/components/admin/TimeSlotExceptionDialog";
import { useTimeSlots, useTimeSlotExceptions, useDeleteTimeSlot, useDeleteTimeSlotException } from "@/hooks/useTimeSlots";

const AdminTimeSlots = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: timeSlots = [], isLoading: timeSlotsLoading } = useTimeSlots();
  const { data: exceptions = [], isLoading: exceptionsLoading } = useTimeSlotExceptions();
  const deleteTimeSlotMutation = useDeleteTimeSlot();
  const deleteExceptionMutation = useDeleteTimeSlotException();

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleDeleteTimeSlot = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      await deleteTimeSlotMutation.mutateAsync(id);
    }
  };

  const handleDeleteException = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this exception?')) {
      await deleteExceptionMutation.mutateAsync(id);
    }
  };

  if (timeSlotsLoading || exceptionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Loading time slots...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Time Slot Management</h1>
            <div className="flex gap-2">
              <TimeSlotDialog />
              <TimeSlotExceptionDialog />
            </div>
          </div>
        </header>

        <div className="p-6">
          <Tabs defaultValue="regular" className="space-y-6">
            <TabsList>
              <TabsTrigger value="regular" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Regular Time Slots
              </TabsTrigger>
              <TabsTrigger value="exceptions" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date Exceptions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="regular">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Time Slots</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeSlots.map((slot) => (
                        <TableRow key={slot.id}>
                          <TableCell className="font-medium">
                            {dayNames[slot.day_of_week]}
                          </TableCell>
                          <TableCell>
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </TableCell>
                          <TableCell>{slot.max_capacity} guests</TableCell>
                          <TableCell>
                            <Badge 
                              className={slot.is_available 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }
                            >
                              {slot.is_available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <TimeSlotDialog 
                                timeSlot={slot}
                                trigger={
                                  <Button size="sm" variant="outline">
                                    Edit
                                  </Button>
                                }
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteTimeSlot(slot.id)}
                                disabled={deleteTimeSlotMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {timeSlots.length === 0 && (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No time slots</h3>
                      <p className="text-gray-600 mb-4">Create your first time slot to start accepting reservations.</p>
                      <TimeSlotDialog />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exceptions">
              <Card>
                <CardHeader>
                  <CardTitle>Date Exceptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exceptions.map((exception) => (
                        <TableRow key={exception.id}>
                          <TableCell className="font-medium">
                            {new Date(exception.exception_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {formatTime(exception.start_time)} - {formatTime(exception.end_time)}
                          </TableCell>
                          <TableCell>{exception.max_capacity} guests</TableCell>
                          <TableCell>
                            <Badge 
                              className={exception.is_available 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }
                            >
                              {exception.is_available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {exception.reason || 'No reason specified'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteException(exception.id)}
                              disabled={deleteExceptionMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {exceptions.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No date exceptions</h3>
                      <p className="text-gray-600 mb-4">Add special date overrides for holidays or special events.</p>
                      <TimeSlotExceptionDialog />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminTimeSlots;
