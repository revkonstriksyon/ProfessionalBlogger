import { ReactNode, useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  FolderOpen, 
  BarChart2, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifye si admin nan konekte
    const checkAuth = async () => {
      try {
        const response = await apiRequest("/api/admin/check-auth", {
          method: "GET",
        });
        setIsAuthenticated(response.authenticated === true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest("/api/admin/logout", {
        method: "POST",
      });
      
      toast({
        title: "Ou dekonekte",
        description: "Ou dekonekte avèk siksè nan panel admin nan",
      });
      
      // Redirije nan paj login
      window.location.href = "/admin/login";
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erè",
        description: "Te gen yon pwoblèm pandan dekoneksyon an",
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { href: "/admin/dashboard", icon: <LayoutDashboard size={20} />, label: "Tablo Debò" },
    { href: "/admin/articles", icon: <FileText size={20} />, label: "Atik yo" },
    { href: "/admin/categories", icon: <FolderOpen size={20} />, label: "Kategori yo" },
    { href: "/admin/media", icon: <ImageIcon size={20} />, label: "Medya" },
    { href: "/admin/statistics", icon: <BarChart2 size={20} />, label: "Estatistik" },
    { href: "/admin/comments", icon: <MessageSquare size={20} />, label: "Kòmantè yo" },
    { href: "/admin/settings", icon: <Settings size={20} />, label: "Paramèt" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white shadow-sm py-3 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
          <h1 className="text-lg font-semibold text-primary">Ayiti Nouvèl Admin</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center">
          <LogOut size={16} className="mr-2" /> Dekonekte
        </Button>
      </header>

      <div className="flex flex-1">
        {/* Side Navigation - Desktop */}
        <aside className="hidden md:flex md:w-64 bg-white shadow-sm flex-col p-4">
          <nav className="space-y-1 mt-2">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a 
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                    location === item.href 
                      ? "bg-primary text-primary-foreground" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white md:hidden">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-semibold text-lg">Meni</h2>
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  <X size={24} />
                </Button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a 
                      className={`flex items-center space-x-3 px-3 py-3 rounded-md ${
                        location === item.href 
                          ? "bg-primary text-primary-foreground" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" /> Dekonekte
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}