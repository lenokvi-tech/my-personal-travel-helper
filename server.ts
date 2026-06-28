import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for fetching Travel Insights
  app.post("/api/travel-insights", async (req, res) => {
    try {
      const { destination } = req.body;
      if (!destination || typeof destination !== "string") {
        return res.status(400).json({ error: "Destination is required and must be a string." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("GEMINI_API_KEY is missing from environment variables.");
        return res.status(500).json({
          error: "GEMINI_API_KEY environment variable is required but is missing. Please configure it in your Secrets setting panel.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are a professional travel assistant. Provide highly accurate, practical, and comprehensive travel recommendations for the following dream destination: "${destination}".
Your advice must include the best/most affordable times to visit, flights, budget-friendly hotels with neighborhood options, and highly recommended tours/activities.
Make sure all costs and suggestions are realistic and helpful for planning.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert travel coordinator. You always reply in structured JSON matching the requested schema. Provide realistic cost estimates and specific advice based on the destination's real characteristics.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              destinationName: { type: Type.STRING, description: "Normalized and cleaned name of the destination (e.g. 'Kyoto, Japan' instead of 'kyoto')" },
              bestTimeToVisit: {
                type: Type.OBJECT,
                properties: {
                  months: { type: Type.STRING, description: "Best and most budget-friendly months to visit, e.g. 'September to November'" },
                  weatherDescription: { type: Type.STRING, description: "Brief summary of weather during those months" },
                  avgTemperature: { type: Type.STRING, description: "Average temperature range, e.g. '18°C - 24°C / 64°F - 75°F'" },
                  crowdLevel: { type: Type.STRING, description: "Crowd levels: Low, Medium, or High" },
                  priceIndex: { type: Type.STRING, description: "Relative flight/hotel cost indicator during this time: Budget, Moderate, or Expensive" },
                  pros: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of positive aspects of traveling during this time"
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of drawbacks of traveling during this time"
                  }
                },
                required: ["months", "weatherDescription", "avgTemperature", "crowdLevel", "priceIndex", "pros", "cons"]
              },
              flights: {
                type: Type.OBJECT,
                properties: {
                  avgCostRange: { type: Type.STRING, description: "Estimated average flight cost range, e.g. '$500 - $800'" },
                  bestMonthsToBook: { type: Type.STRING, description: "Best months to book the flight for maximum savings" },
                  recommendedAirlines: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2-3 popular airlines that fly to this destination"
                  },
                  tips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Tips for finding cheaper flights to this destination"
                  }
                },
                required: ["avgCostRange", "bestMonthsToBook", "recommendedAirlines", "tips"]
              },
              hotels: {
                type: Type.OBJECT,
                properties: {
                  avgCostPerNightRange: { type: Type.STRING, description: "Average price per night for budget to mid-range hotels" },
                  recommendedNeighborhoods: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING, description: "Name of neighborhood" },
                        description: { type: Type.STRING, description: "Why stay in this area" },
                        priceLevel: { type: Type.STRING, description: "Price indicator: $, $$, or $$$" }
                      },
                      required: ["name", "description", "priceLevel"]
                    }
                  },
                  budgetHotelSuggestions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING, description: "Name of real budget-friendly hotel, hostel, or guesthouse" },
                        estimatedPrice: { type: Type.STRING, description: "Estimated price per night, e.g. '$45/night'" },
                        highlight: { type: Type.STRING, description: "Key feature or perk of this accommodation" }
                      },
                      required: ["name", "estimatedPrice", "highlight"]
                    }
                  },
                  tips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Tips for saving money on hotels or alternative stays"
                  }
                },
                required: ["avgCostPerNightRange", "recommendedNeighborhoods", "budgetHotelSuggestions", "tips"]
              },
              tours: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of the tour or activity" },
                    category: { type: Type.STRING, description: "Sightseeing, Adventure, Food & Culture, or Nature" },
                    estimatedCost: { type: Type.STRING, description: "Estimated cost of the tour, e.g. '$30' or 'Free'" },
                    duration: { type: Type.STRING, description: "Duration, e.g. 'Half-day' or '3 hours'" },
                    description: { type: Type.STRING, description: "What the tour covers" },
                    highlight: { type: Type.STRING, description: "The highlight or why it is a must-do" }
                  },
                  required: ["name", "category", "estimatedCost", "duration", "description", "highlight"]
                }
              },
              generalBudgetEstimate: {
                type: Type.OBJECT,
                properties: {
                  totalDailyEstimatedBudget: { type: Type.STRING, description: "Overall budget per day for a standard traveler" },
                  costBreakdownText: { type: Type.STRING, description: "Explanation of what this daily budget covers" }
                },
                required: ["totalDailyEstimatedBudget", "costBreakdownText"]
              }
            },
            required: ["destinationName", "bestTimeToVisit", "flights", "hotels", "tours", "generalBudgetEstimate"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text received from Gemini.");
      }

      const parsedInsights = JSON.parse(responseText.trim());
      return res.json(parsedInsights);
    } catch (error: any) {
      console.error("Error generating travel insights:", error);
      return res.status(500).json({
        error: error.message || "An unexpected error occurred while generating travel insights.",
      });
    }
  });

  // Serve Vite or static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
