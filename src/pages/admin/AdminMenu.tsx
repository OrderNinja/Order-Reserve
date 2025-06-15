
import { useState } from "react";
import { Plus, Edit, Trash2, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useMenuItems, useUpdateMenuItem, useDeleteMenuItem } from "@/hooks/useMenuItems";

const AdminMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data: menuItems = [], isLoading } = useMenuItems();
  const updateMenuItemMutation = useUpdateMenuItem();
  const deleteMenuItemMutation = useDeleteMenuItem();

  const categories = [
    { key: "all", label: "All Items" },
    ...Array.from(new Set(menuItems.map(item => item.category))).map(cat => ({
      key: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1)
    }))
  ];

  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const toggleAvailability = async (itemId: string, currentAvailability: boolean) => {
    try {
      await updateMenuItemMutation.mutateAsync({
        id: itemId,
        updates: { available: !currentAvailability }
      });
    } catch (error) {
      console.error('Failed to update item availability:', error);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteMenuItemMutation.mutateAsync(itemId);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading menu items...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Button>
          </div>
        </header>

        <div className="p-6">
          {/* Category Filter */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category.key}
                    variant={selectedCategory === category.key ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.key)}
                    size="sm"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Menu Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Menu Items ({filteredItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <Image className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>฿{item.price}</TableCell>
                      <TableCell>
                        <Badge 
                          className={item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant={item.available ? "secondary" : "default"}
                            onClick={() => toggleAvailability(item.id, item.available)}
                            disabled={updateMenuItemMutation.isPending}
                          >
                            {item.available ? "Disable" : "Enable"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteItem(item.id)}
                            disabled={deleteMenuItemMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
