
import { Link, useLocation } from "react-router-dom";
import { BarChart3, ShoppingBag, Menu as MenuIcon, Settings, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar = ({ isOpen, onToggle }: AdminSidebarProps) => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/admin",
      isActive: location.pathname === "/admin"
    },
    {
      title: "Orders",
      icon: ShoppingBag,
      href: "/admin/orders",
      isActive: location.pathname === "/admin/orders"
    },
    {
      title: "Menu",
      icon: MenuIcon,
      href: "/admin/menu",
      isActive: location.pathname === "/admin/menu"
    },
    {
      title: "Restaurant",
      icon: Settings,
      href: "/admin/restaurant",
      isActive: location.pathname === "/admin/restaurant"
    }
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50",
      isOpen ? "w-64" : "w-16"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
              <Utensils className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Admin Panel</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="hidden lg:flex"
        >
          <MenuIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  item.isActive
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="font-medium">{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
