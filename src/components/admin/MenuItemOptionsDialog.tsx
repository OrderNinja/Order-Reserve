import { useState } from "react";
import { Settings, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMenuOptions, useCreateAddOn, useDeleteAddOn } from "@/hooks/useMenuOptions";

interface MenuItemOptionsDialogProps {
  menuItemId: string;
  menuItemName: string;
}

const MenuItemOptionsDialog = ({ menuItemId, menuItemName }: MenuItemOptionsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newAddOn, setNewAddOn] = useState({ label: "", price: "" });
  
  const { data: options, isLoading, error } = useMenuOptions(menuItemId);
  const createAddOnMutation = useCreateAddOn();
  const deleteAddOnMutation = useDeleteAddOn();

  const handleAddOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAddOn.label || !newAddOn.price) return;

    try {
      await createAddOnMutation.mutateAsync({
        label: newAddOn.label,
        price: parseFloat(newAddOn.price),
        menu_item_id: menuItemId
      });
      
      setNewAddOn({ label: "", price: "" });
    } catch (error) {
      console.error('Failed to create add-on:', error);
    }
  };

  const handleDeleteAddOn = async (addOnId: string) => {
    if (window.confirm('Are you sure you want to delete this add-on?')) {
      try {
        await deleteAddOnMutation.mutateAsync(addOnId);
      } catch (error) {
        console.error('Failed to delete add-on:', error);
      }
    }
  };

  if (isLoading) {
    return null;
  }

  // Show error message if database tables don't exist
  if (error) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Database Setup Required</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-sm text-gray-600">
              The menu options feature requires database tables to be created. 
              Please run the database migration first.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Options for {menuItemName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add-ons Section */}
          <Card>
            <CardHeader>
              <CardTitle>Add-ons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Existing Add-ons */}
                {options?.addOns && options.addOns.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Current Add-ons</h4>
                    {options.addOns.map((addOn) => (
                      <div key={addOn.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{addOn.label}</span>
                          <span className="ml-2 text-sm text-gray-600">฿{addOn.price}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500"
                          onClick={() => handleDeleteAddOn(addOn.id)}
                          disabled={deleteAddOnMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Add-on */}
                <form onSubmit={handleAddOnSubmit} className="border-t pt-4">
                  <h4 className="font-medium mb-3">Add New Add-on</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="addon-label">Add-on Name</Label>
                      <Input
                        id="addon-label"
                        value={newAddOn.label}
                        onChange={(e) => setNewAddOn({ ...newAddOn, label: e.target.value })}
                        placeholder="e.g., Extra Cheese"
                      />
                    </div>
                    <div>
                      <Label htmlFor="addon-price">Price (฿)</Label>
                      <Input
                        id="addon-price"
                        type="number"
                        value={newAddOn.price}
                        onChange={(e) => setNewAddOn({ ...newAddOn, price: e.target.value })}
                        placeholder="e.g., 25"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="mt-3"
                    disabled={createAddOnMutation.isPending || !newAddOn.label || !newAddOn.price}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {createAddOnMutation.isPending ? "Adding..." : "Add Add-on"}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemOptionsDialog;
