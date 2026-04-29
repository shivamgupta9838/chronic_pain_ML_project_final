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
  X
} from 'lucide-react';
import { useState } from 'react';

export function Home() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800">PainAI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-sm text-slate-600 hover:text-teal-600 transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-sm text-slate-600 hover:text-teal-600 transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('technology')} 
                className="text-sm text-slate-600 hover:text-teal-600 transition-colors"
              >
                Technology
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-slate-600"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white gap-2"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="block w-full text-left py-2 text-slate-600"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="block w-full text-left py-2 text-slate-600"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('technology')} 
              className="block w-full text-left py-2 text-slate-600"
            >
              Technology
            </button>
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white"
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <Badge className="mb-6 bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-50">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Healthcare
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Predict & Manage
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">
                  Chronic Pain with AI
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Upload your wearable sensor data and let our machine learning models 
                predict your pain levels, helping you take control of your chronic 
                pain management journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white gap-2 text-base"
                >
                  Get Started Free
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

              {/* Trust Badges */}
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  HIPAA Compliant
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  Bank-level Security
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  Free to Start
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-3xl transform rotate-3 opacity-50" />
              <Card className="relative bg-white/90 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-8">
                  {/* Mock Dashboard Preview */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Predicted Pain Score</p>
                        <p className="text-4xl font-bold text-teal-600">5.2<span className="text-lg text-slate-400">/10</span></p>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-teal-50 flex items-center justify-center">
                        <Activity className="w-7 h-7 text-teal-500" />
                      </div>
                    </div>
                    
                    {/* Mini Chart */}
                    <div className="h-32 flex items-end gap-2">
                      {[4, 5, 4.5, 6, 5.5, 5.2, 4.8].map((h, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-t"
                          style={{ height: `${h * 15}%` }}
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

                    <div className="p-4 bg-slate-50 rounded-xl">
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

      {/* Workflow Section */}
      <section id="technology" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-50 text-cyan-700 border-cyan-200">
              <Zap className="w-3 h-3 mr-1" />
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              CSV Upload + ML Prediction Workflow
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our advanced machine learning pipeline analyzes your wearable sensor data 
              to predict pain levels with high accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center mb-6">
                  <Upload className="w-7 h-7 text-teal-600" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-medium">1</span>
                  <h3 className="text-xl font-semibold text-slate-800">Upload CSV Data</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Upload your wearable sensor data in CSV format. We support:
                </p>
                <div className="flex flex-wrap gap-2">
                  {['BVP', 'EDA', 'ACC (X,Y,Z)', 'TEMP'].map((col) => (
                    <span key={col} className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                      {col}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center mb-6">
                  <BrainCircuit className="w-7 h-7 text-cyan-600" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center font-medium">2</span>
                  <h3 className="text-xl font-semibold text-slate-800">AI Processing</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Our ML models analyze physiological signals to detect pain patterns:
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Deep Learning', 'Signal Processing', 'Pattern Recognition'].map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-indigo-600" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-medium">3</span>
                  <h3 className="text-xl font-semibold text-slate-800">Get Predictions</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Receive pain level predictions and insights to manage your condition:
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Pain Score (1-10)', 'Trend Analysis', 'Personalized Insights'].map((feature) => (
                    <span key={feature} className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                      {feature}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works - Detailed Steps */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start managing your chronic pain in minutes with our easy-to-use platform.
            </p>
          </div>

          <div className="space-y-16">
            {/* Step 1 Detail */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 rounded-full text-teal-700 text-sm font-medium mb-4">
                  <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">1</span>
                  Create Your Account
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Sign up in seconds
                </h3>
                <p className="text-slate-600 mb-6">
                  Create your free account with just your email. No credit card required. 
                  Your health data is protected with bank-level encryption and HIPAA compliance.
                </p>
                <ul className="space-y-3">
                  {[
                    'Free account creation',
                    'Secure data encryption',
                    'Privacy-first approach'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                        <span className="text-white font-bold">JD</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">John Doe</p>
                        <p className="text-sm text-slate-500">john@example.com</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-100 rounded-full w-full" />
                      <div className="h-2 bg-slate-100 rounded-full w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 Detail */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg mb-4">
                      <FileSpreadsheet className="w-8 h-8 text-teal-500" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">wearable_data.csv</p>
                        <p className="text-sm text-slate-500">2.4 MB</p>
                      </div>
                    </div>
                    <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-teal-500 rounded-full" />
                    </div>
                    <p className="text-sm text-slate-500 mt-2">Uploading... 75%</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 rounded-full text-cyan-700 text-sm font-medium mb-4">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center">2</span>
                  Upload Your Data
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Drag, drop, and analyze
                </h3>
                <p className="text-slate-600 mb-6">
                  Simply drag and drop your CSV file containing wearable sensor data. 
                  Our system automatically processes BVP, EDA, accelerometer, and temperature data.
                </p>
                <ul className="space-y-3">
                  {[
                    'Drag & drop CSV upload',
                    'Automatic data validation',
                    'Real-time processing status'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 3 Detail */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-700 text-sm font-medium mb-4">
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center">3</span>
                  View Predictions
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Get AI-powered insights
                </h3>
                <p className="text-slate-600 mb-6">
                  View your predicted pain scores on an intuitive dashboard. 
                  Track trends over time and make informed decisions about your pain management.
                </p>
                <ul className="space-y-3">
                  {[
                    'Real-time pain predictions',
                    'Historical trend analysis',
                    'Exportable reports'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm text-slate-500">Predicted Pain Score</p>
                        <p className="text-3xl font-bold text-indigo-600">4.8<span className="text-lg text-slate-400">/10</span></p>
                      </div>
                      <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                        Improving
                      </div>
                    </div>
                    <div className="flex items-end gap-1 h-24">
                      {[6.5, 6.2, 5.8, 4.5, 5.5, 4.8].map((h, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-indigo-200 rounded-t first:rounded-bl last:rounded-br"
                          style={{ height: `${h * 12}%` }}
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools to help you understand and manage your chronic pain.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Upload,
                title: 'Easy CSV Upload',
                description: 'Drag and drop your wearable data files. Supports multiple sensor formats.',
                color: 'teal'
              },
              {
                icon: BrainCircuit,
                title: 'ML Predictions',
                description: 'Advanced machine learning models trained on thousands of pain data points.',
                color: 'cyan'
              },
              {
                icon: TrendingUp,
                title: 'Trend Analysis',
                description: 'Track your pain levels over time with beautiful, easy-to-read charts.',
                color: 'indigo'
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your health data is encrypted and never shared with third parties.',
                color: 'emerald'
              },
              {
                icon: Clock,
                title: 'Real-time Processing',
                description: 'Get pain predictions within seconds of uploading your data.',
                color: 'amber'
              },
              {
                icon: Lock,
                title: 'HIPAA Compliant',
                description: 'Built with healthcare-grade security and compliance standards.',
                color: 'rose'
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-white border-0 shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Take Control?
            </h2>
            <p className="text-lg text-teal-100 mb-8 max-w-xl mx-auto">
              Join thousands of users who are managing their chronic pain with AI-powered insights.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-white text-teal-600 hover:bg-teal-50 gap-2 text-base"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5" />
            </Button>
            <p className="text-sm text-teal-200 mt-4">
              No credit card required. Free forever plan available.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl text-white">PainAI</span>
              </div>
              <p className="text-sm max-w-sm">
                AI-powered chronic pain management platform. 
                Predict, track, and manage your pain with machine learning.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white">How It Works</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white">Features</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-white">Get Started</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-white cursor-pointer">HIPAA Compliance</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            © 2024 PainAI. All rights reserved. HIPAA Compliant.
          </div>
        </div>
      </footer>
    </div>
  );
}
