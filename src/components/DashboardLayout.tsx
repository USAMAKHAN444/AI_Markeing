
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Plus,
  Settings,
  CreditCard,
  User,
  LogOut,
  BarChart3,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { name: 'Campaigns', href: '/campaigns', icon: BarChart3 },
    { name: 'Create Campaign', href: '/campaigns/new', icon: Plus },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    if (path === '/campaigns' && location.pathname.startsWith('/campaigns') && location.pathname !== '/campaigns/new') {
      return true;
    }
    return location.pathname === path;
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden" 
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            type="button"
            onClick={toggleMobileSidebar}
            className="text-gray-600 p-2 rounded-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-2 text-lg font-bold text-marketing-700">AdAlchemy</span>
        </div>
        
        <div>
          <button className="bg-gray-100 p-2 rounded-full">
            <User size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Sidebar for mobile and desktop */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="px-4 py-5 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-marketing-700">AdAlchemy</span>
            </Link>
            <button
              type="button"
              onClick={toggleMobileSidebar}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(item.href)
                    ? 'bg-marketing-50 text-marketing-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${
                  isActive(item.href) ? 'text-marketing-600' : 'text-gray-500'
                }`} />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-9 w-9 rounded-full bg-marketing-100 flex items-center justify-center">
                  <span className="font-medium text-marketing-700">
                    {user?.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
