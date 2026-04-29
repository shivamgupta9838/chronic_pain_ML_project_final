import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  BrainCircuit, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Chrome,
  Github
} from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Welcome back!');
      navigate('/dashboard');
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">PainAI</h1>
              <p className="text-xs text-slate-500">Chronic Pain Management</p>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-800">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-slate-500">
              Sign in to access your pain management dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="gap-2"
              >
                <Chrome className="w-4 h-4" />
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                className="gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or continue with</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`pl-10 ${errors.email ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-rose-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`pl-10 pr-10 ${errors.password ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-rose-500">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, rememberMe: checked as boolean })
                    }
                  />
                  <Label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-medium">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-8">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-teal-600 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
