// Demo response type (existing)
export interface DemoResponse {
  message: string;
  timestamp: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
    totalCredits: number;
  };
  token?: string;
  error?: string;
}

// Waste entry types
export interface WasteEntry {
  id: number;
  userId: number;
  entryType: "manual" | "ai";
  wasteName: string;
  wasteType: string;
  quantity?: number;
  place: string;
  notes?: string;
  creditsEarned: number;
  createdAt: string;
  // AI-specific fields
  aiConfidence?: number;
  aiRawPredictions?: any[];
}

export interface CreateWasteEntryRequest {
  wasteName: string;
  wasteType: string;
  quantity?: number;
  place: string;
  notes?: string;
  entryType?: "manual" | "ai";
  // AI-specific fields
  aiConfidence?: number;
  aiRawPredictions?: any[];
}

export interface CreateWasteEntryResponse {
  success: boolean;
  entry?: WasteEntry;
  creditsEarned?: number;
  newTotalCredits?: number;
  error?: string;
}

export interface GetWasteEntriesResponse {
  success: boolean;
  entries?: WasteEntry[];
  total?: number;
  error?: string;
}

// User profile types
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  totalCredits: number;
  stats: {
    totalItemsRecycled: number;
    totalCreditsEarned: number;
    averageCreditsPerItem: number;
  };
}

export interface GetUserProfileResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

// Waste type information
export interface WasteTypeInfo {
  value: string;
  label: string;
  hasQuantity: boolean;
  pricePerKg: number;
}

export const WASTE_TYPES: WasteTypeInfo[] = [
  { value: "paper", label: "Paper", hasQuantity: true, pricePerKg: 0.1 },
  { value: "plastic", label: "Plastic", hasQuantity: true, pricePerKg: 0.15 },
  { value: "metal", label: "Metal", hasQuantity: true, pricePerKg: 0.2 },
  { value: "glass", label: "Glass", hasQuantity: false, pricePerKg: 0 },
  { value: "organic", label: "Organic", hasQuantity: false, pricePerKg: 0 },
  { value: "e-waste", label: "E-Waste", hasQuantity: false, pricePerKg: 0 },
  { value: "textile", label: "Textile", hasQuantity: false, pricePerKg: 0 },
  { value: "hazardous", label: "Hazardous", hasQuantity: false, pricePerKg: 0 },
];

export const COLLECTION_PLACES = [
  "Home",
  "Office",
  "School",
  "Park",
  "Shopping Mall",
  "Restaurant",
  "Factory",
  "Hospital",
  "Other",
];
