// AI Detection Service using Hugging Face Inference API
import { WASTE_TYPES } from "@shared/api";

export interface AIDetectionResult {
  detectedType: string;
  confidence: number;
  rawPredictions?: any[];
}

// Mapping from common object classifications to waste types
const CLASSIFICATION_TO_WASTE_MAP: { [key: string]: string } = {
  // Paper-related
  book: "paper",
  notebook: "paper",
  envelope: "paper",
  newspaper: "paper",
  magazine: "paper",
  "cardboard box": "paper",
  tissue: "paper",
  "paper bag": "paper",

  // Plastic-related
  "plastic bag": "plastic",
  "water bottle": "plastic",
  bottle: "plastic",
  container: "plastic",
  cup: "plastic",
  plate: "plastic",
  toy: "plastic",
  packaging: "plastic",

  // Metal-related
  can: "metal",
  "soda can": "metal",
  "beer can": "metal",
  tin: "metal",
  "aluminum foil": "metal",
  "metal container": "metal",
  cutlery: "metal",
  knife: "metal",
  fork: "metal",
  spoon: "metal",

  // Glass-related
  "wine bottle": "glass",
  "beer bottle": "glass",
  jar: "glass",
  glass: "glass",
  mirror: "glass",
  window: "glass",

  // E-waste related
  laptop: "e-waste",
  computer: "e-waste",
  phone: "e-waste",
  tablet: "e-waste",
  keyboard: "e-waste",
  mouse: "e-waste",
  monitor: "e-waste",
  television: "e-waste",
  radio: "e-waste",
  battery: "e-waste",
  cable: "e-waste",
  charger: "e-waste",

  // Textile-related
  shirt: "textile",
  pants: "textile",
  dress: "textile",
  jacket: "textile",
  shoe: "textile",
  sock: "textile",
  hat: "textile",
  bag: "textile",

  // Organic-related
  apple: "organic",
  banana: "organic",
  orange: "organic",
  vegetable: "organic",
  fruit: "organic",
  food: "organic",
  bread: "organic",
  meat: "organic",

  // Default fallback
  unknown: "glass", // Default to glass as it's common
};

// Enhanced mock AI classification for demonstration
// In production, replace with actual Hugging Face API call
async function mockAIClassification(
  imageData: string,
): Promise<AIDetectionResult> {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 1000),
  );

  // Different mock predictions based on random selection to simulate variety
  const wasteScenarios = [
    {
      predictions: [
        { label: "plastic bottle", score: 0.89 },
        { label: "water bottle", score: 0.84 },
        { label: "container", score: 0.71 },
        { label: "bottle", score: 0.68 },
        { label: "plastic bag", score: 0.34 },
      ],
    },
    {
      predictions: [
        { label: "aluminum can", score: 0.92 },
        { label: "soda can", score: 0.88 },
        { label: "beer can", score: 0.76 },
        { label: "metal container", score: 0.65 },
        { label: "tin", score: 0.43 },
      ],
    },
    {
      predictions: [
        { label: "newspaper", score: 0.85 },
        { label: "paper", score: 0.81 },
        { label: "magazine", score: 0.72 },
        { label: "cardboard box", score: 0.69 },
        { label: "book", score: 0.48 },
      ],
    },
    {
      predictions: [
        { label: "glass bottle", score: 0.87 },
        { label: "wine bottle", score: 0.82 },
        { label: "jar", score: 0.74 },
        { label: "glass", score: 0.68 },
        { label: "beer bottle", score: 0.55 },
      ],
    },
    {
      predictions: [
        { label: "smartphone", score: 0.91 },
        { label: "phone", score: 0.86 },
        { label: "electronic device", score: 0.78 },
        { label: "tablet", score: 0.62 },
        { label: "computer", score: 0.44 },
      ],
    },
    {
      predictions: [
        { label: "apple", score: 0.88 },
        { label: "fruit", score: 0.83 },
        { label: "food", score: 0.76 },
        { label: "organic matter", score: 0.71 },
        { label: "vegetable", score: 0.52 },
      ],
    },
  ];

  // Randomly select a scenario to simulate different types of waste
  const selectedScenario =
    wasteScenarios[Math.floor(Math.random() * wasteScenarios.length)];
  const mockPredictions = selectedScenario.predictions;

  // Select the highest confidence prediction
  const topPrediction = mockPredictions[0];
  const wasteType = mapClassificationToWasteType(topPrediction.label);

  return {
    detectedType: wasteType,
    confidence: topPrediction.score,
    rawPredictions: mockPredictions,
  };
}

