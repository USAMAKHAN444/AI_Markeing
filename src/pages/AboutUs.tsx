
import React from 'react';
import Layout from '@/components/Layout';

const AboutUs: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            About AI Marketing Agency
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Revolutionizing digital advertising through AI automation
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-marketing-600 mb-4">Our Mission</h3>
            <p className="text-gray-600">
              We aim to simplify and improve digital advertising through advanced AI technology, 
              making campaign management more efficient, accurate, and cost-effective for businesses of all sizes.
            </p>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-marketing-600 mb-4">Our Approach</h3>
            <p className="text-gray-600">
              By leveraging cutting-edge AI algorithms, we automate the complex process of campaign creation, 
              audience targeting, and ad optimization, delivering superior results with minimal human intervention.
            </p>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-marketing-600 mb-4">Our Team</h3>
            <p className="text-gray-600">
              Our team combines expertise in digital marketing, machine learning, and software development
              to create a powerful platform that transforms how businesses approach online advertising.
            </p>
          </div>
        </div>
        
        <div className="mt-16 bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2023, AI Marketing Agency emerged from a simple observation: digital marketing has become 
            too complex, time-consuming, and often ineffective when managed manually. Our founders, experienced 
            digital marketers and AI engineers, sought to combine their expertise to create a solution that addresses 
            these challenges.
          </p>
          <p className="text-gray-600 mb-4">
            After extensive research and development, we launched our AI-powered platform that automates Google Ads 
            campaign management, from initial setup to ongoing optimization. Our technology continuously learns from 
            campaign performance data, making real-time adjustments to improve results.
          </p>
          <p className="text-gray-600">
            Today, we serve clients across various industries, helping them achieve better advertising ROI while 
            saving valuable time and resources. We remain committed to innovation, regularly enhancing our AI capabilities 
            to stay ahead in the rapidly evolving digital marketing landscape.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
