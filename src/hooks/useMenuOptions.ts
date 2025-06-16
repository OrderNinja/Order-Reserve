
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
      // Use type assertion to bypass TypeScript checking for new tables
      const { data: categories, error: categoriesError } = await (supabase as any)
        .from('menu_option_categories')
        .select(`
          *,
          choices:menu_option_choices(*)
        `)
        .eq('menu_item_id', menuItemId)
        .order('created_at', { ascending: true });
      
      if (categoriesError) {
        console.error('Categories error:', categoriesError);
        throw categoriesError;
      }

      const { data: addOns, error: addOnsError } = await (supabase as any)
        .from('menu_add_ons')
        .select('*')
        .eq('menu_item_id', menuItemId)
        .order('created_at', { ascending: true });
      
      if (addOnsError) {
        console.error('Add-ons error:', addOnsError);
        throw addOnsError;
      }

      return { 
        categories: categories as MenuOptionCategory[], 
        addOns: addOns as MenuAddOn[] 
      };
    },
    enabled: !!menuItemId,
  });
};

export const useCreateOptionCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newCategory: Omit<MenuOptionCategory, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating category:', newCategory);
      const { data, error } = await (supabase as any)
        .from('menu_option_categories')
        .insert([newCategory])
        .select()
        .single();
      
      if (error) {
        console.error('Category creation error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-options'] });
      toast({
        title: "Option category created",
        description: "The new option category has been added successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Category mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to create option category. Make sure the database tables are created.",
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
      console.log('Creating add-on:', newAddOn);
      const { data, error } = await (supabase as any)
        .from('menu_add_ons')
        .insert([newAddOn])
        .select()
        .single();
      
      if (error) {
        console.error('Add-on creation error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-options'] });
      toast({
        title: "Add-on created",
        description: "The new add-on has been added successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Add-on mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to create add-on. Make sure the database tables are created.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteAddOn = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (addOnId: string) => {
      const { error } = await (supabase as any)
        .from('menu_add_ons')
        .delete()
        .eq('id', addOnId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-options'] });
      toast({
        title: "Add-on deleted",
        description: "The add-on has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete add-on: " + error.message,
        variant: "destructive",
      });
    },
  });
};
