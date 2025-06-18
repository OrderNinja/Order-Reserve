
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TimeSlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_capacity: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlotException {
  id: string;
  exception_date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  is_available: boolean;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export const useTimeSlots = () => {
  return useQuery({
    queryKey: ['timeSlots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      return data as TimeSlot[];
    },
  });
};

export const useTimeSlotExceptions = () => {
  return useQuery({
    queryKey: ['timeSlotExceptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('time_slot_exceptions')
        .select('*')
        .order('exception_date', { ascending: true })
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      return data as TimeSlotException[];
    },
  });
};

export const useCreateTimeSlot = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (timeSlotData: Omit<TimeSlot, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('time_slots')
        .insert(timeSlotData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
      toast({
        title: "Time slot created",
        description: "New time slot has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create time slot: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTimeSlot = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TimeSlot> }) => {
      const { data, error } = await supabase
        .from('time_slots')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
      toast({
        title: "Time slot updated",
        description: "Time slot has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update time slot: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTimeSlot = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
      toast({
        title: "Time slot deleted",
        description: "Time slot has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete time slot: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateTimeSlotException = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (exceptionData: Omit<TimeSlotException, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('time_slot_exceptions')
        .insert(exceptionData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSlotExceptions'] });
      toast({
        title: "Exception created",
        description: "Time slot exception has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create exception: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTimeSlotException = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('time_slot_exceptions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSlotExceptions'] });
      toast({
        title: "Exception deleted",
        description: "Time slot exception has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete exception: " + error.message,
        variant: "destructive",
      });
    },
  });
};
