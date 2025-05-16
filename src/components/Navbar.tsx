
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X, User, BarChart2, LogOut, Settings, PlusCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-marketing-700">AdAlchemy</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="text-gray-700 hover:text-marketing-600 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/features" className="text-gray-700 hover:text-marketing-600 px-3 py-2 text-sm font-medium">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-marketing-600 px-3 py-2 text-sm font-medium">
                Pricing
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-marketing-600 px-3 py-2 text-sm font-medium">
                About Us
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/campaigns/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Campaign
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src={user?.profileImage} alt={user?.fullName} />
                        <AvatarFallback>{user?.fullName ? getInitials(user.fullName) : 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer flex w-full items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer flex w-full items-center">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer flex w-full items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-marketing-500"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/features"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={toggleMobileMenu}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={toggleMobileMenu}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={toggleMobileMenu}
            >
              About Us
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={toggleMobileMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/campaigns/new"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={toggleMobileMenu}
                >
                  New Campaign
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={toggleMobileMenu}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={toggleMobileMenu}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={toggleMobileMenu}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={toggleMobileMenu}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
