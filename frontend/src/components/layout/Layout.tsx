import { Sidebar } from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { clearSession } from '@/lib/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar onLogout={handleLogout} />
      <main className="min-h-screen lg:ml-64 lg:pt-0 pt-16">
        <div className="mx-auto max-w-7xl p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
