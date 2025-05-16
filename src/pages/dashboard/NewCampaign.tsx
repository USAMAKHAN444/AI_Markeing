
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertCircle,
  Check,
  ChevronRight,
  Link as LinkIcon,
  Loader2,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { campaignAPI, CampaignRequest, API_URL } from '@/services/api';
import axios from 'axios';

const NewCampaign: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);
  const [campaignData, setCampaignData] = useState<CampaignRequest>({
    budget: '',
    days: '',
    campaignId: '',
    url: '',
  });
  const [apiResponse, setApiResponse] = useState<any>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const validateUrl = () => {
    if (!campaignData.url) {
      setIsUrlValid(false);
      return false;
    }
    
    try {
      new URL(campaignData.url);
      setIsUrlValid(true);
      return true;
    } catch (err) {
      setIsUrlValid(false);
      return false;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCampaignData({ ...campaignData, [name]: value });
    
    // Reset validation state when url changes
    if (name === 'url') {
      setIsUrlValid(null);
    }
  };
  
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUrl()) {
      setStep(2);
    } else {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
    }
  };
  
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate campaign details
    if (!campaignData.budget || !campaignData.days || !campaignData.campaignId) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Generate campaign ID if not provided
    if (!campaignData.campaignId) {
      const randomId = Math.random().toString(36).substring(2, 8);
      setCampaignData({
        ...campaignData,
        campaignId: randomId,
      });
    }
    
    setStep(3);
  };
  
  const handleCreateCampaign = async () => {
    if (isProcessing) return; // Prevent duplicate submissions
    setIsProcessing(true);
    
    try {
      // Use axios directly with CORS headers
      const response = await axios.post('http://127.0.0.1:8000/api/executeQueries', campaignData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      setApiResponse(response.data);
      
      // Create a local record of the campaign, but don't call the API again
      const newCampaign = {
        id: campaignData.campaignId || Math.random().toString(36).substring(2, 8),
        name: `Campaign for ${campaignData.url}`,
        budget: parseFloat(campaignData.budget),
        days: parseInt(campaignData.days),
        url: campaignData.url,
        status: 'running',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      
      // Store campaign in localStorage
      const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      const updatedCampaigns = [...existingCampaigns, newCampaign];
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
      
      toast({
        title: "Campaign created successfully",
        description: "Your campaign is now being processed",
      });
      
      // Go to confirmation step
      setStep(4);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error creating campaign",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleFinish = () => {
    navigate('/dashboard');
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleUrlSubmit}>
            <CardHeader>
              <CardTitle>Step 1: Website URL</CardTitle>
              <CardDescription>
                Enter the URL of the website you want to promote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="url"
                    name="url"
                    placeholder="https://example.com"
                    className="pl-10"
                    value={campaignData.url}
                    onChange={handleInputChange}
                    required
                    onBlur={validateUrl}
                  />
                </div>
                {isUrlValid === false && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Please enter a valid URL (e.g., https://example.com)
                  </p>
                )}
                {isUrlValid === true && (
                  <p className="text-sm text-green-500 flex items-center mt-1">
                    <Check className="h-3 w-3 mr-1" />
                    URL is valid
                  </p>
                )}
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Why we need your website URL</h4>
                <p className="text-xs text-blue-600">
                  Our AI will analyze your website to understand your business, target audience,
                  and create the most effective ad content and targeting strategy for your campaign.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit">
                Continue
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        );
        
      case 2:
        return (
          <form onSubmit={handleDetailsSubmit}>
            <CardHeader>
              <CardTitle>Step 2: Campaign Details</CardTitle>
              <CardDescription>
                Define your budget, duration, and campaign identifier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="budget">
                  Campaign Budget (USD)
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    min="10"
                    placeholder="50"
                    className="pl-10"
                    value={campaignData.budget}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="days">
                  Campaign Duration (Days)
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="days"
                    name="days"
                    type="number"
                    min="1"
                    max="90"
                    placeholder="7"
                    className="pl-10"
                    value={campaignData.days}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaignId">
                  Campaign ID (Optional)
                </Label>
                <Input
                  id="campaignId"
                  name="campaignId"
                  placeholder="summer2023"
                  value={campaignData.campaignId}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500">
                  Leave empty for automatic ID generation
                </p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-amber-800 mb-1">
                  Budget Recommendation
                </h4>
                <p className="text-xs text-amber-600">
                  For optimal results, we recommend a minimum budget of $50 and a campaign duration of 7 days.
                  This gives our AI enough time and resources to optimize your campaign performance.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit">
                Continue
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        );
        
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle>Step 3: Review & Confirm</CardTitle>
              <CardDescription>
                Review your campaign details before creating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-4">Campaign Summary</h3>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="text-sm text-gray-500">Website:</div>
                  <div className="text-sm font-medium break-all">
                    {campaignData.url}
                  </div>
                  
                  <div className="text-sm text-gray-500">Budget:</div>
                  <div className="text-sm font-medium">
                    ${campaignData.budget}
                  </div>
                  
                  <div className="text-sm text-gray-500">Duration:</div>
                  <div className="text-sm font-medium">
                    {campaignData.days} days
                  </div>
                  
                  <div className="text-sm text-gray-500">Campaign ID:</div>
                  <div className="text-sm font-medium">
                    {campaignData.campaignId || "Auto-generated"}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">What happens next?</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    Our AI will analyze your website content
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    Generate optimal targeting parameters and audience segments
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    Create compelling ad copy and visuals
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    Set up optimal bidding strategy and budget allocation
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    Launch and continuously optimize your campaign
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button 
                onClick={handleCreateCampaign}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
            </CardFooter>
          </>
        );
        
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle>Campaign Created Successfully!</CardTitle>
              <CardDescription>
                Your AI-powered marketing campaign has been created
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-medium mb-2">
                  Campaign ID: {campaignData.campaignId}
                </p>
                <p className="text-gray-500 mb-4">
                  Your campaign is now being processed by our AI system
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">AI Processing Steps</h4>
                <div className="space-y-4">
                  {apiResponse && apiResponse.responses?.map((step: any, index: number) => (
                    <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-sm capitalize">{step.state.replace(/_/g, ' ')}</p>
                        <span className="text-xs text-gray-500">{step.duration.toFixed(2)}s</span>
                      </div>
                      <p className="text-sm text-gray-600">{step.response}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleFinish}>
                Go to Dashboard
              </Button>
            </CardFooter>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create a New Campaign</h1>
        
        {/* Step indicators */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-marketing-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`h-1 flex-grow ${
              step > 1 ? 'bg-marketing-600' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-marketing-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className={`h-1 flex-grow ${
              step > 2 ? 'bg-marketing-600' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-marketing-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <div className={`h-1 flex-grow ${
              step > 3 ? 'bg-marketing-600' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 4 ? 'bg-marketing-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              4
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs w-8 text-center">URL</span>
            <span className="text-xs w-8 text-center ml-auto">Details</span>
            <span className="text-xs w-8 text-center ml-auto">Review</span>
            <span className="text-xs w-8 text-center">Done</span>
          </div>
        </div>
        
        <Card>
          {renderStepContent()}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewCampaign;
