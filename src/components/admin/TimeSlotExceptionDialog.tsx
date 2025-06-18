
import { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useCreateTimeSlotException } from "@/hooks/useTimeSlots";

const TimeSlotExceptionDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    exception_date: "",
    start_time: "",
    end_time: "",
    max_capacity: "30",
    is_available: false,
    reason: "",
  });

  const createExceptionMutation = useCreateTimeSlotException();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.exception_date || !formData.start_time || !formData.end_time || !formData.max_capacity) {
      return;
    }

    const exceptionData = {
      exception_date: formData.exception_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      max_capacity: parseInt(formData.max_capacity),
      is_available: formData.is_available,
      reason: formData.reason || undefined,
    };

    try {
      await createExceptionMutation.mutateAsync(exceptionData);
      setOpen(false);
      setFormData({
        exception_date: "",
        start_time: "",
        end_time: "",
        max_capacity: "30",
        is_available: false,
        reason: "",
      });
    } catch (error) {
      console.error('Failed to create exception:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Add Exception
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Time Slot Exception</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="exception_date">Date</Label>
            <Input
              id="exception_date"
              type="date"
              value={formData.exception_date}
              onChange={(e) => setFormData({ ...formData, exception_date: e.target.value })}
              required
            />
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
              min="0"
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

          <div>
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="e.g., Holiday closure, Special event, etc."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={createExceptionMutation.isPending}
          >
            {createExceptionMutation.isPending ? "Adding..." : "Add Exception"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotExceptionDialog;
