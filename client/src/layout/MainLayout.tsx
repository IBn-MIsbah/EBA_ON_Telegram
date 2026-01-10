import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Users,
} from "lucide-react";
import { toast } from "sonner";

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoading, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogOut = async () => {
    try {
      await logout();
      navigate("/login");
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout err: ", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf8] dark:bg-[#0a0f0b]">
        <div className="relative flex items-center justify-center">
          <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13ec37] opacity-20"></div>
          <div className="relative rounded-full h-12 w-12 border-t-4 border-[#13ec37] animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-[#0a0f0b] text-slate-900 dark:text-white">
      {/* --- MOBILE HEADER --- */}
      <header className="md:hidden sticky top-0 z-40 bg-white/80 dark:bg-[#0a0f0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 bg-[#13ec37] rounded-lg flex items-center justify-center shadow-lg shadow-[#13ec37]/20">
            <ShoppingBag size={18} className="text-black" />
          </div>
          <span className="font-black uppercase tracking-tighter text-lg">
            EBA Admin
          </span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 dark:text-slate-400"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div className="flex">
        {/* --- DESKTOP SIDEBAR --- */}
        <aside className="hidden md:flex w-72 h-screen sticky top-0 flex-col bg-white dark:bg-[#111c13] border-r border-slate-200 dark:border-slate-800 p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="size-10 bg-[#13ec37] rounded-xl flex items-center justify-center shadow-xl">
              <ShoppingBag size={24} className="text-black" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              EBA Admin
            </h1>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarLink
              to="/"
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              active={isActive("/")}
            />
            <SidebarLink
              to="/orders"
              icon={<ShoppingBag size={20} />}
              label="View Orders"
              active={isActive("/orders")}
            />
            <SidebarLink
              to="/create-product"
              icon={<PlusCircle size={20} />}
              label="Add Product"
              active={isActive("/create-product")}
            />
            <SidebarLink
              to="/users"
              icon={<Users size={20} />}
              label="Manage users"
              active={isActive("/users")}
            />
            <SidebarLink
              to="/settings"
              icon={<Settings size={20} />}
              label="Settings"
              active={isActive("/settings")}
            />
          </nav>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6 p-2">
              <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[#13ec37]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Administrator
                </p>
              </div>
            </div>
            <button
              onClick={handleLogOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 min-w-0 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#111c13]/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center">
        <MobileNavLink
          to="/"
          icon={<LayoutDashboard size={22} />}
          active={isActive("/")}
        />
        <MobileNavLink
          to="/orders"
          icon={<ShoppingBag size={22} />}
          active={isActive("/orders")}
        />
        <Link
          to="/create-product"
          className="bg-[#13ec37] p-4 rounded-full -mt-12 shadow-2xl border-4 border-[#f8faf8] dark:border-[#0a0f0b] text-black active:scale-90 transition-transform"
        >
          <PlusCircle size={24} />
        </Link>
        <MobileNavLink
          to="/settings"
          icon={<Settings size={22} />}
          active={isActive("/settings")}
        />
        <button onClick={handleLogOut} className="p-2 text-slate-400">
          <LogOut size={22} />
        </button>
      </nav>
    </div>
  );
};

/* --- Sub-Components --- */

const SidebarLink = ({ to, icon, label, active }: any) => (
  <Link
    to={to}
    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
      active
        ? "bg-[#13ec37] text-black shadow-lg shadow-[#13ec37]/20"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      {label}
    </div>
    {active && <ChevronRight size={14} />}
  </Link>
);

const MobileNavLink = ({ to, icon, active }: any) => (
  <Link
    to={to}
    className={`p-2 transition-colors ${
      active ? "text-[#13ec37]" : "text-slate-400"
    }`}
  >
    {icon}
  </Link>
);

export default MainLayout;
