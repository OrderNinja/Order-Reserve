
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MenuOptionCategory {
  id: string;
  name: string;
  title: string;
  required: boolean;
  menu_item_id: string;
  choices?: MenuOptionChoice[];
  created_at: string;
  updated_at: string;
}

export interface MenuOptionChoice {
  id: string;
  label: string;
  price: number;
  category_id: string;
  created_at: string;
  updated_at: string;
}

export interface MenuAddOn {
  id: string;
  label: string;
  price: number;
  menu_item_id: string;
  created_at: string;
  updated_at: string;
}

export const useMenuOptions = (menuItemId?: string) => {
  return useQuery({
    queryKey: ['menu-options', menuItemId],
    queryFn: async () => {
      const { data: categories, error: categoriesError } = await supabase
        .from('menu_option_categories')
        .select(`
          *,
          choices:menu_option_choices(*)
        `)
        .eq('menu_item_id', menuItemId)
        .order('created_at', { ascending: true });
      
      if (categoriesError) throw categoriesError;

      const { data: addOns, error: addOnsError } = await supabase
        .from('menu_add_ons')
        .select('*')
        .eq('menu_item_id', menuItemId)
        .order('created_at', { ascending: true });
      
      if (addOnsError) throw addOnsError;

      return { categories: categories as MenuOptionCategory[], addOns: addOns as MenuAddOn[] };
    },
    enabled: !!menuItemId,
  });
};

export const useCreateOptionCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newCategory: Omit<MenuOptionCategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('menu_option_categories')
        .insert([newCategory])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-options'] });
      toast({
        title: "Option category created",
        description: "The new option category has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create option category: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateAddOn = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newAddOn: Omit<MenuAddOn, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('menu_add_ons')
        .insert([newAddOn])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-options'] });
      toast({
        title: "Add-on created",
        description: "The new add-on has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create add-on: " + error.message,
        variant: "destructive",
      });
    },
  });
};