// Real Hugging Face API classification
// To enable:
// 1. Get a free API token from https://huggingface.co/settings/tokens
// 2. Replace "hf_xxxxxxxxxx" with your actual token
// 3. Change the function call in classifyWasteImage from mockAIClassification to huggingFaceClassification
async function huggingFaceClassification(
  imageData: string,
): Promise<AIDetectionResult> {
  try {
    // Convert base64 to blob for HF API
    const base64Data = imageData.split(",")[1];
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      {
        headers: {
          Authorization: "Bearer hf_xxxxxxxxxx", // Replace with your HF token
        },
        method: "POST",
        body: base64Data,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result && result.length > 0) {
      const topPrediction = result[0];
      const wasteType = mapClassificationToWasteType(topPrediction.label);

      return {
        detectedType: wasteType,
        confidence: topPrediction.score,
        rawPredictions: result,
      };
    } else {
      throw new Error("No predictions returned");
    }
  } catch (error) {
    console.error("Hugging Face API error:", error);
    // Fallback to mock classification
    return mockAIClassification(imageData);
  }
}

function mapClassificationToWasteType(classification: string): string {
  const lowerClassification = classification.toLowerCase();

  // Direct mapping
  for (const [key, wasteType] of Object.entries(CLASSIFICATION_TO_WASTE_MAP)) {
    if (lowerClassification.includes(key.toLowerCase())) {
      return wasteType;
    }
  }

  // Fuzzy matching for common waste terms
  if (lowerClassification.includes("bottle")) return "plastic";
  if (lowerClassification.includes("can")) return "metal";
  if (
    lowerClassification.includes("paper") ||
    lowerClassification.includes("book")
  )
    return "paper";
  if (
    lowerClassification.includes("phone") ||
    lowerClassification.includes("electronic")
  )
    return "e-waste";
  if (
    lowerClassification.includes("clothes") ||
    lowerClassification.includes("fabric")
  )
    return "textile";
  if (
    lowerClassification.includes("food") ||
    lowerClassification.includes("fruit")
  )
    return "organic";
  if (
    lowerClassification.includes("glass") ||
    lowerClassification.includes("jar")
  )
    return "glass";

  // Default to plastic as it's the most common waste type
  return "plastic";
}

export async function classifyWasteImage(
  imageFile: File,
): Promise<AIDetectionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const imageData = event.target?.result as string;

        // Use mock classification for demo (replace with huggingFaceClassification for production)
        const result = await mockAIClassification(imageData);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read image file"));
    };

    reader.readAsDataURL(imageFile);
  });
}

export function getWasteTypeInfo(wasteType: string) {
  return WASTE_TYPES.find((type) => type.value === wasteType);
}

export function generateWasteName(wasteType: string): string {
  const wasteNames: { [key: string]: string[] } = {
    paper: [
      "Old newspapers",
      "Cardboard box",
      "Office paper",
      "Magazine",
      "Book pages",
    ],
    plastic: [
      "Plastic bottle",
      "Food container",
      "Plastic bag",
      "Disposable cup",
      "Packaging material",
    ],
    metal: [
      "Aluminum can",
      "Tin can",
      "Metal container",
      "Food can",
      "Beverage can",
    ],
    glass: [
      "Glass bottle",
      "Glass jar",
      "Broken glass",
      "Wine bottle",
      "Food jar",
    ],
    "e-waste": [
      "Old smartphone",
      "Laptop",
      "Computer parts",
      "Electronic device",
      "Battery",
    ],
    textile: [
      "Old clothing",
      "Fabric scraps",
      "Used textile",
      "Clothing item",
      "Fabric waste",
    ],
    organic: [
      "Food waste",
      "Fruit peels",
      "Vegetable scraps",
      "Organic matter",
      "Compostable waste",
    ],
    hazardous: [
      "Chemical container",
      "Paint can",
      "Battery",
      "Hazardous material",
      "Toxic waste",
    ],
  };

  const names = wasteNames[wasteType] || ["Unknown waste item"];
  return names[Math.floor(Math.random() * names.length)];
}
