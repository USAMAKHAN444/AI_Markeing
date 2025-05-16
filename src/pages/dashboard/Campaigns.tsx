import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/DashboardLayout';
import { campaignAPI, Campaign } from '@/services/api';
import { ChevronDown, Filter, Search, Plus, ArrowUpRight, BarChart3 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await campaignAPI.getCampaigns();
        setCampaigns(response.data);
        setFilteredCampaigns(response.data);
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

  useEffect(() => {
    let result = [...campaigns];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(campaign => 
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter(campaign => campaign.status === statusFilter);
    }
    
    setFilteredCampaigns(result);
  }, [searchTerm, statusFilter, campaigns]);

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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="h-10 bg-gray-200 rounded flex-grow"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <div key={item} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-gray-500">Manage and track all your marketing campaigns</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link to="/campaigns/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardContent className="p-6">
            {/* Stats row */}
            <div className="grid gap-6 md:grid-cols-3 mb-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full p-3 bg-blue-50">
                  <BarChart3 className="h-6 w-6 text-marketing-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                  <p className="text-2xl font-bold">{campaigns.length}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="rounded-full p-3 bg-green-50">
                  <ArrowUpRight className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                  <p className="text-2xl font-bold">
                    {campaigns.filter(c => c.status === 'running').length}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="rounded-full p-3 bg-yellow-50">
                  <BarChart3 className="h-6 w-6 text-yellow-600 rotate-90" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Average ROI</p>
                  <p className="text-2xl font-bold">
                    {campaigns.length > 0 && campaigns.some(c => c.metrics?.roi)
                      ? `${(campaigns.reduce((sum, campaign) => sum + (campaign.metrics?.roi || 0), 0) / 
                          campaigns.filter(c => c.metrics?.roi).length).toFixed(1)}x`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Filters row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Campaigns grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Link to={`/campaigns/${campaign.id}`} key={campaign.id}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <Badge variant="outline" className={getStatusColor(campaign.status)}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription className="truncate">
                  {campaign.url}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-medium">${campaign.budget}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{campaign.days} days</p>
                    </div>
                  </div>
                  
                  {campaign.status !== 'pending' && campaign.metrics && (
                    <>
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm text-gray-500">Performance</p>
                          <p className="text-xs text-gray-500">
                            {campaign.metrics.impressions > 0 
                              ? ((campaign.metrics.clicks / campaign.metrics.impressions) * 100).toFixed(1) 
                              : 0}%
                          </p>
                        </div>
                        <Progress value={campaign.metrics.impressions > 0 
                          ? (campaign.metrics.clicks / campaign.metrics.impressions) * 100 
                          : 0} />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Clicks</p>
                          <p className="font-medium">{campaign.metrics.clicks}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Conversions</p>
                          <p className="font-medium">{campaign.metrics.conversions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">ROI</p>
                          <p className={`font-medium ${campaign.metrics.roi > 2 ? 'text-green-600' : campaign.metrics.roi < 1 ? 'text-red-600' : 'text-amber-600'}`}>
                            {campaign.metrics.roi.toFixed(1) + 'x'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {(campaign.status === 'pending' || !campaign.metrics) && (
                    <div className="py-4 text-center text-sm text-gray-500">
                      Campaign metrics will appear here once the campaign is running
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(campaign.lastUpdated).toLocaleDateString()}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      
      {filteredCampaigns.length === 0 && (
        <div className="text-center p-6 bg-gray-50 rounded-lg border mt-6">
          <p className="text-gray-500 mb-2">No campaigns found.</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Campaigns;
