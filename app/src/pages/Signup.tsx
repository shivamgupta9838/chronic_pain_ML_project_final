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
  User,
  Chrome,
  Github,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

export function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Account created successfully!');
      navigate('/dashboard');
    }, 1500);
  };

  const handleSocialSignup = (provider: string) => {
    toast.info(`${provider} signup coming soon!`);
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

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
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-slate-500">
              Start your journey to better pain management
            </CardDescription>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                1
              </div>
              <div className={`w-12 h-1 rounded-full ${step >= 2 ? 'bg-teal-500' : 'bg-slate-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                2
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                {/* Social Signup */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleSocialSignup('Google')}
                    className="gap-2"
                  >
                    <Chrome className="w-4 h-4" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleSocialSignup('GitHub')}
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
                    <span className="bg-white px-2 text-slate-500">Or continue with email</span>
                  </div>
                </div>

                {/* Step 1 Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-700">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className={`pl-10 ${errors.firstName ? 'border-rose-500' : ''}`}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-sm text-rose-500">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-700">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className={errors.lastName ? 'border-rose-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-rose-500">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

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
                        className={`pl-10 ${errors.email ? 'border-rose-500' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-rose-500">{errors.email}</p>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`pl-10 pr-10 ${errors.password ? 'border-rose-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              i <= getPasswordStrength() ? strengthColors[getPasswordStrength() - 1] : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${
                        getPasswordStrength() > 0 ? strengthColors[getPasswordStrength() - 1].replace('bg-', 'text-') : 'text-slate-500'
                      }`}>
                        {getPasswordStrength() > 0 ? strengthLabels[getPasswordStrength() - 1] : 'Enter password'}
                      </p>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="text-sm text-rose-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={errors.confirmPassword ? 'border-rose-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-rose-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, agreeTerms: checked as boolean })
                      }
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                      I agree to the{' '}
                      <Link to="/terms" className="text-teal-600 hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>
                      , and consent to the processing of my health data for pain management purposes.
                    </Label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-sm text-rose-500">{errors.agreeTerms}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Create Account
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Login Link */}
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-8">
          Your health data is encrypted and stored securely. HIPAA compliant.
        </p>
      </div>
    </div>
  );
}
