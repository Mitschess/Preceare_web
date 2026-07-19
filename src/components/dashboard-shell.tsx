"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
  Check,
  AlertTriangle,
  Info,
  Moon,
  Globe,
  Shield,
  HelpCircle,
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
  const [notifications, setNotifications] = useState<{ id: number; type: "warning" | "success" | "info"; title: string; message: string; time: string; read: boolean; }[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const storedRole = localStorage.getItem("preecare_role") || "Nakes";
    const storedName = localStorage.getItem("preecare_name") || "User";
    setRole(storedRole);
    setUserName(storedName);

    let roleNotifs = [];
    if (storedRole === "Pasien") {
      roleNotifs = [
        {
          id: 101,
          type: "success" as const,
          title: "Hasil Screening Terbaru",
          message: `Halo ${storedName}, hasil screening terakhir Anda bernilai Risiko Rendah (97% Confidence). Tetap jaga kesehatan!`,
          time: "10 menit lalu",
          read: false,
        },
        {
          id: 102,
          type: "info" as const,
          title: "Jadwal Kontrol Terdekat",
          message: "Jadwal kontrol kehamilan Anda berikutnya adalah besok pagi pukul 09:00 WIB.",
          time: "1 jam lalu",
          read: false,
        },
        {
          id: 103,
          type: "info" as const,
          title: "Tips Kehamilan Sehat",
          message: "Perbanyak minum air putih (2-3 L/hari) dan lakukan aktivitas fisik ringan seperti jalan pagi.",
          time: "1 hari lalu",
          read: true,
        }
      ];
    } else if (storedRole === "Nakes") {
      roleNotifs = [
        {
          id: 201,
          type: "warning" as const,
          title: "Pasien Risiko Tinggi",
          message: "Dewi Lestari memerlukan perhatian segera — TD 168/102 mmHg",
          time: "5 menit lalu",
          read: false,
        },
        {
          id: 202,
          type: "info" as const,
          title: "Rujukan Diterima",
          message: "RS Cipto Mangunkusumo menerima rujukan untuk Dewi Lestari",
          time: "1 jam lalu",
          read: false,
        },
        {
          id: 203,
          type: "success" as const,
          title: "Screening Selesai",
          message: "Screening untuk Siti Aminah berhasil — Risiko Rendah",
          time: "2 jam lalu",
          read: false,
        },
        {
          id: 204,
          type: "info" as const,
          title: "Jadwal Kontrol Pasien",
          message: "Ratna Sari dijadwalkan kontrol besok pukul 09:00",
          time: "3 jam lalu",
          read: true,
        },
      ];
    } else if (storedRole === "Dokter RS") {
      roleNotifs = [
        {
          id: 301,
          type: "warning" as const,
          title: "Rujukan Masuk Baru",
          message: "Pasien Dewi Lestari (Risiko Tinggi) telah dirujuk dari Puskesmas Menteng ke rumah sakit Anda.",
          time: "15 menit lalu",
          read: false,
        },
        {
          id: 302,
          type: "info" as const,
          title: "Rujukan Dalam Proses",
          message: "Pasien Rina Wulandari (Risiko Sedang) dalam perjalanan rujukan ke RS Anda.",
          time: "2 jam lalu",
          read: false,
        },
        {
          id: 303,
          type: "info" as const,
          title: "Aksi Diperlukan",
          message: "Harap periksa rekam medis rujukan Dewi Lestari untuk menentukan tindakan pra-operasi.",
          time: "4 jam lalu",
          read: true,
        }
      ];
    } else {
      // Admin
      roleNotifs = [
        {
          id: 401,
          type: "success" as const,
          title: "Backup Database Sukses",
          message: "Backup database otomatis PREECARE berhasil dilakukan pukul 00:00 hari ini.",
          time: "1 jam lalu",
          read: false,
        },
        {
          id: 402,
          type: "info" as const,
          title: "Pembaruan Model AI",
          message: "Model klasifikasi risiko preeklamsia telah diperbarui dengan data pelatihan baru.",
          time: "3 jam lalu",
          read: false,
        },
        {
          id: 403,
          type: "success" as const,
          title: "Registrasi Faskes Baru",
          message: "Puskesmas Kelurahan Cikini telah berhasil diverifikasi dan terdaftar di sistem.",
          time: "5 jam lalu",
          read: true,
        }
      ];
    }

    setNotifications(roleNotifs);

    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = roleNavItems[role] || roleNavItems["Nakes"];

  const handleLogout = () => {
    localStorage.removeItem("preecare_role");
    localStorage.removeItem("preecare_email");
    localStorage.removeItem("preecare_name");
    router.push("/login");
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "success":
        return <Check className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0 h-screen overflow-hidden ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="animate-fadeIn min-w-0">
              <span className="text-lg font-bold">
                PREE<span className="text-[#0EA5E9]">CARE</span>
              </span>
              <div className="text-xs text-gray-400 truncate">{role}</div>
            </div>
          )}
        </div>

        {/* Navigation - scrollable middle section */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto min-h-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? "active" : ""} ${!sidebarOpen ? "justify-center !px-3" : ""}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom - always visible, not scrollable */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-1 flex-shrink-0 bg-white">
          <button
            onClick={() => setShowSettings(!showSettings)}
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
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slideInLeft flex flex-col">
            {/* Logo */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold">
                    PREE<span className="text-[#0EA5E9]">CARE</span>
                  </span>
                  <div className="text-xs text-gray-400">{role}</div>
                </div>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="btn btn-ghost !p-2 !rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto min-h-0">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${isActive ? "active" : ""}`}
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-gray-100 space-y-1 flex-shrink-0 bg-white">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  setShowSettings(true);
                }}
                className="nav-item w-full"
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span>Pengaturan</span>
              </button>
              <button
                onClick={handleLogout}
                className="nav-item w-full text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>Keluar</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Settings Modal (global, not inside sidebar) */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-scaleIn overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Pengaturan</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="btn btn-ghost !p-1.5 !rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-2">
              {[
                { icon: User, label: "Profil Saya", desc: "Edit data profil" },
                { icon: Shield, label: "Keamanan", desc: "Password & 2FA" },
                { icon: Bell, label: "Notifikasi", desc: "Preferensi notifikasi" },
                { icon: Globe, label: "Bahasa", desc: "Indonesia" },
                { icon: Moon, label: "Tema", desc: "Terang" },
                { icon: HelpCircle, label: "Bantuan", desc: "Pusat bantuan" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowSettings(false)}
                >
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-red-500 font-medium hover:text-red-600 py-1 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Keluar dari akun
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 z-40">
          <div className="flex items-center gap-3">
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
                className={`w-5 h-5 transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900">
                {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                {currentDate || "Memuat..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                id="notif-btn"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications((v) => !v);
                  setShowSettings(false);
                }}
                className="relative btn btn-ghost !p-2 !rounded-xl"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[100] animate-scaleIn overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-[#0EA5E9] font-medium hover:underline"
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`w-full text-left px-5 py-3 flex gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                          !notif.read ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900 truncate">
                              {notif.title}
                            </span>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[#0EA5E9] flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {notif.time}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-gray-100 text-center">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-sm text-[#0EA5E9] font-medium hover:underline"
                    >
                      Lihat semua notifikasi
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings button in topbar (desktop) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings((v) => !v);
                setShowNotifications(false);
              }}
              className="hidden sm:flex btn btn-ghost !p-2 !rounded-xl"
              title="Pengaturan"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* User */}
            <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-gray-200">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
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
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
