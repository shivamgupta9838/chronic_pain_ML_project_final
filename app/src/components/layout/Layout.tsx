import { Sidebar } from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth state (mock)
    localStorage.removeItem('isAuthenticated');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar onLogout={handleLogout} />
      
      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
