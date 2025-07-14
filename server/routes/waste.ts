import { RequestHandler } from "express";

// Mock database - in a real app, this would be a proper database
let mockWasteEntries: any[] = [];
let mockUsers: any[] = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    totalCredits: 1250,
  },
];

interface WasteEntry {
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
}

// Create waste entry
export const createWasteEntry: RequestHandler = (req, res) => {
  try {
    const {
      wasteName,
      wasteType,
      quantity,
      place,
      notes,
      entryType = "manual",
      aiConfidence,
      aiRawPredictions,
    } = req.body;

    // Calculate credits based on waste type and quantity
    const wasteTypePrices: { [key: string]: number } = {
      paper: 0.1,
      plastic: 0.15,
      metal: 0.2,
      glass: 0,
      organic: 0,
      "e-waste": 0,
      textile: 0,
      hazardous: 0,
    };

    const pricePerKg = wasteTypePrices[wasteType] || 0;
    const creditsEarned = quantity ? quantity * pricePerKg : 0;

    const newEntry: WasteEntry = {
      id: mockWasteEntries.length + 1,
      userId: 1, // Mock user ID
      entryType,
      wasteName,
      wasteType,
      quantity: quantity ? parseFloat(quantity) : undefined,
      place,
      notes,
      creditsEarned,
      createdAt: new Date().toISOString(),
      ...(entryType === "ai" && {
        aiConfidence,
        aiRawPredictions,
      }),
    };

    mockWasteEntries.push(newEntry);

    // Update user's total credits
    const user = mockUsers.find((u) => u.id === 1);
    if (user) {
      user.totalCredits += creditsEarned;
    }

    res.status(201).json({
      success: true,
      entry: newEntry,
      creditsEarned,
      newTotalCredits: user?.totalCredits || 0,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to create waste entry",
    });
  }
};

// Get waste entries for a user
export const getWasteEntries: RequestHandler = (req, res) => {
  try {
    const userId = parseInt(req.params.userId || "1");
    const userEntries = mockWasteEntries.filter(
      (entry) => entry.userId === userId,
    );

    res.json({
      success: true,
      entries: userEntries,
      total: userEntries.length,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to fetch waste entries",
    });
  }
};

// Get user profile with credits
export const getUserProfile: RequestHandler = (req, res) => {
  try {
    const userId = parseInt(req.params.userId || "1");
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Calculate additional stats
    const userEntries = mockWasteEntries.filter(
      (entry) => entry.userId === userId,
    );
    const totalItemsRecycled = userEntries.length;
    const totalCreditsEarned = userEntries.reduce(
      (sum, entry) => sum + entry.creditsEarned,
      0,
    );

    res.json({
      success: true,
      user: {
        ...user,
        stats: {
          totalItemsRecycled,
          totalCreditsEarned,
          averageCreditsPerItem:
            totalItemsRecycled > 0
              ? totalCreditsEarned / totalItemsRecycled
              : 0,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to fetch user profile",
    });
  }
};

// Mock authentication endpoints
export const loginUser: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body;

    // Mock authentication - in a real app, you'd validate credentials
    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        totalCredits: user.totalCredits,
      },
      token: "mock-jwt-token", // In a real app, generate a proper JWT
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Login failed",
    });
  }
};

export const signupUser: RequestHandler = (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      username: name.toLowerCase().replace(" ", "_"),
      email,
      totalCredits: 0,
    };

    mockUsers.push(newUser);

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        totalCredits: newUser.totalCredits,
      },
      token: "mock-jwt-token", // In a real app, generate a proper JWT
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Signup failed",
    });
  }
};
