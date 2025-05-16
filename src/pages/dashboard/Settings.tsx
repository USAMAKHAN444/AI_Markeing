
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Bell, Lock, Globe, Eye } from 'lucide-react';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    timezone: "UTC",
    language: "English",
    darkMode: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    campaignAlerts: true,
    marketingEmails: false,
    weeklyReports: true
  });

  const [apiSettings, setApiSettings] = useState({
    apiKey: "••••••••••••••••",
    webhookUrl: ""
  });

  const handleGeneralSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value
    });
  };

  const handleToggleChange = (setting: string, value: boolean, settingType: 'general' | 'notification') => {
    if (settingType === 'general') {
      setGeneralSettings({
        ...generalSettings,
        [setting]: value
      });
    } else {
      setNotificationSettings({
        ...notificationSettings,
        [setting]: value
      });
    }
  };

  const handleApiSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiSettings({
      ...apiSettings,
      [name]: value
    });
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // In a real app, this would call an API to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Your general settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // In a real app, this would call an API to save notification preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Notification preferences saved",
        description: "Your notification settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving preferences",
        description: "There was a problem saving your notification preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleApiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // In a real app, this would call an API to save API settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "API settings saved",
        description: "Your API configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving API settings",
        description: "There was a problem saving your API configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const regenerateApiKey = () => {
    // In a real app, this would call an API to generate a new key
    const mockNewKey = "api_" + Math.random().toString(36).substring(2, 15);
    setApiSettings({
      ...apiSettings,
      apiKey: mockNewKey
    });
    
    toast({
      title: "API key regenerated",
      description: "Your new API key has been generated. Make sure to save it.",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>
          
          {/* General Settings Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and application settings
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleGeneralSubmit}>
                <CardContent className="space-y-6">
                  {/* Timezone */}
                  <div className="space-y-2">
                    <Label htmlFor="timezone">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Timezone</span>
                      </div>
                    </Label>
                    <select 
                      id="timezone" 
                      name="timezone"
                      value={generalSettings.timezone}
                      onChange={handleGeneralSettingChange}
                      className="w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                  
                  {/* Language */}
                  <div className="space-y-2">
                    <Label htmlFor="language">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Language</span>
                      </div>
                    </Label>
                    <select 
                      id="language" 
                      name="language"
                      value={generalSettings.language}
                      onChange={handleGeneralSettingChange}
                      className="w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Chinese">Chinese</option>
                    </select>
                  </div>
                  
                  {/* Dark Mode */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span>Dark Mode</span>
                        </div>
                      </Label>
                      <p className="text-sm text-gray-500">
                        Enable dark mode for the application interface
                      </p>
                    </div>
                    <Switch 
                      id="darkMode" 
                      checked={generalSettings.darkMode} 
                      onCheckedChange={(checked) => handleToggleChange('darkMode', checked, 'general')}
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
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
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Preferences</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleNotificationSubmit}>
                <CardContent className="space-y-6">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive important updates via email
                      </p>
                    </div>
                    <Switch 
                      id="emailNotifications" 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleToggleChange('emailNotifications', checked, 'notification')}
                    />
                  </div>
                  
                  {/* Campaign Alerts */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="campaignAlerts">Campaign Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Get notified about important campaign events
                      </p>
                    </div>
                    <Switch 
                      id="campaignAlerts" 
                      checked={notificationSettings.campaignAlerts}
                      onCheckedChange={(checked) => handleToggleChange('campaignAlerts', checked, 'notification')}
                    />
                  </div>
                  
                  {/* Marketing Emails */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingEmails">Marketing Emails</Label>
                      <p className="text-sm text-gray-500">
                        Receive promotional and newsletter emails
                      </p>
                    </div>
                    <Switch 
                      id="marketingEmails" 
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => handleToggleChange('marketingEmails', checked, 'notification')}
                    />
                  </div>
                  
                  {/* Weekly Reports */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weeklyReports">Weekly Reports</Label>
                      <p className="text-sm text-gray-500">
                        Receive weekly performance summaries
                      </p>
                    </div>
                    <Switch 
                      id="weeklyReports" 
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => handleToggleChange('weeklyReports', checked, 'notification')}
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Preferences'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* API Tab */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    <span>API Configuration</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  Manage your API keys and integration settings
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleApiSubmit}>
                <CardContent className="space-y-6">
                  {/* API Key */}
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="apiKey"
                        name="apiKey"
                        value={apiSettings.apiKey}
                        onChange={handleApiSettingChange}
                        readOnly
                        className="font-mono"
                      />
                      <Button type="button" variant="outline" onClick={regenerateApiKey}>
                        Regenerate
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Your API key is used to authenticate API requests.
                    </p>
                  </div>
                  
                  {/* Webhook URL */}
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      name="webhookUrl"
                      placeholder="https://your-domain.com/webhook"
                      value={apiSettings.webhookUrl}
                      onChange={handleApiSettingChange}
                    />
                    <p className="text-xs text-gray-500">
                      We'll send event notifications to this URL.
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save API Settings'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
