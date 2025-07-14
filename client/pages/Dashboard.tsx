import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Recycle,
  PenTool,
  Camera,
  User,
  LogOut,
  Menu,
  Coins,
  TrendingUp,
  Award,
} from "lucide-react";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const userCredits = 1250; // Mock data
  const userName = "John Doe"; // Mock data

  const handleLogout = () => {
    // TODO: Implement actual logout
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-light-green via-background to-eco-blue">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-eco-green/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Recycle className="h-8 w-8 text-eco-green" />
                <Leaf className="h-4 w-4 text-eco-orange absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold text-eco-green">EcoWaste</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-eco-light-green px-3 py-2 rounded-full">
                <Coins className="h-4 w-4 text-eco-green" />
                <span className="font-semibold text-eco-green">
                  {userCredits.toLocaleString()} credits
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 border-2 border-eco-green/30">
                      <AvatarImage
                        src="/api/placeholder-avatar"
                        alt={userName}
                      />
                      <AvatarFallback className="bg-eco-green text-white">
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/api/placeholder-avatar"
                        alt={userName}
                      />
                      <AvatarFallback className="bg-eco-green text-white text-sm">
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {userCredits.toLocaleString()} credits
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Award className="mr-2 h-4 w-4" />
                    Achievements
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-eco-green/20">
            <div className="px-4 py-4 space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-eco-green/30">
                  <AvatarImage src="/api/placeholder-avatar" alt={userName} />
                  <AvatarFallback className="bg-eco-green text-white">
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userName}</p>
                  <p className="text-sm text-muted-foreground">
                    {userCredits.toLocaleString()} credits
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-eco-green/20">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hack for Bihar Banner */}
      <div className="relative overflow-hidden h-[200px] mt-[10px] shadow-lg">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F2d9c839d066643a18661e77110813f24%2Fce1a20357d8d4fce80d191de041f95c2?format=webp&width=800"
          alt="Hack for Bihar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome back, {userName.split(" ")[0]}! 👋
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to make a positive impact? Choose how you'd like to log your
            waste today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-eco-green/20 bg-white/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Credits
              </CardTitle>
              <Coins className="h-4 w-4 text-eco-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-eco-green">
                {userCredits.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +120 from last week
              </p>
            </CardContent>
          </Card>

          <Card className="border-eco-orange/20 bg-white/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Items Recycled
              </CardTitle>
              <Recycle className="h-4 w-4 text-eco-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-eco-orange">87</div>
              <p className="text-xs text-muted-foreground">
                +12 from last week
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-white/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Impact Score
              </CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">4.8</div>
              <p className="text-xs text-muted-foreground">
                Top 10% this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Manual Entry Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-eco-green/20 hover:border-eco-green/40 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-6 bg-eco-light-green rounded-full group-hover:bg-eco-green/20 transition-colors">
                <PenTool className="h-12 w-12 text-eco-green" />
              </div>
              <CardTitle className="text-2xl font-bold text-eco-green">
                Manual Entry
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Manually log your waste items with detailed information and earn
                credits based on recyclable materials.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <Badge
                    variant="secondary"
                    className="bg-eco-light-green text-eco-green"
                  >
                    Quick & Easy
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-eco-yellow/20 text-eco-gray"
                  >
                    Earn Credits
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Perfect for paper, plastic, and metal items. Quantity-based
                  credit calculation.
                </p>
              </div>
              <Link to="/manual-entry">
                <Button
                  size="lg"
                  className="w-full bg-eco-green hover:bg-eco-green/90 text-white font-semibold py-4 text-lg group-hover:shadow-lg transition-all"
                >
                  Enter Manually
                  <PenTool className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* AI Detection Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-eco-orange/20 hover:border-eco-orange/40 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-6 bg-eco-orange/20 rounded-full group-hover:bg-eco-orange/30 transition-colors">
                <Camera className="h-12 w-12 text-eco-orange" />
              </div>
              <CardTitle className="text-2xl font-bold text-eco-orange">
                AI Detection
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Upload or capture images of your waste and let our AI
                automatically identify and categorize them.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <Badge
                    variant="secondary"
                    className="bg-eco-orange/20 text-eco-orange"
                  >
                    AI Powered
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-eco-blue/20 text-primary"
                  >
                    High Accuracy
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Advanced machine learning to identify waste types with 95%+
                  accuracy.
                </p>
              </div>
              <Link to="/ai-detection">
                <Button
                  size="lg"
                  className="w-full bg-eco-orange hover:bg-eco-orange/90 text-white font-semibold py-4 text-lg group-hover:shadow-lg transition-all"
                >
                  Detect with AI
                  <Camera className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Recent Activity
          </h2>
          <Card className="border-eco-green/20 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <Recycle className="h-12 w-12 mx-auto mb-4 text-eco-green/50" />
                <p className="text-lg">No recent activity</p>
                <p className="text-sm">
                  made with love by team Regrex!!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
