import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Recycle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-light-green via-background to-eco-blue flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-2 border-eco-green/20 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardContent className="text-center p-8 space-y-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <Recycle className="h-16 w-16 text-eco-green" />
              <Leaf className="h-8 w-8 text-eco-orange absolute -top-2 -right-2" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-eco-green">404</h1>
            <h2 className="text-2xl font-bold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground">
              Oops! The page you're looking for seems to have been recycled.
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/dashboard">
              <Button className="w-full bg-eco-green hover:bg-eco-green/90 text-white">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                className="w-full border-eco-green/30 text-eco-green hover:bg-eco-green/10"
              >
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
