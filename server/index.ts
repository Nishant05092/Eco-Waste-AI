import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  createWasteEntry,
  getWasteEntries,
  getUserProfile,
  loginUser,
  signupUser,
} from "./routes/waste";
import { testAIDetection, getAIStats } from "./routes/ai-test";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", loginUser);
  app.post("/api/auth/signup", signupUser);

  // Waste management routes
  app.post("/api/waste/entries", createWasteEntry);
  app.get("/api/waste/entries/:userId?", getWasteEntries);
  app.get("/api/users/:userId", getUserProfile);

  // AI detection routes
  app.post("/api/ai/test", testAIDetection);
  app.get("/api/ai/stats", getAIStats);

  return app;
}
