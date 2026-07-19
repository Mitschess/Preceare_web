"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Heart,
  LayoutDashboard,
  Users,
  Activity,
  FileText,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  Bell,
  User,
  Menu,
  X,
  Stethoscope,
  ClipboardList,
  Send,
  Database,
  Brain,
  BarChart3,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const roleNavItems: Record<string, NavItem[]> = {
  Pasien: [
    { href: "/dashboard/pasien", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/pasien/screening", label: "Hasil Screening", icon: Activity },
    { href: "/dashboard/pasien/riwayat", label: "Riwayat", icon: FileText },
    { href: "/dashboard/pasien/rujukan", label: "Status Rujukan", icon: Send },
  ],
  Nakes: [
    { href: "/dashboard/nakes", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/nakes/pasien", label: "Pasien", icon: Users },
    { href: "/dashboard/nakes/screening", label: "Screening", icon: Stethoscope },
    { href: "/dashboard/nakes/monitoring", label: "Monitoring", icon: BarChart3 },
    { href: "/dashboard/nakes/rujukan", label: "Rujukan", icon: Send },
  ],
  "Dokter RS": [
    { href: "/dashboard/dokter", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/dokter/rujukan", label: "Pasien Rujukan", icon: ClipboardList },
    { href: "/dashboard/dokter/riwayat", label: "Riwayat Pasien", icon: FileText },
  ],
  Admin: [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Kelola User", icon: Users },
    { href: "/dashboard/admin/facilities", label: "Fasilitas Kesehatan", icon: Building2 },
    { href: "/dashboard/admin/database", label: "Database", icon: Database },
    { href: "/dashboard/admin/ai", label: "Kelola AI", icon: Brain },
  ],
};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [role, setRole] = useState("Nakes");
  const [userName, setUserName] = useState("User");
  const [currentDate, setCurrentDate] = useState("");
  const [notifications] = useState(3);

  useEffect(() => {
    const storedRole = localStorage.getItem("preecare_role") || "Nakes";
    const storedName = localStorage.getItem("preecare_name") || "User";
    setRole(storedRole);
    setUserName(storedName);

    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  const navItems = roleNavItems[role] || roleNavItems["Nakes"];

  const handleLogout = () => {
    localStorage.removeItem("preecare_role");
    localStorage.removeItem("preecare_email");
    localStorage.removeItem("preecare_name");
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <Heart className="w-5 h-5 text-white" />
        </div>
        {sidebarOpen && (
          <div className="animate-fadeIn">
            <span className="text-lg font-bold">
              PREE<span className="text-[#0EA5E9]">CARE</span>
            </span>
            <div className="text-xs text-gray-400">{role}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""} ${!sidebarOpen ? "justify-center !px-3" : ""}`}
              title={!sidebarOpen ? item.label : undefined}
              onClick={() => setMobileSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <button
          onClick={() => {}}
          className={`nav-item w-full ${!sidebarOpen ? "justify-center !px-3" : ""}`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Pengaturan</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`nav-item w-full text-red-500 hover:bg-red-50 hover:text-red-600 ${!sidebarOpen ? "justify-center !px-3" : ""}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Keluar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slideInLeft">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden btn btn-ghost !p-2 !rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex btn btn-ghost !p-2 !rounded-xl"
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
              </h1>
              <p className="text-xs text-gray-400">
                {currentDate || "Memuat..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative btn btn-ghost !p-2 !rounded-xl">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* User */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">{userName}</div>
                <div className="text-xs text-gray-400">{role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
