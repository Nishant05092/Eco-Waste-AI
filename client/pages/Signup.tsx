import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Leaf,
  Recycle,
  Check,
  X,
  Sparkles,
  Globe,
  TreePine,
  Zap,
  Target,
  Users,
  Award,
} from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const strength = passwordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const getStrengthColor = (strength: number) => {
    if (strength < 25) return "bg-red-500";
    if (strength < 50) return "bg-orange-500";
    if (strength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength < 25) return "Weak";
    if (strength < 50) return "Fair";
    if (strength < 75) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (strength < 50 || !passwordsMatch) return;

    setIsLoading(true);

    // TODO: Implement actual user registration
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
        <div className="absolute inset-0 bg-gradient-to-tl from-green-100/30 via-transparent to-blue-100/30"></div>
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-emerald-200/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-teal-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 min-h-screen">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start min-h-screen">
          {/* Left Sidebar - Environmental Impact */}
          <div className="hidden xl:block xl:col-span-3 space-y-6 pt-12">
            {/* Floating Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg mb-4 animate-bounce">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Environmental Impact
              </h2>
            </div>

            {/* Impact Cards */}
            <div className="space-y-4">
              <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <TreePine className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        70%
                      </div>
                      <div className="text-sm text-gray-600">
                        Waste Reduction
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        2000L
                      </div>
                      <div className="text-sm text-gray-600">Water Saved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        3.3T
                      </div>
                      <div className="text-sm text-gray-600">CO2 Prevented</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recycling Guide */}
            <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Recycle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-orange-600 mb-2">
                    Earn Credits
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/70 p-3 rounded-lg text-center">
                    <div className="font-semibold text-green-600">Paper</div>
                    <div className="text-green-500">$0.10/kg</div>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg text-center">
                    <div className="font-semibold text-orange-600">Plastic</div>
                    <div className="text-orange-500">$0.15/kg</div>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg text-center">
                    <div className="font-semibold text-gray-600">Metal</div>
                    <div className="text-gray-500">$0.20/kg</div>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg text-center">
                    <div className="font-semibold text-blue-600">Glass</div>
                    <div className="text-blue-500">Impact</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center - Signup Form */}
          <div className="xl:col-span-6 flex flex-col justify-center max-w-lg mx-auto w-full space-y-8">
            {/* Logo and Branding */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Recycle className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                    <Leaf className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    EcoWaste
                  </span>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-500 font-medium">
                      Join the Future
                    </span>
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                Start Your Eco Journey
              </h1>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Create your account and begin making a positive environmental
                impact today
              </p>
            </div>

            {/* Signup Form */}
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
              <CardHeader className="text-center space-y-2 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Create Account
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Fill in your details to join our eco-community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                      className="h-12 border-2 border-gray-200 focus:border-green-400 focus:ring-green-400 rounded-xl text-gray-700"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="h-12 border-2 border-gray-200 focus:border-green-400 focus:ring-green-400 rounded-xl text-gray-700"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                      className="h-12 border-2 border-gray-200 focus:border-green-400 focus:ring-green-400 rounded-xl text-gray-700"
                    />
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            Password strength:
                          </span>
                          <span
                            className={`font-medium ${
                              strength >= 75
                                ? "text-green-600"
                                : strength >= 50
                                  ? "text-orange-600"
                                  : "text-red-600"
                            }`}
                          >
                            {getStrengthText(strength)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
                            style={{ width: `${strength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        required
                        className={`h-12 border-2 pr-12 rounded-xl text-gray-700 ${
                          formData.confirmPassword &&
                          (passwordsMatch
                            ? "border-green-400 focus:border-green-400"
                            : "border-red-400 focus:border-red-400")
                        } ${!formData.confirmPassword && "border-gray-200 focus:border-green-400"}`}
                      />
                      {formData.confirmPassword && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          {passwordsMatch ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {formData.confirmPassword && !passwordsMatch && (
                      <p className="text-xs text-red-500 flex items-center space-x-1">
                        <X className="w-3 h-3" />
                        <span>Passwords don't match</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={isLoading || strength < 50 || !passwordsMatch}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5" />
                        <span>Create Account</span>
                      </div>
                    )}
                  </Button>
                </form>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-green-600 hover:text-green-700 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Community Stats */}
          <div className="hidden xl:block xl:col-span-3 space-y-6 pt-12">
            {/* Floating Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl shadow-lg mb-4 animate-bounce delay-500">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Community Impact
              </h2>
            </div>

            {/* Stats Cards */}
            <div className="space-y-4">
              <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    10,000+
                  </div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-emerald-50 to-green-50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Recycle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    50 Tons
                  </div>
                  <div className="text-sm text-gray-600">Waste Recycled</div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-yellow-50 to-orange-50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    ₹2L+
                  </div>
                  <div className="text-sm text-gray-600">Credits Earned</div>
                </CardContent>
              </Card>
            </div>

            {/* Personal Impact Preview */}
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-purple-600 mb-2">
                    Your Future Impact
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    See the difference you'll make
                  </p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Carbon Saved:</span>
                    <span className="font-semibold text-green-600">
                      2.5 kg CO2
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Water Saved:</span>
                    <span className="font-semibold text-blue-600">
                      150 Liters
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trees Saved:</span>
                    <span className="font-semibold text-green-600">
                      0.5 Trees
                    </span>
                  </div>
                  <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg text-center">
                    <div className="text-xs text-green-700 font-medium flex items-center justify-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Start your eco journey today!</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
