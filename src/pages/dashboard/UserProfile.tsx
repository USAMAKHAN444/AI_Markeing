
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Mail, Phone, User, Building, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UserProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  
  useEffect(() => {
    if (user) {
      setProfileData(prevData => ({
        ...prevData,
        fullName: user.fullName || '',
        email: user.email || ''
      }));
    }
  }, [user]);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, make API call to update profile
      // For demo purposes, just update local state
      updateUser({ fullName: profileData.fullName });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been saved successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'There was a problem updating your profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure your new password and confirmation password are the same.',
        variant: 'destructive',
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Your new password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsPasswordSubmitting(true);
    
    try {
      // In a real app, make API call to update password
      // For demo, just simulate a successful update
      setTimeout(() => {
        toast({
          title: 'Password updated',
          description: 'Your password has been changed successfully.',
        });
        
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }, 1000);
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: 'Update failed',
        description: 'There was a problem updating your password.',
        variant: 'destructive',
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.profileImage} alt={user?.fullName || 'User'} />
                  <AvatarFallback className="text-xl">
                    {user?.fullName ? getInitials(user.fullName) : 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-semibold mb-1">{user?.fullName || 'User'}</h2>
                  <p className="text-gray-500">{user?.email || 'user@example.com'}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                    <Button variant="outline" size="sm">
                      Upload Photo
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                      Remove Photo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="personal">
          <TabsList className="mb-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Full Name</span>
                        </div>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>Email Address</span>
                        </div>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        disabled
                      />
                      <p className="text-xs text-gray-500">
                        Email address cannot be changed
                      </p>
                    </div>
                    
                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>Phone Number</span>
                        </div>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    
                    {/* Company */}
                    <div className="space-y-2">
                      <Label htmlFor="company">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>Company</span>
                        </div>
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={profileData.company}
                        onChange={handleProfileChange}
                        placeholder="Your company name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-4">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Address */}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>Street Address</span>
                          </div>
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          placeholder="123 Main St"
                        />
                      </div>
                      
                      {/* City */}
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={profileData.city}
                          onChange={handleProfileChange}
                          placeholder="New York"
                        />
                      </div>
                      
                      {/* State/Province */}
                      <div className="space-y-2">
                        <Label htmlFor="state">State / Province</Label>
                        <Input
                          id="state"
                          name="state"
                          value={profileData.state}
                          onChange={handleProfileChange}
                          placeholder="NY"
                        />
                      </div>
                      
                      {/* ZIP/Postal Code */}
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={profileData.zipCode}
                          onChange={handleProfileChange}
                          placeholder="10001"
                        />
                      </div>
                      
                      {/* Country */}
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={profileData.country}
                          onChange={handleProfileChange}
                          placeholder="United States"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handlePasswordSubmit}>
                <CardContent className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Password should be at least 8 characters long
                    </p>
                  </div>
                  
                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isPasswordSubmitting}>
                    {isPasswordSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>
                  Manage your account settings and data
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h4 className="font-medium mb-1">Download Your Data</h4>
                    <p className="text-sm text-gray-500">Get a copy of all the data associated with your account</p>
                  </div>
                  <Button variant="outline">Download</Button>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b">
                  <div>
                    <h4 className="font-medium mb-1">Delete Account</h4>
                    <p className="text-sm text-gray-500">Permanently delete your account and all associated data</p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
