import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { routines, users, metrics } from "@db/schema";

export function registerRoutes(app: Express): Server {
  app.post("/api/routines", async (req, res) => {
    try {
      const userData = req.body;

      // Create user with all questionnaire data
      const [user] = await db.insert(users).values({
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        improvementAreas: userData.improvementAreas,
        budget: userData.budget,
        equipment: userData.equipment,
        currentHealth: userData.currentHealth,
      }).returning();

      // Generate personalized routine based on user data
      const routine = generateRoutine(userData);

      // Save routine with protocol links
      const [savedRoutine] = await db.insert(routines).values({
        userId: user.id,
        ...routine,
      }).returning();

      res.json(savedRoutine);
    } catch (error) {
      console.error('Error creating routine:', error);
      res.status(500).json({ error: "Failed to create routine" });
    }
  });

  app.get("/api/routines/:id", async (req, res) => {
    try {
      const routine = await db.query.routines.findFirst({
        where: (routines, { eq }) => eq(routines.id, parseInt(req.params.id)),
      });

      if (!routine) {
        return res.status(404).json({ error: "Routine not found" });
      }

      res.json(routine);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routine" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateRoutine(userData: any) {
  const protocolLinks = {
    supplements: "https://protocol.bryanjohnson.com/#supplements",
    exercise: "https://protocol.bryanjohnson.com/#exercise",
    diet: "https://protocol.bryanjohnson.com/#perfect-diet",
    sleep: "https://protocol.bryanjohnson.com/#sleep",
    testing: "https://protocol.bryanjohnson.com/#measurements",
  };

  return {
    supplements: [
      { 
        name: "Vitamin D3", 
        dosage: "2,000 IU", 
        timing: "Morning",
        reference: protocolLinks.supplements 
      },
      { 
        name: "Omega-3", 
        dosage: "2g EPA, 1g DHA", 
        timing: "With meals",
        reference: protocolLinks.supplements 
      },
      // Add more supplements based on user profile
    ],
    diet: {
      meals: [
        "Green Giant (morning smoothie)",
        "Nutty Pudding breakfast",
        "Super Veggie lunch",
      ],
      restrictions: [
        "No food 3 hours before bedtime",
        "Vegan except for specific supplements"
      ],
      schedule: ["Breakfast 6am", "Lunch 11am", "Dinner 4pm"],
      reference: protocolLinks.diet
    },
    exercise: {
      type: "Zone 2 cardio + strength training",
      frequency: "Daily",
      duration: "1 hour",
      reference: protocolLinks.exercise
    },
    sleepSchedule: {
      bedtime: "20:30",
      wakeTime: "05:30",
      sleepGoal: 8,
      reference: protocolLinks.sleep
    },
    metrics: {
      trackWeight: true,
      trackSleep: true,
      trackSteps: true,
      trackSupplements: true,
      reference: protocolLinks.testing
    },
    protocolLinks
  };
}