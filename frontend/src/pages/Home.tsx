import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BrainCircuit,
  Upload,
  Activity,
  TrendingUp,
  Shield,
  Clock,
  FileSpreadsheet,
  BarChart3,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { isAuthenticated } from '@/lib/auth';

export function Home() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const loggedIn = isAuthenticated();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const goToPrimaryRoute = () => {
    navigate(loggedIn ? '/dashboard' : '/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button className="flex items-center gap-2" onClick={() => navigate('/')}>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">PainAI</span>
            </button>

            <div className="hidden items-center gap-8 md:flex">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm text-slate-600 transition-colors hover:text-teal-600"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-sm text-slate-600 transition-colors hover:text-teal-600"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('technology')}
                className="text-sm text-slate-600 transition-colors hover:text-teal-600"
              >
                Technology
              </button>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              {loggedIn ? (
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700"
                >
                  Dashboard
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')} className="text-slate-600">
                    Sign In
                  </Button>
                  <Button
                    onClick={() => navigate('/login')}
                    className="gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700"
                  >
                    Get Started
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            <button className="p-2 md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="space-y-3 border-t border-slate-100 bg-white px-4 py-4 md:hidden">
            <button onClick={() => scrollToSection('how-it-works')} className="block w-full py-2 text-left text-slate-600">
              How It Works
            </button>
            <button onClick={() => scrollToSection('features')} className="block w-full py-2 text-left text-slate-600">
              Features
            </button>
            <button onClick={() => scrollToSection('technology')} className="block w-full py-2 text-left text-slate-600">
              Technology
            </button>
            <div className="space-y-2 border-t border-slate-100 pt-3">
              {loggedIn ? (
                <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white" onClick={() => navigate('/login')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <Badge className="mb-6 border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-50">
                <Sparkles className="mr-1 h-3 w-3" />
                AI-Powered Healthcare
              </Badge>

              <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Predict & Manage
                <span className="block bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                  Chronic Pain with AI
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-xl text-lg text-slate-600 lg:mx-0">
                Upload your wearable sensor data and let our machine learning models
                predict your pain levels, helping you take control of your chronic
                pain management journey.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Button
                  size="lg"
                  onClick={goToPrimaryRoute}
                  className="gap-2 text-base bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700"
                >
                  {loggedIn ? 'Go to Dashboard' : 'Get Started Free'}
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('how-it-works')}
                  className="gap-2 text-base"
                >
                  Learn More
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 lg:justify-start">
                
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  Free to Start
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rotate-3 rounded-3xl bg-gradient-to-br from-teal-100 to-cyan-100 opacity-50" />
              <Card className="relative border-0 bg-white/90 shadow-xl backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Predicted Pain Score</p>
                        <p className="text-4xl font-bold text-teal-600">
                          5.2<span className="text-lg text-slate-400">/8</span>
                        </p>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50">
                        <Activity className="w-7 h-7 text-teal-500" />
                      </div>
                    </div>

                    <div className="flex h-32 items-end gap-2">
                      {[4, 5, 4.5, 6, 5.5, 5.2, 4.8].map((height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t bg-gradient-to-t from-teal-500 to-cyan-400"
                          style={{ height: `${height * 15}%` }}
                        />
                      ))}
                    </div>

                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-5 h-5 text-teal-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">wearable_data.csv</p>
                          <p className="text-xs text-slate-500">Processed 2 min ago</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="technology" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <Badge className="mb-4 border-cyan-200 bg-cyan-50 text-cyan-700">
              <Zap className="mr-1 h-3 w-3" />
              How It Works
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              CSV Upload + ML Prediction Workflow
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Our advanced machine learning pipeline analyzes your wearable sensor data
              to predict pain levels with high accuracy.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Upload,
                step: '1',
                title: 'Upload CSV Data',
                description: 'Upload your wearable sensor data in CSV format. We support:',
                items: ['BVP', 'EDA', 'ACC (X,Y,Z)', 'TEMP'],
                iconClass: 'bg-teal-100 text-teal-600',
                stepClass: 'bg-teal-500',
              },
              {
                icon: BrainCircuit,
                step: '2',
                title: 'AI Processing',
                description: 'Our ML models analyze physiological signals to detect pain patterns:',
                items: ['Deep Learning', 'Signal Processing', 'Pattern Recognition'],
                iconClass: 'bg-cyan-100 text-cyan-600',
                stepClass: 'bg-cyan-500',
              },
              {
                icon: BarChart3,
                step: '3',
                title: 'Get Predictions',
                description: 'Receive pain level predictions and insights to manage your condition:',
                items: ['Pain Score (1-8)', 'Trend Analysis', 'Personalized Insights'],
                iconClass: 'bg-indigo-100 text-indigo-600',
                stepClass: 'bg-indigo-500',
              },
            ].map((item) => (
              <Card key={item.step} className="border-0 bg-white shadow-lg">
                <CardContent className="p-8">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${item.iconClass.split(' ')[0]}`}>
                    <item.icon className={`w-7 h-7 ${item.iconClass.split(' ')[1]}`} />
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white ${item.stepClass}`}>
                      {item.step}
                    </span>
                    <h3 className="text-xl font-semibold text-slate-800">{item.title}</h3>
                  </div>
                  <p className="mb-4 text-slate-600">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.items.map((value) => (
                      <span key={value} className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                        {value}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">Simple 3-Step Process</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Start managing your chronic pain in minutes with our easy-to-use platform.
            </p>
          </div>

          <div className="space-y-16">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="order-2 md:order-1">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-xs text-white">1</span>
                  Create Your Account
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900">Sign up in seconds</h3>
                <p className="mb-6 text-slate-600">
                  Create your free account with just your email. No credit card required.
                  Your health data is protected with bank-level encryption and HIPAA compliance.
                </p>
                <ul className="space-y-3">
                  {['Free account creation', 'Secure data encryption', 'Privacy-first approach'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-teal-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
                  <div className="rounded-xl bg-white p-6 shadow-lg">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600">
                        <span className="font-bold text-white">JD</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Abhijeet Kumar</p>
                        <p className="text-sm text-slate-500">abhijeet@example.com</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded-full bg-slate-100" />
                      <div className="h-2 w-3/4 rounded-full bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <div className="rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
                  <div className="rounded-xl bg-white p-6 shadow-lg">
                    <div className="mb-4 flex items-center gap-3 rounded-lg bg-teal-50 p-4">
                      <FileSpreadsheet className="h-8 w-8 text-teal-500" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">wearable_data.csv</p>
                        <p className="text-sm text-slate-500">2.4 MB</p>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-teal-100">
                      <div className="h-full w-3/4 rounded-full bg-teal-500" />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Uploading... 75%</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs text-white">2</span>
                  Upload Your Data
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900">Drag, drop, and analyze</h3>
                <p className="mb-6 text-slate-600">
                  Simply drag and drop your CSV file containing wearable sensor data.
                  Our system automatically processes BVP, EDA, accelerometer, and temperature data.
                </p>
                <ul className="space-y-3">
                  {['Drag & drop CSV upload', 'Automatic data validation', 'Real-time processing status'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-cyan-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="order-2 md:order-1">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">3</span>
                  View Predictions
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900">Get AI-powered insights</h3>
                <p className="mb-6 text-slate-600">
                  View your predicted pain scores on an intuitive dashboard.
                  Track trends over time and make informed decisions about your pain management.
                </p>
                <ul className="space-y-3">
                  {['Real-time pain predictions', 'Historical trend analysis', 'Exportable reports'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-indigo-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50 p-8">
                  <div className="rounded-xl bg-white p-6 shadow-lg">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Predicted Pain Score</p>
                        <p className="text-3xl font-bold text-indigo-600">
                          4.8<span className="text-lg text-slate-400">/8</span>
                        </p>
                      </div>
                      <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                        Improving
                      </div>
                    </div>
                    <div className="flex h-24 items-end gap-1">
                      {[6.5, 6.2, 5.8, 4.5, 5.5, 4.8].map((height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t first:rounded-bl last:rounded-br bg-indigo-200"
                          style={{ height: `${height * 12}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <Badge className="mb-4 border-teal-200 bg-teal-50 text-teal-700">Features</Badge>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">Everything You Need</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Comprehensive tools to help you understand and manage your chronic pain.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Upload, title: 'Easy CSV Upload', description: 'Drag and drop your wearable data files. Supports multiple sensor formats.', wrapperClass: 'bg-teal-100', iconClass: 'text-teal-600' },
              { icon: BrainCircuit, title: 'ML Predictions', description: 'Advanced machine learning models trained on thousands of pain data points.', wrapperClass: 'bg-cyan-100', iconClass: 'text-cyan-600' },
              { icon: TrendingUp, title: 'Trend Analysis', description: 'Track your pain levels over time with beautiful, easy-to-read charts.', wrapperClass: 'bg-indigo-100', iconClass: 'text-indigo-600' },
              { icon: Shield, title: 'Secure & Private', description: 'Your health data is encrypted and never shared with third parties.', wrapperClass: 'bg-emerald-100', iconClass: 'text-emerald-600' },
              { icon: Clock, title: 'Real-time Processing', description: 'Get pain predictions within seconds of uploading your data.', wrapperClass: 'bg-amber-100', iconClass: 'text-amber-600' },
              // { icon: Lock, title: 'HIPAA Compliant', description: 'Built with healthcare-grade security and compliance standards.', wrapperClass: 'bg-rose-100', iconClass: 'text-rose-600' },
            ].map((feature) => (
              <Card key={feature.title} className="border-0 bg-white shadow-sm transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.wrapperClass}`}>
                    <feature.icon className={`h-6 w-6 ${feature.iconClass}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-800">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 p-8 text-center text-white sm:p-12">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to Take Control?</h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-teal-100">
              Join thousands of users who are managing their chronic pain with AI-powered insights.
            </p>
            <Button
              size="lg"
              onClick={goToPrimaryRoute}
              className="gap-2 bg-white text-base text-teal-600 hover:bg-teal-50"
            >
              {loggedIn ? 'Open Dashboard' : 'Get Started Free'}
              <ChevronRight className="w-5 h-5" />
            </Button>
            <p className="mt-4 text-sm text-teal-200">No credit card required. Free forever plan available.</p>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 py-12 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <button className="mb-4 flex items-center gap-2" onClick={() => navigate('/')}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
                  <BrainCircuit className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-white">PainAI</span>
              </button>
              <p className="max-w-sm text-sm">
                AI-powered chronic pain management platform.
                Predict, track, and manage your pain with machine learning.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white">How It Works</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white">Features</button></li>
                <li><button onClick={goToPrimaryRoute} className="hover:text-white">{loggedIn ? 'Dashboard' : 'Get Started'}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="cursor-pointer hover:text-white">Privacy Policy</span></li>
                <li><span className="cursor-pointer hover:text-white">Terms of Service</span></li>
                {/* <li><span className="cursor-pointer hover:text-white">HIPAA Compliance</span></li> */}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            © 2024 PainAI. All rights reserved. 
          </div>
        </div>
      </footer>
    </div>
  );
}
