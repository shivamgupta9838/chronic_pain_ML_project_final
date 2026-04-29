import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera,
  Save,
  Edit3,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { mockUser } from '@/data/mockData';
import { toast } from 'sonner';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(mockUser);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }, 1500);
  };

  const handleCancel = () => {
    setFormData(mockUser);
    setIsEditing(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal information and preferences</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="personal" className="gap-2">
            <User className="w-4 h-4" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-6">
          {/* Profile Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                      {getInitials(formData.firstName, formData.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <button 
                    className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-200 hover:bg-slate-50"
                    onClick={() => toast.info('Photo upload coming soon!')}
                  >
                    <Camera className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl font-bold text-slate-800">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-slate-500">{formData.email}</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                      Premium Member
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Verified
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white gap-2"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Details Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your basic information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Name: Phone Number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input id="confirmNewPassword" type="password" />
              </div>
              <Button 
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white"
                onClick={() => toast.success('Password updated!')}
              >
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-emerald-800">2FA Enabled</p>
                    <p className="text-sm text-emerald-600">Your account is protected with SMS authentication</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
