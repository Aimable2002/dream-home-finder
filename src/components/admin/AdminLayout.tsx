import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Users,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { signOut } from "@/lib/api";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Add Property", path: "/admin/add-property", icon: PlusCircle },
  { name: "Manage Properties", path: "/admin/properties", icon: Building2 },
  { name: "Manage Team", path: "/admin/team", icon: Users },
  { name: "Messages", path: "/admin/messages", icon: Mail },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // On desktop, sidebarOpen toggles collapsed (icon-only) vs full width.
  // On mobile, sidebarOpen toggles the off-canvas drawer open/closed.
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Keep the drawer closed by default whenever we cross the mobile breakpoint.
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const closeOnMobile = () => {
    if (isMobile) setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      navigate("/admin");
    }
  };

  const collapsed = !isMobile && !sidebarOpen;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isMobile
            ? `fixed inset-y-0 left-0 w-72 z-50 transform transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : `${collapsed ? "w-20" : "w-64"} relative transition-all duration-300`
        } bg-primary text-primary-foreground flex flex-col h-full`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-primary-foreground/20 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3" onClick={closeOnMobile}>
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <span className="text-secondary-foreground font-heading font-bold text-lg">CK</span>
            </div>
            {(!collapsed || isMobile) && (
              <div>
                <span className="font-heading font-bold text-lg">CKIM</span>
                <span className="text-xs block text-primary-foreground/80 -mt-1">Admin Panel</span>
              </div>
            )}
          </Link>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeOnMobile}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-secondary text-secondary-foreground"
                        : "hover:bg-primary-foreground/10"
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {(!collapsed || isMobile) && <span className="font-medium">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-primary-foreground/20">
          {!isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors mb-2"
            >
              <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
              {!collapsed && <span>Collapse</span>}
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors text-primary-foreground/80"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {(!collapsed || isMobile) && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      {isMobile && !sidebarOpen && (
        <button
          className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 transition-all duration-300">
        <div className={`p-4 sm:p-6 lg:p-8 ${isMobile ? "pt-16" : ""}`}>{children}</div>
      </main>
    </div>
  );
}