import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  History, 
  LogOut, 
  Menu,
  BrainCircuit
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
  { path: '/profile', label: 'Profile', icon: User },
];

export function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-slate-200">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-800 leading-tight">PainAI</span>
            <span className="text-xs text-slate-500">Management System</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-teal-50 text-teal-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
              `}
            >
              <Icon className={`
                w-5 h-5 transition-colors
                ${isActive ? 'text-teal-600' : 'text-slate-500 group-hover:text-slate-700'}
              `} />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-200 space-y-2">
        {/* Collapse Button (Desktop only) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex w-full justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <span className="text-xs">Collapse Sidebar</span>}
        </Button>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full flex items-center gap-3 text-slate-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-800">PainAI</span>
        </div>
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

      {/* Desktop Sidebar */}
      <aside className={`
        hidden lg:flex fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-40
        transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        <NavContent />
      </aside>
    </>
  );
}
