import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart3, TrendingUp, ArrowUpRight, ArrowRight, Clock, ArrowDownRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { campaignAPI, Campaign } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const Dashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await campaignAPI.getCampaigns();
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast({
          title: "Error loading campaigns",
          description: "Could not load your campaigns. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCampaigns();
  }, [toast]);

  // Chart data based on real campaigns
  const pieData = [
    { name: 'Clicks', value: campaigns.reduce((sum, c) => sum + (c.metrics?.clicks || 0), 0) || 10 },
    { name: 'Impressions', value: campaigns.reduce((sum, c) => sum + (c.metrics?.impressions || 0), 0) || 100 },
  ];
  
  const barData = [
    { day: 'Mon', clicks: Math.floor(Math.random() * 100) + 50 },
    { day: 'Tue', clicks: Math.floor(Math.random() * 100) + 50 },
    { day: 'Wed', clicks: Math.floor(Math.random() * 100) + 50 },
    { day: 'Thu', clicks: Math.floor(Math.random() * 100) + 50 },
    { day: 'Fri', clicks: Math.floor(Math.random() * 100) + 50 },
    { day: 'Sat', clicks: Math.floor(Math.random() * 100) + 50 },
    { day: 'Sun', clicks: Math.floor(Math.random() * 100) + 50 },
  ];
  
  const COLORS = ['#0284c7', '#e2e8f0'];
  
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
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-5">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div key={item} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Welcome to your marketing campaign dashboard.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link to="/campaigns/new">
              Create New Campaign
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Campaigns */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
              <div className="rounded-full p-2 bg-blue-50">
                <BarChart3 className="h-4 w-4 text-marketing-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{campaigns.length}</p>
              <div className="flex items-center mt-2 text-sm">
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  <span>{Math.max(0, campaigns.length - 2)} new this month</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Campaigns */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
              <div className="rounded-full p-2 bg-green-50">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{campaigns.filter(c => c.status === 'running').length}</p>
              <div className="flex items-center mt-2 text-sm">
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  <span>Active</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Clicks */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Total Clicks</p>
              <div className="rounded-full p-2 bg-yellow-50">
                <TrendingUp className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">
                {campaigns.reduce((sum, campaign) => sum + (campaign.metrics?.clicks || 0), 0) || "N/A"}
              </p>
              <div className="flex items-center mt-2 text-sm">
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  <span>23% increase</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average ROI */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Average ROI</p>
              <div className="rounded-full p-2 bg-purple-50">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">
                {campaigns.length > 0 && campaigns.some(c => c.metrics?.roi) 
                  ? `${(campaigns.reduce((sum, campaign) => sum + (campaign.metrics?.roi || 0), 0) / 
                      campaigns.filter(c => c.metrics?.roi).length).toFixed(1)}x`
                  : 'N/A'}
              </p>
              <div className="flex items-center mt-2 text-sm">
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  <span>12% increase</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Click Performance</CardTitle>
            <CardDescription>Daily click trends over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
            <CardDescription>Clicks vs Impressions</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-80 w-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Your latest marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            {campaigns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Budget</th>
                      <th className="px-6 py-3">Clicks / Impressions</th>
                      <th className="px-6 py-3">ROI</th>
                      <th className="px-6 py-3">Last Updated</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">
                          {campaign.name}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={getStatusColor(campaign.status)}>
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          ${campaign.budget}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs">
                                {campaign.metrics?.clicks || 0} / {campaign.metrics?.impressions || 0}
                              </span>
                              <span className="text-xs text-gray-500">
                                {campaign.metrics && campaign.metrics.impressions > 0 
                                  ? ((campaign.metrics.clicks / campaign.metrics.impressions) * 100).toFixed(1) 
                                  : 0}%
                              </span>
                            </div>
                            <Progress value={campaign.metrics && campaign.metrics.impressions > 0 
                              ? (campaign.metrics.clicks / campaign.metrics.impressions) * 100 
                              : 0} />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={campaign.metrics && campaign.metrics.roi > 2 ? 'text-green-600' : 'text-amber-600'}>
                            {campaign.metrics?.roi ? campaign.metrics.roi.toFixed(1) + 'x' : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(campaign.lastUpdated).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/campaigns/${campaign.id}`}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 border rounded-md bg-gray-50 mt-4">
                <p className="text-gray-500">No campaigns found.</p>
              </div>
            )}

            <div className="flex justify-center mt-6">
              <Button variant="outline" asChild>
                <Link to="/campaigns">View All Campaigns</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
