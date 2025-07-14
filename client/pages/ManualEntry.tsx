import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  PenTool,
  Calculator,
  Coins,
  CheckCircle,
  MapPin,
  Package,
  Scale,
  FileText,
} from "lucide-react";
import { WASTE_TYPES, COLLECTION_PLACES } from "@shared/api";

export default function ManualEntry() {
  const [formData, setFormData] = useState({
    wasteName: "",
    place: "",
    wasteType: "",
    quantity: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [calculatedCredits, setCalculatedCredits] = useState(0);
  const navigate = useNavigate();

  const selectedWasteType = WASTE_TYPES.find(
    (type) => type.value === formData.wasteType,
  );
  const showQuantityField = selectedWasteType?.hasQuantity || false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Calculate credits if applicable
    if (showQuantityField && formData.quantity) {
      const credits =
        parseFloat(formData.quantity) * (selectedWasteType?.pricePerKg || 0);
      setCalculatedCredits(credits);
      setShowCreditModal(true);
    } else {
      // For non-quantity items, just save the entry
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
      }, 1500);
    }

    setIsLoading(false);
  };

  const handleCalculateCredits = () => {
    if (showQuantityField && formData.quantity) {
      const credits =
        parseFloat(formData.quantity) * (selectedWasteType?.pricePerKg || 0);
      setCalculatedCredits(credits);
      setShowCreditModal(true);
    }
  };

  const handleAddToAccount = () => {
    // TODO: Add credits to user account
    setShowCreditModal(false);
    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  };

  const canCalculateCredits =
    showQuantityField && formData.quantity && parseFloat(formData.quantity) > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-light-green via-background to-eco-blue">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-eco-green/20 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-eco-green hover:text-eco-green/80"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <PenTool className="h-5 w-5 text-eco-green" />
              <span className="font-semibold text-eco-green">Manual Entry</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Log Your Waste Manually
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter detailed information about your waste to earn credits and
            track your environmental impact.
          </p>
        </div>

        <Card className="border-2 border-eco-green/20 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <Package className="h-6 w-6 text-eco-green" />
              <span>Waste Entry Form</span>
            </CardTitle>
            <CardDescription>
              Fill in the details about the waste you're logging. Fields marked
              with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Waste Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="wasteName"
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4 text-eco-green" />
                  <span>Name of Waste *</span>
                </Label>
                <Input
                  id="wasteName"
                  type="text"
                  placeholder="e.g., Plastic water bottles, Old newspapers..."
                  value={formData.wasteName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      wasteName: e.target.value,
                    }))
                  }
                  required
                  className="border-eco-green/30 focus:border-eco-green focus:ring-eco-green"
                />
              </div>

              {/* Place of Collection */}
              <div className="space-y-2">
                <Label htmlFor="place" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-eco-green" />
                  <span>Place of Collection *</span>
                </Label>
                <Select
                  value={formData.place}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, place: value }))
                  }
                  required
                >
                  <SelectTrigger className="border-eco-green/30 focus:border-eco-green focus:ring-eco-green">
                    <SelectValue placeholder="Select where you collected the waste" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLLECTION_PLACES.map((place) => (
                      <SelectItem key={place} value={place.toLowerCase()}>
                        {place}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Waste Type */}
              <div className="space-y-2">
                <Label
                  htmlFor="wasteType"
                  className="flex items-center space-x-2"
                >
                  <Package className="h-4 w-4 text-eco-green" />
                  <span>Type of Waste *</span>
                </Label>
                <Select
                  value={formData.wasteType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, wasteType: value }))
                  }
                  required
                >
                  <SelectTrigger className="border-eco-green/30 focus:border-eco-green focus:ring-eco-green">
                    <SelectValue placeholder="Select the type of waste" />
                  </SelectTrigger>
                  <SelectContent>
                    {WASTE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{type.label}</span>
                          {type.hasQuantity && (
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-eco-light-green text-eco-green"
                            >
                              Credits: ${type.pricePerKg}/kg
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity Field (conditional) */}
              {showQuantityField && (
                <div className="space-y-2">
                  <Label
                    htmlFor="quantity"
                    className="flex items-center space-x-2"
                  >
                    <Scale className="h-4 w-4 text-eco-green" />
                    <span>Quantity (kg) *</span>
                    <Badge
                      variant="secondary"
                      className="bg-eco-yellow/20 text-eco-gray"
                    >
                      Earns Credits
                    </Badge>
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="Enter weight in kg"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                      required
                      className="flex-1 border-eco-green/30 focus:border-eco-green focus:ring-eco-green"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCalculateCredits}
                      disabled={!canCalculateCredits}
                      className="border-eco-green/30 text-eco-green hover:bg-eco-green/10"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate
                    </Button>
                  </div>
                  {canCalculateCredits && (
                    <p className="text-sm text-muted-foreground">
                      Estimated credits:{" "}
                      <span className="font-semibold text-eco-green">
                        {(
                          parseFloat(formData.quantity) *
                          (selectedWasteType?.pricePerKg || 0)
                        ).toFixed(2)}{" "}
                        credits
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-eco-green" />
                  <span>Notes (Optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about the waste..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="border-eco-green/30 focus:border-eco-green focus:ring-eco-green"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-eco-green hover:bg-eco-green/90 text-white font-semibold py-4 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Saving Entry..."
                  ) : showQuantityField ? (
                    <>
                      <Coins className="mr-2 h-5 w-5" />
                      Submit & Calculate Credits
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Submit Entry
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Credit Calculation Modal */}
      <Dialog open={showCreditModal} onOpenChange={setShowCreditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-eco-green">
              <Coins className="h-6 w-6" />
              <span>Credits Calculated!</span>
            </DialogTitle>
            <DialogDescription>
              Here's how many credits you've earned from this waste entry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-eco-light-green p-6 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Waste Type:</span>
                  <p className="font-medium">{selectedWasteType?.label}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Quantity:</span>
                  <p className="font-medium">{formData.quantity} kg</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Price per kg:</span>
                  <p className="font-medium">
                    ${selectedWasteType?.pricePerKg.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Credits:</span>
                  <p className="text-2xl font-bold text-eco-green">
                    {calculatedCredits.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddToAccount}
                className="flex-1 bg-eco-green hover:bg-eco-green/90"
              >
                <Coins className="mr-2 h-4 w-4" />
                Add to Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
