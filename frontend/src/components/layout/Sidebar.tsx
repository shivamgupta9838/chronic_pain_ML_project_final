import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  History,
  LogOut,
  Menu,
  BrainCircuit,
  FileDown,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface SidebarProps {
  onLogout?: () => void;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/history', label: 'History', icon: History },
  { path: '/downloads', label: 'Download Reports', icon: FileDown },
  { path: '/profile', label: 'Profile', icon: User },
];

export function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-3 border-b border-slate-200 px-4 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-slate-800">PainAI</span>
            <span className="text-xs text-slate-500">Management System</span>
          </div>
        )}
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                group flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200
                ${isActive ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
              `}
            >
              <Icon
                className={`
                  h-5 w-5 transition-colors
                  ${isActive ? 'text-teal-600' : 'text-slate-500 group-hover:text-slate-700'}
                `}
              />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              {isActive && !isCollapsed && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-500" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-slate-200 p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden w-full justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:flex"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <span className="text-xs">Collapse Sidebar</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="flex w-full items-center gap-3 text-slate-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-800">PainAI</span>
        </Link>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      <aside
        className={`
          fixed left-0 top-0 z-40 hidden h-screen border-r border-slate-200 bg-white transition-all duration-300 lg:flex
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <NavContent />
      </aside>
    </>
  );
}
