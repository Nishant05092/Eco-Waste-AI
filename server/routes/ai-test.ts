import { RequestHandler } from "express";

// Test endpoint for AI detection functionality
export const testAIDetection: RequestHandler = (req, res) => {
  try {
    const { imageData, detectedType, confidence } = req.body;

    // Simulate processing the AI detection request
    const mockResult = {
      success: true,
      message: "AI detection test successful",
      received: {
        hasImageData: !!imageData,
        detectedType,
        confidence,
        timestamp: new Date().toISOString(),
      },
      supportedWasteTypes: [
        "paper",
        "plastic",
        "metal",
        "glass",
        "organic",
        "e-waste",
        "textile",
        "hazardous",
      ],
    };

    res.json(mockResult);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "AI detection test failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get AI detection statistics
export const getAIStats: RequestHandler = (req, res) => {
  try {
    const stats = {
      success: true,
      aiDetectionStats: {
        totalDetections: 0, // Would be from database in real app
        accuracyRate: 95.2,
        averageConfidence: 87.3,
        mostDetectedType: "plastic",
        categoriesSupported: 8,
        lastUpdated: new Date().toISOString(),
      },
      modelInfo: {
        name: "Waste Classification Model",
        version: "1.0.0",
        provider: "Hugging Face (ViT)",
        status: "Mock Mode - Ready for Production",
      },
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch AI statistics",
    });
  }
};
