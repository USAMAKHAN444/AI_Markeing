import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  ExternalLink,
  RefreshCw,
  Calendar,
  DollarSign,
  Clock,
  BarChart3,
  MousePointer,
  Eye,
  Users,
  Target,
  Map,
  Languages,
  Smartphone,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Campaign, campaignAPI } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const CampaignDetail: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!campaignId) return;
      
      setIsLoading(true);
      try {
        const { data } = await campaignAPI.getCampaignById(campaignId);
        setCampaign(data);
      } catch (error) {
        console.error('Error fetching campaign:', error);
        toast({
          title: "Error",
          description: "Failed to load campaign details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCampaign();
  }, [campaignId, toast]);
  
  const refreshCampaign = async () => {
    if (!campaignId) return;
    
    setIsRefreshing(true);
    try {
      const { data } = await campaignAPI.getCampaignById(campaignId);
      setCampaign(data);
      toast({
        title: "Campaign refreshed",
        description: "Campaign metrics have been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh campaign data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  // Generate daily performance data based on campaign metrics
  const generateDailyPerformanceData = (campaign: Campaign) => {
    if (!campaign?.metrics) return [];
    
    const data = [];
    const startDate = new Date(campaign.createdAt);
    const daysCount = Math.min(campaign.days, 6); // Show max 6 days
    
    const dailyImpressions = campaign.metrics.impressions / campaign.days;
    const dailyClicks = campaign.metrics.clicks / campaign.days;
    const dailyConversions = campaign.metrics.conversions / campaign.days;
    
    for (let i = 0; i < daysCount; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Add some randomness for more realistic data
      const randomFactor = 0.8 + Math.random() * 0.4; // Between 0.8 and 1.2
      
      data.push({
        date: currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
        impressions: Math.round(dailyImpressions * randomFactor),
        clicks: Math.round(dailyClicks * randomFactor),
        conversions: Math.round(dailyConversions * randomFactor)
      });
    }
    
    return data;
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-5">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
          <div className="h-80 bg-gray-200 rounded-lg"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!campaign) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">Campaign not found</h2>
          <p className="text-gray-600 mt-2 mb-6">The campaign you're looking for doesn't exist or has been removed</p>
          <Button asChild>
            <Link to="/campaigns">View All Campaigns</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Generate daily performance data
  const dailyPerformanceData = generateDailyPerformanceData(campaign);
  
  // Extract audience data from campaign - use real data from Google Ads API
  const audienceData = campaign.audienceTargeting?.demographics.gender 
    ? Object.entries(campaign.audienceTargeting.demographics.gender).map(([name, value]) => ({ name, value }))
    : [];
  
  const ageData = campaign.audienceTargeting?.demographics.ageRange
    ? Object.entries(campaign.audienceTargeting.demographics.ageRange).map(([name, value]) => ({ name, value }))
    : [];
  
  const deviceData = campaign.audienceTargeting?.devices
    ? Object.entries(campaign.audienceTargeting.devices).map(([name, value]) => ({ name, value }))
    : [];
  
  const locationData = campaign.audienceTargeting?.locations
    ? Object.entries(campaign.audienceTargeting.locations).map(([name, value]) => ({ name, value }))
    : [];
  
  const COLORS = ['#0284c7', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0369a1', '#075985'];
  
  // Get headlines and descriptions from campaign data - use real data from Google Ads API
  const headlines = campaign.adCreatives?.[0]?.headlines || [];
  
  const descriptions = campaign.adCreatives?.[0]?.descriptions || [];
  
  const businessName = campaign.adCreatives?.[0]?.businessName || campaign.url.replace(/(http[s]?:\/\/)?(www\.)?/, '').split('/')[0];
  
  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <div className="flex items-center gap-x-3">
            <h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
            <Badge variant="outline" className={getStatusColor(campaign.status)}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
          </div>
          <p className="text-gray-500 mt-1">
            Campaign ID: {campaign.id}
          </p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <Button variant="outline" onClick={refreshCampaign} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </>
            )}
          </Button>
          <Button variant="outline" asChild>
            <a href={campaign.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Website
            </a>
          </Button>
        </div>
      </div>

      {/* Campaign Overview */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Campaign Overview</CardTitle>
          <CardDescription>Essential metrics and information about this campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Budget */}
            <div className="flex items-start space-x-4">
              <div className="rounded-full p-2 bg-blue-50">
                <DollarSign className="h-5 w-5 text-marketing-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Budget</p>
                <p className="text-2xl font-bold">${campaign.budget}</p>
                <p className="text-sm text-gray-500">
                  ${(campaign.budget / campaign.days).toFixed(2)}/day
                </p>
              </div>
            </div>
            
            {/* Duration */}
            <div className="flex items-start space-x-4">
              <div className="rounded-full p-2 bg-green-50">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="text-2xl font-bold">{campaign.days} days</p>
                <p className="text-sm text-gray-500">
                  Started {new Date(campaign.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Performance */}
            <div className="flex items-start space-x-4">
              <div className="rounded-full p-2 bg-amber-50">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Performance</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{campaign.metrics?.roi.toFixed(1)}x</p>
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    <span>Good</span>
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  ROI (Return on Investment)
                </p>
              </div>
            </div>
            
            {/* Engagement */}
            <div className="flex items-start space-x-4">
              <div className="rounded-full p-2 bg-purple-50">
                <MousePointer className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Engagement</p>
                <p className="text-2xl font-bold">{campaign.metrics?.clicks}</p>
                <p className="text-sm text-gray-500">
                  {((campaign.metrics?.clicks || 0) / (campaign.metrics?.impressions || 1) * 100).toFixed(1)}% CTR
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Campaign Progress</span>
                <span className="text-sm text-gray-500">
                  {Math.min(100, Math.round((new Date().getTime() - new Date(campaign.createdAt).getTime()) / (1000 * 60 * 60 * 24 * campaign.days) * 100))}%
                </span>
              </div>
              <Progress 
                value={Math.min(100, Math.round((new Date().getTime() - new Date(campaign.createdAt).getTime()) / (1000 * 60 * 60 * 24 * campaign.days) * 100))} 
              />
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4">
              <div>
                <p className="text-sm text-gray-500">Impressions</p>
                <p className="text-lg font-semibold">{campaign.metrics?.impressions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Clicks</p>
                <p className="text-lg font-semibold">{campaign.metrics?.clicks.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Conversions</p>
                <p className="text-lg font-semibold">{campaign.metrics?.conversions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cost per Click</p>
                <p className="text-lg font-semibold">${campaign.metrics?.costPerClick.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Campaign Settings */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Campaign Settings</CardTitle>
          <CardDescription>Configuration settings for this campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Bidding Strategy</h3>
              <p className="text-base">{campaign.bidStrategy || "Maximize Clicks"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Ad Rotation</h3>
              <p className="text-base">{campaign.adRotationSettings || "Optimize for clicks"}</p>
            </div>
            {campaign.trackingTemplate && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium mb-2">Tracking Template</h3>
                <p className="text-base font-mono text-sm bg-gray-50 p-2 rounded overflow-x-auto">
                  {campaign.trackingTemplate}
                </p>
              </div>
            )}
            {campaign.contentExclusions && campaign.contentExclusions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Content Exclusions</h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.contentExclusions.map((exclusion, i) => (
                    <Badge key={i} variant="outline">{exclusion}</Badge>
                  ))}
                </div>
              </div>
            )}
            {campaign.languageTargeting && campaign.languageTargeting.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Language Targeting</h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.languageTargeting.map((lang, i) => (
                    <Badge key={i} variant="outline">{lang}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed Analytics */}
      <Tabs defaultValue="performance">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="content">Ad Content</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
              <CardDescription>Click, impression, and conversion trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyPerformanceData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#0284c7" activeDot={{ r: 8 }} name="Clicks" />
                    <Line yAxisId="right" type="monotone" dataKey="impressions" stroke="#64748b" name="Impressions" />
                    <Line yAxisId="left" type="monotone" dataKey="conversions" stroke="#10b981" name="Conversions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Click-Through Rate</CardTitle>
                <CardDescription>Percentage of impressions that resulted in clicks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-60">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-marketing-600">
                      {((campaign.metrics?.clicks || 0) / (campaign.metrics?.impressions || 1) * 100).toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-500 mt-2">CTR</p>
                    <Badge variant="outline" className="mt-4 bg-green-50 text-green-700 hover:bg-green-50">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      <span>0.8% above average</span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Percentage of clicks that resulted in conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-60">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-green-600">
                      {((campaign.metrics?.conversions || 0) / (campaign.metrics?.clicks || 1) * 100).toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Conversion Rate</p>
                    <Badge variant="outline" className="mt-4 bg-green-50 text-green-700 hover:bg-green-50">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      <span>2.3% above average</span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gender Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Breakdown of audience by gender</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-64 w-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={audienceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {audienceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Breakdown of audience by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ageData}
                      layout="vertical"
                      margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill="#0284c7" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Device Distribution */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <CardTitle>Device Distribution</CardTitle>
                    <CardDescription>Types of devices your audience is using</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-64 w-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Map className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <CardTitle>Geographic Distribution</CardTitle>
                    <CardDescription>Top countries where your audience is located</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={locationData}
                      layout="vertical"
                      margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill="#0284c7" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Audience Interests */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <CardTitle>Audience Interests</CardTitle>
                    <CardDescription>Key interests and topics relevant to your audience</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(campaign.audienceTargeting?.interests || []).map((interest) => (
                    <Badge variant="secondary" key={interest} className="text-sm py-1 px-3">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Ad Content Tab */}
        <TabsContent value="content">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ad Copy</CardTitle>
                <CardDescription>Headlines and descriptions for this campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Headlines</h4>
                    <ul className="space-y-2">
                      {headlines.map((headline, index) => (
                        <li key={index} className="p-3 bg-gray-50 rounded-md">"{headline}"</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Descriptions</h4>
                    <ul className="space-y-2">
                      {descriptions.map((description, index) => (
                        <li key={index} className="p-3 bg-gray-50 rounded-md">
                          "{description}"
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {businessName && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Business Name</h4>
                      <div className="p-3 bg-gray-50 rounded-md">
                        {businessName}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ad Performance</CardTitle>
                <CardDescription>Which headlines and descriptions are performing best</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h4 className="font-medium text-sm mb-3">Top Performing Headline</h4>
                  <div className="p-4 border rounded-md">
                    <p className="font-medium mb-2">"{headlines[0]}"</p>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">CTR</p>
                        <p className="font-medium">4.2%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Impressions</p>
                        <p className="font-medium">5,487</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Conversions</p>
                        <p className="font-medium">128</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-3 bg-green-50 text-green-700 hover:bg-green-50">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      <span>32% better than average</span>
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-3">Top Performing Description</h4>
                  <div className="p-4 border rounded-md">
                    <p className="font-medium mb-2">
                      "{descriptions[0]}"
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">CTR</p>
                        <p className="font-medium">3.8%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Impressions</p>
                        <p className="font-medium">4,256</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Conversions</p>
                        <p className="font-medium">97</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-3 bg-green-50 text-green-700 hover:bg-green-50">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      <span>24% better than average</span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Display Images</CardTitle>
                <CardDescription>AI-generated visuals for your campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                    Image Preview 1
                  </div>
                  <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                    Image Preview 2
                  </div>
                  <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                    Image Preview 3
                  </div>
                  <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                    Image Preview 4
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Note: In a production environment, these would be actual AI-generated images for your campaign.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Targeting Keywords</CardTitle>
                <CardDescription>Key terms and phrases targeted by your campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Primary Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'summer sale', 'discount clothing', 'fashion deals', 'summer fashion',
                      'summer outfits', 'online shopping deals'
                    ].map((keyword) => (
                      <Badge variant="outline" key={keyword} className="text-sm py-1 px-3 bg-blue-50">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Secondary Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'women\'s clothing', 'men\'s fashion', 'accessories', 'shoes', 'bags',
                      'summer dresses', 'beachwear', 'seasonal offers'
                    ].map((keyword) => (
                      <Badge variant="outline" key={keyword} className="text-sm py-1 px-3">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-sm mb-2">Keywords Performance</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2">Keyword</th>
                        <th className="pb-2">Impressions</th>
                        <th className="pb-2">Clicks</th>
                        <th className="pb-2">CTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">summer sale</td>
                        <td>2,456</td>
                        <td>134</td>
                        <td>5.4%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">discount clothing</td>
                        <td>1,987</td>
                        <td>92</td>
                        <td>4.6%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">fashion deals</td>
                        <td>1,568</td>
                        <td>76</td>
                        <td>4.8%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">summer fashion</td>
                        <td>2,102</td>
                        <td>89</td>
                        <td>4.2%</td>
                      </tr>
                      <tr>
                        <td className="py-2">summer outfits</td>
                        <td>1,235</td>
                        <td>37</td>
                        <td>3.0%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default CampaignDetail;
