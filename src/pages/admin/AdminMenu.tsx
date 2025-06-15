
import { useState } from "react";
import { Plus, Edit, Trash2, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data - will be replaced with real database data
  const menuItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Fresh tomatoes, mozzarella, basil",
      price: 15.99,
      category: "pizza",
      image: "/placeholder.svg",
      available: true
    },
    {
      id: 2,
      name: "Chicken Burger",
      description: "Grilled chicken, lettuce, tomato, mayo",
      price: 14.99,
      category: "burgers",
      image: "/placeholder.svg",
      available: true
    },
    {
      id: 3,
      name: "Caesar Salad",
      description: "Romaine lettuce, parmesan, croutons, caesar dressing",
      price: 12.50,
      category: "salads",
      image: "/placeholder.svg",
      available: false
    },
    {
      id: 4,
      name: "Pasta Carbonara",
      description: "Spaghetti with eggs, pancetta, parmesan",
      price: 18.50,
      category: "pasta",
      image: "/placeholder.svg",
      available: true
    },
  ];

  const categories = [
    { key: "all", label: "All Items" },
    { key: "pizza", label: "Pizza" },
    { key: "burgers", label: "Burgers" },
    { key: "salads", label: "Salads" },
    { key: "pasta", label: "Pasta" }
  ];

  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const toggleAvailability = (itemId: number) => {
    console.log(`Toggling availability for item ${itemId}`);
    // This will be replaced with actual API call
  };

  const deleteItem = (itemId: number) => {
    console.log(`Deleting item ${itemId}`);
    // This will be replaced with actual API call
  };

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
                          <Image className="w-6 h-6 text-gray-400" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>${item.price}</TableCell>
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
                            onClick={() => toggleAvailability(item.id)}
                          >
                            {item.available ? "Disable" : "Enable"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteItem(item.id)}
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
