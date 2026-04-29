import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { BrainCircuit, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { loginUser } from '@/lib/api';
import { setSession } from '@/lib/auth';

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
    try {
      const session = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      setSession(session.accessToken, session.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">PainAI</h1>
              <p className="text-xs text-slate-500">Chronic Pain Management</p>
            </div>
          </Link>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-center text-2xl font-bold text-slate-800">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-slate-500">
              Sign in to access your pain management dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <GoogleSignInButton onSuccess={() => navigate('/dashboard')} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or continue with</span>
              </div>
            </div>

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
                {errors.email && <p className="text-sm text-rose-500">{errors.email}</p>}
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
                {errors.password && <p className="text-sm text-rose-500">{errors.password}</p>}
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
                  <Label htmlFor="remember" className="cursor-pointer text-sm text-slate-600">
                    Remember me
                  </Label>
                </div>
                <span className="text-sm font-medium text-slate-400">
                  Change password is available in Profile
                </span>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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

            <p className="text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-teal-600 hover:text-teal-700">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-slate-500">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-teal-600 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
