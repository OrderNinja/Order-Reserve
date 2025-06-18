
import { useState, useEffect } from "react";
import { Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateTimeSlot, useUpdateTimeSlot, type TimeSlot } from "@/hooks/useTimeSlots";

interface TimeSlotDialogProps {
  timeSlot?: TimeSlot;
  trigger?: React.ReactNode;
}

const TimeSlotDialog = ({ timeSlot, trigger }: TimeSlotDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: timeSlot?.day_of_week?.toString() || "",
    start_time: timeSlot?.start_time || "",
    end_time: timeSlot?.end_time || "",
    max_capacity: timeSlot?.max_capacity?.toString() || "30",
    is_available: timeSlot?.is_available ?? true,
  });

  const createTimeSlotMutation = useCreateTimeSlot();
  const updateTimeSlotMutation = useUpdateTimeSlot();

  const dayOptions = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
  ];

  useEffect(() => {
    if (timeSlot) {
      setFormData({
        day_of_week: timeSlot.day_of_week.toString(),
        start_time: timeSlot.start_time,
        end_time: timeSlot.end_time,
        max_capacity: timeSlot.max_capacity.toString(),
        is_available: timeSlot.is_available,
      });
    }
  }, [timeSlot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.day_of_week || !formData.start_time || !formData.end_time || !formData.max_capacity) {
      return;
    }

    const timeSlotData = {
      day_of_week: parseInt(formData.day_of_week),
      start_time: formData.start_time,
      end_time: formData.end_time,
      max_capacity: parseInt(formData.max_capacity),
      is_available: formData.is_available,
    };

    try {
      if (timeSlot) {
        await updateTimeSlotMutation.mutateAsync({
          id: timeSlot.id,
          updates: timeSlotData
        });
      } else {
        await createTimeSlotMutation.mutateAsync(timeSlotData);
      }
      
      setOpen(false);
      if (!timeSlot) {
        setFormData({
          day_of_week: "",
          start_time: "",
          end_time: "",
          max_capacity: "30",
          is_available: true,
        });
      }
    } catch (error) {
      console.error('Failed to save time slot:', error);
    }
  };

  const defaultTrigger = (
    <Button size="sm" variant={timeSlot ? "outline" : "default"}>
      {timeSlot ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />}
      {timeSlot ? "" : "Add Time Slot"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {timeSlot ? "Edit Time Slot" : "Add New Time Slot"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="day_of_week">Day of Week</Label>
            <Select
              value={formData.day_of_week}
              onValueChange={(value) => setFormData({ ...formData, day_of_week: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {dayOptions.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="max_capacity">Max Capacity</Label>
            <Input
              id="max_capacity"
              type="number"
              value={formData.max_capacity}
              onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
              placeholder="30"
              min="1"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_available"
              checked={formData.is_available}
              onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
            />
            <Label htmlFor="is_available">Available for reservations</Label>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={createTimeSlotMutation.isPending || updateTimeSlotMutation.isPending}
          >
            {(createTimeSlotMutation.isPending || updateTimeSlotMutation.isPending) 
              ? "Saving..." 
              : timeSlot ? "Update Time Slot" : "Add Time Slot"
            }
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotDialog;
