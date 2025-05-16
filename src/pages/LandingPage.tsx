
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart3, 
  Target, 
  Clock, 
  TrendingUp, 
  Globe, 
  Users, 
  Award, 
  CheckCircle2 
} from 'lucide-react';
import Layout from '@/components/Layout';

const LandingPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-28">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered Marketing Automation for Google Ads
            </h1>
            <p className="text-xl text-gray-600 mb-8 md:mb-12">
              Revolutionize your ad campaigns with cutting-edge AI technology. Optimize targeting, generate compelling creative, and maximize ROI—all automatically.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link to="/features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful AI Marketing Features</h2>
            <p className="text-xl text-gray-600">
              Our platform uses advanced AI to automate and optimize every aspect of your Google Ads campaigns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="feature-card border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="rounded-full bg-marketing-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-marketing-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Audience Targeting</h3>
                <p className="text-gray-600">
                  Our AI analyzes your website and business to identify and target the ideal audience demographics, interests, and behaviors.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="feature-card border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="rounded-full bg-marketing-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-marketing-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Automated Campaign Optimization</h3>
                <p className="text-gray-600">
                  Continuous performance monitoring and automatic adjustments to bidding strategies and budget allocation.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="feature-card border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="rounded-full bg-marketing-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-marketing-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Intelligent Ad Scheduling</h3>
                <p className="text-gray-600">
                  AI determines the optimal times to display your ads based on user activity patterns and engagement data.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="feature-card border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="rounded-full bg-marketing-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-marketing-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Geo-Location Optimization</h3>
                <p className="text-gray-600">
                  Target specific geographic areas where your potential customers are most likely to engage with your ads.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="feature-card border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="rounded-full bg-marketing-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-marketing-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-gray-600">
                  Comprehensive dashboards with actionable insights and performance metrics updated in real-time.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="feature-card border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="rounded-full bg-marketing-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-marketing-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Content Generation</h3>
                <p className="text-gray-600">
                  Generate engaging ad headlines, descriptions, and visuals tailored to your target audience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How AdAlchemy Works</h2>
            <p className="text-xl text-gray-600">
              Our simple 4-step process automates your entire Google Ads campaign management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="rounded-full bg-marketing-600 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Website</h3>
              <p className="text-gray-600">
                Provide your website URL and our AI will analyze your content and business type.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="rounded-full bg-marketing-600 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Set Your Budget</h3>
              <p className="text-gray-600">
                Define your advertising budget and campaign duration for optimal resource allocation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="rounded-full bg-marketing-600 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Creates Your Campaign</h3>
              <p className="text-gray-600">
                Our system generates targeting, ad copy, images, and schedules automatically.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="rounded-full bg-marketing-600 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Monitor & Optimize</h3>
              <p className="text-gray-600">
                Track performance and let our AI continuously optimize your campaign results.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/register">Start Automating Your Ads</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">
              Businesses are achieving outstanding results with our AI marketing platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "AdAlchemy's AI-driven approach has completely transformed our Google Ads strategy. We've seen a 47% increase in conversions while actually reducing our ad spend."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-marketing-200 rounded-full flex items-center justify-center">
                    <span className="text-marketing-700 font-semibold">JS</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">John Smith</p>
                    <p className="text-sm text-gray-500">Marketing Director, TechFlow Inc.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "The AI-generated ad copy and targeting is incredibly effective. It's like having an expert marketing team working 24/7, but at a fraction of the cost."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-marketing-200 rounded-full flex items-center justify-center">
                    <span className="text-marketing-700 font-semibold">SP</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">Sarah Parker</p>
                    <p className="text-sm text-gray-500">CEO, Boutique Retail</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "As a small business owner, I never had time to manage Google Ads effectively. AdAlchemy handles everything automatically and our ROI has been incredible."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-marketing-200 rounded-full flex items-center justify-center">
                    <span className="text-marketing-700 font-semibold">MR</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">Michael Rodriguez</p>
                    <p className="text-sm text-gray-500">Owner, Local Services Co.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-marketing-600 text-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Ad Campaigns?</h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of businesses using AI to revolutionize their marketing results.
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link to="/register">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="border-0 shadow-lg relative">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Starter</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Perfect for small businesses just getting started with digital ads.</p>
                <ul className="space-y-3 mb-6">
                  {['3 active campaigns', 'Basic audience targeting', 'AI-generated ad copy', 'Weekly performance reports'].map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-marketing-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline">Select Plan</Button>
              </CardContent>
            </Card>

            {/* Growth Plan */}
            <Card className="border-0 shadow-xl relative">
              <div className="absolute top-0 inset-x-0 transform -translate-y-1/2">
                <span className="bg-marketing-500 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mx-auto">
                  Most Popular
                </span>
              </div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Growth</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Ideal for growing businesses looking to scale their advertising.</p>
                <ul className="space-y-3 mb-6">
                  {[
                    '10 active campaigns',
                    'Advanced audience targeting',
                    'AI-generated ad copy & images',
                    'Daily performance optimization',
                    'Campaign A/B testing',
                    'Dedicated support'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-marketing-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full">Select Plan</Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-0 shadow-lg relative">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$499</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">For businesses with large-scale advertising needs.</p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Unlimited campaigns',
                    'Enterprise-grade targeting',
                    'Full creative suite',
                    'Hourly optimization',
                    'Advanced analytics & insights',
                    'Priority support',
                    'Custom integration options'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-marketing-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline">Select Plan</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
