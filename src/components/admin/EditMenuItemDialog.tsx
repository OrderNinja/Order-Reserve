
import { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateMenuItem } from "@/hooks/useMenuItems";
import type { MenuItem } from "@/hooks/useMenuItems";

interface EditMenuItemDialogProps {
  menuItem: MenuItem;
}

const EditMenuItemDialog = ({ menuItem }: EditMenuItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: menuItem.name,
    description: menuItem.description,
    price: menuItem.price.toString(),
    category: menuItem.category,
    image_url: menuItem.image_url || "",
  });

  const updateMenuItemMutation = useUpdateMenuItem();

  const categories = [
    "appetizers",
    "mains", 
    "desserts",
    "beverages",
    "specials"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) return;

    try {
      await updateMenuItemMutation.mutateAsync({
        id: menuItem.id,
        updates: {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image_url: formData.image_url || null,
        }
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Failed to update menu item:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Menu item name"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Menu item description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="edit-category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="edit-price">Price (฿)</Label>
            <Input
              id="edit-price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-image">Image URL</Label>
            <Input
              id="edit-image"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={updateMenuItemMutation.isPending}
          >
            {updateMenuItemMutation.isPending ? "Updating..." : "Update Menu Item"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMenuItemDialog;
