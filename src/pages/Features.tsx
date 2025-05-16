
import React from 'react';
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
import Layout from '@/components/Layout';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      title: "AI-Powered Campaign Creation",
      description: "Our AI analyzes your website and business context to create optimally targeted campaigns that reach the right audience at the right time.",
      icon: <Sparkles className="h-5 w-5 text-marketing-600" />
    },
    {
      title: "Advanced Audience Targeting",
      description: "Leverage machine learning algorithms to identify and target the most valuable customer segments for your business.",
      icon: <CheckCircle className="h-5 w-5 text-marketing-600" />
    },
    {
      title: "Automatic Optimization",
      description: "Campaigns automatically adjust based on performance data to maximize ROI and minimize wasted ad spend.",
      icon: <CheckCircle className="h-5 w-5 text-marketing-600" />
    },
    {
      title: "Real-time Analytics",
      description: "Track campaign performance with comprehensive, real-time dashboards and detailed reporting.",
      icon: <CheckCircle className="h-5 w-5 text-marketing-600" />
    },
    {
      title: "Google Ads Integration",
      description: "Seamless integration with Google Ads platform for maximum reach and impact across the web.",
      icon: <CheckCircle className="h-5 w-5 text-marketing-600" />
    },
    {
      title: "Campaign Management Tools",
      description: "Easy-to-use tools for managing budgets, schedules, and creative assets across all your campaigns.",
      icon: <CheckCircle className="h-5 w-5 text-marketing-600" />
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Powerful Features</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our AI-powered marketing platform can help you create, manage, and optimize campaigns for maximum ROI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 border-gray-100 transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {feature.icon}
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-marketing-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to supercharge your marketing?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Get started today and see how our AI can transform your marketing campaigns.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/register">
                Create an Account
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/campaigns/new">
                Start a Campaign <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Features;
