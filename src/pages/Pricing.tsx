
import React from 'react';
import Layout from '@/components/Layout';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Pricing Plans
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Choose the perfect plan for your marketing needs
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Basic Plan */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">Basic</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">$99</span>
                <span className="ml-1 text-xl font-medium text-gray-500">/month</span>
              </div>
              <p className="mt-2 text-gray-500">Perfect for small businesses just getting started</p>
            </div>
            <div className="border-t border-gray-200 px-6 py-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">Up to 3 campaigns</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">Basic audience targeting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">Weekly performance reports</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">Email support</span>
                </li>
              </ul>
            </div>
            <div className="px-6 py-4">
              <Button onClick={handleSignUp} className="w-full">Get Started</Button>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border-2 border-marketing-500">
            <div className="bg-marketing-500 text-center py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-white">Most Popular</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">Pro</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">$199</span>
                <span className="ml-1 text-xl font-medium text-gray-500">/month</span>
              </div>
              <p className="mt-2 text-gray-500">Ideal for growing businesses with moderate ad spend</p>
            </div>
            <div className="border-t border-gray-200 px-6 py-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">Up to 10 campaigns</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">Advanced audience targeting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">Daily performance updates</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">Priority email & chat support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">A/B testing capabilities</span>
                </li>
              </ul>
            </div>
            <div className="px-6 py-4">
              <Button onClick={handleSignUp} variant="default" className="w-full bg-marketing-600 hover:bg-marketing-700">Get Started</Button>
            </div>
          </div>
          
          {/* Enterprise Plan */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">$399</span>
                <span className="ml-1 text-xl font-medium text-gray-500">/month</span>
              </div>
              <p className="mt-2 text-gray-500">Complete solution for businesses with high ad spend</p>
            </div>
            <div className="border-t border-gray-200 px-6 py-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">Unlimited campaigns</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">Custom audience segmentation</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">Real-time performance dashboard</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">24/7 dedicated support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">Advanced analytics & reporting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                  <span className="text-gray-600">Custom integration options</span>
                </li>
              </ul>
            </div>
            <div className="px-6 py-4">
              <Button onClick={handleSignUp} className="w-full">Get Started</Button>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900">Need a custom solution?</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We understand that every business has unique requirements. Contact our team to discuss 
            how we can tailor our AI marketing platform to meet your specific needs.
          </p>
          <Button variant="outline" className="mt-6">
            Contact Sales
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
