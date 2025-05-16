
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-6xl font-extrabold text-marketing-700 mb-4">404</h1>
        <p className="text-2xl font-medium text-gray-800 mb-6">Page not found</p>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Return to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/features">
              Explore Features <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
