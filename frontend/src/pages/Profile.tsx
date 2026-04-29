import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Calendar, CheckCircle2, Lock, Phone, MapPin, Save } from 'lucide-react';
import { toast } from 'sonner';

import { changePassword, fetchCurrentUser, updateCurrentUser } from '@/lib/api';
import { getAccessToken, getStoredUser, setSession } from '@/lib/auth';
import type { User as UserType } from '@/types';

export function Profile() {
  const [user, setUser] = useState<UserType | null>(getStoredUser());
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    void loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const currentUser = await fetchCurrentUser();
      const token = getAccessToken();
      if (token) {
        setSession(token, currentUser);
      }
      setUser(currentUser);
      setProfileForm({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone ?? '',
        address: currentUser.address ?? '',
        dateOfBirth: currentUser.dateOfBirth ?? '',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load profile.');
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  };

  const handleProfileSave = async () => {
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      toast.error('First name and last name are required.');
      return;
    }

    setIsSavingProfile(true);
    try {
      const updatedUser = await updateCurrentUser({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        address: profileForm.address,
        dateOfBirth: profileForm.dateOfBirth,
      });
      const token = getAccessToken();
      if (token) {
        setSession(token, updatedUser);
      }
      setUser(updatedUser);
      setProfileForm((current) => ({ ...current, email: updatedUser.email }));
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!user || user.authProvider !== 'email') {
      return;
    }

    setIsSavingPassword(true);
    try {
      await changePassword(passwordForm);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Password updated successfully.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
        <p className="mt-1 text-slate-500">Manage your account details and security settings.</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="border bg-white">
          <TabsTrigger value="personal" className="gap-2">
            <User className="w-4 h-4" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.avatarUrl ?? ''} />
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-2xl text-white">
                    {user ? getInitials(user.firstName, user.lastName) : 'PA'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-bold text-slate-800">
                    {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                  </h2>
                  <p className="text-slate-500">{user?.email ?? 'Fetching profile'}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-700">
                      {user?.authProvider === 'google' ? 'Google Login' : 'Email Login'}
                    </Badge>
                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Personal Information</CardTitle>
              <CardDescription>Keep your account details up to date.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="firstName"
                      className="pl-10"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="lastName"
                      className="pl-10"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input id="email" className="pl-10" value={profileForm.email} disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      className="pl-10"
                      value={profileForm.dateOfBirth}
                      onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Textarea
                      id="address"
                      className="min-h-24 pl-10"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => void handleProfileSave()}
                disabled={isSavingProfile}
                className="gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700"
              >
                <Save className="w-4 h-4" />
                {isSavingProfile ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Authentication Status</CardTitle>
              <CardDescription>Current sign-in details from your live backend session.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-emerald-800">Authenticated</p>
                    <p className="text-sm text-emerald-600">
                      Signed in with {user?.authProvider ?? 'your account'}.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {user?.authProvider === 'email' ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">Change Password</CardTitle>
                <CardDescription>Update the password for your email login account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                </div>
                <Button
                  onClick={() => void handlePasswordSave()}
                  disabled={isSavingPassword}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700"
                >
                  {isSavingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">Password Management</CardTitle>
                <CardDescription>Google accounts manage passwords through Google.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                This account uses Google sign-in, so password changes are not managed inside PainAI.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
