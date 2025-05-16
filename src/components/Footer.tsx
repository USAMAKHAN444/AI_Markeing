
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AdAlchemy</h3>
            <p className="text-gray-400 mb-4">
              Transforming digital advertising with AI-powered marketing automation.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com" className="text-gray-400 hover:text-white">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-400 hover:text-white">Features</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link>
              </li>
              <li>
                <Link to="/documentation" className="text-gray-400 hover:text-white">Documentation</Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white">Support</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-marketing-400 mr-2 mt-0.5" />
                <span className="text-gray-400">0305-5620643</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-marketing-400 mr-2 mt-0.5" />
                <span className="text-gray-400 break-all">usamaaghwankhalil444@gmail.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-marketing-400 mr-2 mt-0.5" />
                <span className="text-gray-400">AdAlchemy Headquarters, Islamabad, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AdAlchemy. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
