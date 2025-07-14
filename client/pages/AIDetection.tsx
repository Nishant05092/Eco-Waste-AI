import { useState, useRef, useCallback } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Camera,
  Upload,
  X,
  RotateCcw,
  CheckCircle,
  Brain,
  Zap,
  Eye,
  MapPin,
  Package,
  Scale,
  FileText,
  Coins,
  Loader2,
} from "lucide-react";
import {
  classifyWasteImage,
  getWasteTypeInfo,
  generateWasteName,
  AIDetectionResult,
} from "@/services/aiDetection";
import { COLLECTION_PLACES } from "@shared/api";

type DetectionStep = "capture" | "detecting" | "results" | "review";

interface FormData {
  wasteName: string;
  place: string;
  wasteType: string;
  quantity: string;
  notes: string;
}

export default function AIDetection() {
  const [currentStep, setCurrentStep] = useState<DetectionStep>("capture");
  const [selectedTab, setSelectedTab] = useState("upload");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] =
    useState<AIDetectionResult | null>(null);
  const [formData, setFormData] = useState<FormData>({
    wasteName: "",
    place: "",
    wasteType: "",
    quantity: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [calculatedCredits, setCalculatedCredits] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);

  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreamActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0);

      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageDataUrl);

      // Convert to file for processing
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured-image.jpg", {
            type: "image/jpeg",
          });
          setImageFile(file);
        }
      });

      stopCamera();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setImageFile(null);
    setDetectionResult(null);
    setCurrentStep("capture");
    if (selectedTab === "camera") {
      startCamera();
    }
  };

  const detectWaste = async () => {
    if (!imageFile) return;

    setIsDetecting(true);
    setCurrentStep("detecting");

    try {
      const result = await classifyWasteImage(imageFile);
      setDetectionResult(result);

      // Auto-populate form with AI results
      const wasteTypeInfo = getWasteTypeInfo(result.detectedType);
      setFormData({
        wasteName: generateWasteName(result.detectedType),
        place: "",
        wasteType: result.detectedType,
        quantity: wasteTypeInfo?.hasQuantity ? "1.0" : "",
        notes: `Detected by AI with ${(result.confidence * 100).toFixed(1)}% confidence`,
      });

      setCurrentStep("results");
    } catch (error) {
      console.error("Detection error:", error);
      alert("Failed to detect waste. Please try again.");
      setCurrentStep("capture");
    } finally {
      setIsDetecting(false);
    }
  };

  const proceedToReview = () => {
    setCurrentStep("review");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const wasteTypeInfo = getWasteTypeInfo(formData.wasteType);
      const showQuantityField = wasteTypeInfo?.hasQuantity || false;

      // Prepare the request data
      const requestData = {
        wasteName: formData.wasteName,
        wasteType: formData.wasteType,
        quantity: showQuantityField ? parseFloat(formData.quantity) : undefined,
        place: formData.place,
        notes: formData.notes,
        entryType: "ai" as const,
        aiConfidence: detectionResult?.confidence,
        aiRawPredictions: detectionResult?.rawPredictions,
      };

      // Submit to backend
      const response = await fetch("/api/waste/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit waste entry");
      }

      const result = await response.json();

      // Calculate credits if applicable
      if (showQuantityField && formData.quantity) {
        const credits = result.creditsEarned || 0;
        setCalculatedCredits(credits);
        setShowCreditModal(true);
      } else {
        // For non-quantity items, just navigate back
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting waste entry:", error);
      alert("Failed to submit waste entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToAccount = () => {
    setShowCreditModal(false);
    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  };

  const selectedWasteType = getWasteTypeInfo(formData.wasteType);
  const showQuantityField = selectedWasteType?.hasQuantity || false;

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
              <Brain className="h-5 w-5 text-eco-orange" />
              <span className="font-semibold text-eco-orange">
                AI Detection
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                ["capture", "detecting"].includes(currentStep)
                  ? "bg-eco-orange text-white"
                  : "bg-eco-orange/20 text-eco-orange"
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>1. Capture</span>
            </div>
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentStep === "results"
                  ? "bg-eco-orange text-white"
                  : "bg-eco-orange/20 text-eco-orange"
              }`}
            >
              <Brain className="h-4 w-4" />
              <span>2. Detect</span>
            </div>
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentStep === "review"
                  ? "bg-eco-green text-white"
                  : "bg-eco-green/20 text-eco-green"
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span>3. Review</span>
            </div>
          </div>
        </div>

        {/* Step 1: Image Capture */}
        {currentStep === "capture" && (
          <Card className="border-2 border-eco-orange/20 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                <Camera className="h-6 w-6 text-eco-orange" />
                <span>Capture or Upload Image</span>
              </CardTitle>
              <CardDescription>
                Take a photo or upload an image of your waste for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload Image</TabsTrigger>
                  <TabsTrigger value="camera">Use Camera</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <div
                    className="border-2 border-dashed border-eco-orange/30 rounded-lg p-8 text-center bg-eco-orange/5 hover:bg-eco-orange/10 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 mx-auto text-eco-orange/60 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Upload Image File
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click to select or drag and drop an image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: JPG, PNG, WebP (max 10MB)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </TabsContent>

                <TabsContent value="camera" className="space-y-4">
                  <div className="border-2 border-eco-orange/30 rounded-lg overflow-hidden bg-black">
                    {!isStreamActive ? (
                      <div className="aspect-video flex items-center justify-center bg-eco-orange/5">
                        <div className="text-center">
                          <Camera className="h-16 w-16 mx-auto text-eco-orange/60 mb-4" />
                          <Button
                            onClick={startCamera}
                            className="bg-eco-orange hover:bg-eco-orange/90"
                          >
                            Start Camera
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          <Button
                            onClick={captureImage}
                            size="lg"
                            className="bg-eco-orange hover:bg-eco-orange/90 rounded-full w-16 h-16"
                          >
                            <Camera className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {capturedImage && (
                <div className="mt-6 space-y-4">
                  <div className="border-2 border-eco-green/30 rounded-lg overflow-hidden">
                    <img
                      src={capturedImage}
                      alt="Captured waste"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={retakeImage}
                      variant="outline"
                      className="flex-1 border-eco-orange/30 text-eco-orange hover:bg-eco-orange/10"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Retake
                    </Button>
                    <Button
                      onClick={detectWaste}
                      className="flex-1 bg-eco-orange hover:bg-eco-orange/90"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Detect Waste
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: AI Detection in Progress */}
        {currentStep === "detecting" && (
          <Card className="border-2 border-eco-orange/20 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <Brain className="h-16 w-16 text-eco-orange animate-pulse" />
                    <Loader2 className="h-8 w-8 text-eco-green animate-spin absolute -bottom-2 -right-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-eco-orange">
                    AI Analyzing Image...
                  </h2>
                  <p className="text-muted-foreground">
                    Our advanced machine learning model is identifying your
                    waste type
                  </p>
                </div>
                <div className="max-w-xs mx-auto space-y-2">
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Processing image with 95%+ accuracy
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Detection Results */}
        {currentStep === "results" && detectionResult && (
          <Card className="border-2 border-eco-green/20 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                <Zap className="h-6 w-6 text-eco-green" />
                <span>Detection Complete!</span>
              </CardTitle>
              <CardDescription>
                Review the AI detection results below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {capturedImage && (
                <div className="flex justify-center">
                  <img
                    src={capturedImage}
                    alt="Analyzed waste"
                    className="w-48 h-48 object-cover rounded-lg border-2 border-eco-green/30"
                  />
                </div>
              )}

              <div className="bg-eco-light-green p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-eco-green">
                    Detection Results
                  </h3>
                  <Badge className="bg-eco-green text-white">
                    {(detectionResult.confidence * 100).toFixed(1)}% confident
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Detected Type:
                    </span>
                    <p className="text-xl font-bold text-eco-green capitalize">
                      {selectedWasteType?.label || formData.wasteType}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Suggested Name:
                    </span>
                    <p className="text-lg font-medium">{formData.wasteName}</p>
                  </div>
                </div>

                {selectedWasteType?.hasQuantity && (
                  <div className="bg-eco-yellow/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Coins className="h-5 w-5 text-eco-gray" />
                      <span className="font-medium text-eco-gray">
                        Credit Eligible!
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This waste type earns{" "}
                      <span className="font-semibold">
                        ${selectedWasteType.pricePerKg}/kg
                      </span>{" "}
                      in credits
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={retakeImage}
                  variant="outline"
                  className="flex-1 border-eco-orange/30 text-eco-orange hover:bg-eco-orange/10"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Another Image
                </Button>
                <Button
                  onClick={proceedToReview}
                  className="flex-1 bg-eco-green hover:bg-eco-green/90"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Review & Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review and Submit */}
        {currentStep === "review" && (
          <Card className="border-2 border-eco-green/20 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <CheckCircle className="h-6 w-6 text-eco-green" />
                <span>Review Detection & Add Details</span>
              </CardTitle>
              <CardDescription>
                Verify the AI detection and add any additional information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Preview */}
                {capturedImage && (
                  <div className="flex justify-center mb-6">
                    <img
                      src={capturedImage}
                      alt="Waste to submit"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-eco-green/30"
                    />
                  </div>
                )}

                {/* Form Fields */}
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

                <div className="space-y-2">
                  <Label
                    htmlFor="place"
                    className="flex items-center space-x-2"
                  >
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

                <div className="space-y-2">
                  <Label
                    htmlFor="wasteType"
                    className="flex items-center space-x-2"
                  >
                    <Package className="h-4 w-4 text-eco-green" />
                    <span>AI Detected Type</span>
                    <Badge className="bg-eco-orange/20 text-eco-orange">
                      AI Detected
                    </Badge>
                  </Label>
                  <Input
                    value={selectedWasteType?.label || formData.wasteType}
                    disabled
                    className="bg-eco-light-green border-eco-green/30"
                  />
                </div>

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
                      className="border-eco-green/30 focus:border-eco-green focus:ring-eco-green"
                    />
                    {formData.quantity && (
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

                <div className="space-y-2">
                  <Label
                    htmlFor="notes"
                    className="flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4 text-eco-green" />
                    <span>Notes</span>
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="border-eco-green/30 focus:border-eco-green focus:ring-eco-green"
                    rows={3}
                  />
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-eco-green hover:bg-eco-green/90 text-white font-semibold py-4 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : showQuantityField ? (
                      <>
                        <Coins className="mr-2 h-5 w-5" />
                        Submit & Calculate Credits
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Submit AI Detection
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Hidden canvas for camera capture */}
        <canvas ref={canvasRef} className="hidden" />
      </main>

      {/* Credit Calculation Modal */}
      <Dialog open={showCreditModal} onOpenChange={setShowCreditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-eco-green">
              <Coins className="h-6 w-6" />
              <span>AI Detection Credits!</span>
            </DialogTitle>
            <DialogDescription>
              Here's how many credits you've earned from this AI-detected waste
              entry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-eco-light-green p-6 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">AI Detected:</span>
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
              <div className="text-xs text-muted-foreground bg-eco-orange/10 p-2 rounded">
                <Brain className="h-3 w-3 inline mr-1" />
                Detected by AI with{" "}
                {((detectionResult?.confidence || 0) * 100).toFixed(1)}%
                confidence
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
