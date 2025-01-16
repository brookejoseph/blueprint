import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { routines, users, metrics } from "@db/schema";

export function registerRoutes(app: Express): Server {
  app.post("/api/routines", async (req, res) => {
    try {
      const userData = req.body;
      
      // Create user
      const [user] = await db.insert(users).values({
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
      }).returning();

      // Generate personalized routine based on user data
      const routine = generateRoutine(userData);
      
      // Save routine
      const [savedRoutine] = await db.insert(routines).values({
        userId: user.id,
        ...routine,
      }).returning();

      res.json(savedRoutine);
    } catch (error) {
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
  // This is a simplified version of the routine generation
  return {
    supplements: [
      { name: "Vitamin D", dosage: "2000 IU", timing: "Morning" },
      { name: "Omega-3", dosage: "1000mg", timing: "With meal" },
    ],
    diet: {
      meals: ["Green smoothie", "Vegetable-rich lunch", "Light dinner"],
      restrictions: ["No processed foods", "Limited sugar"],
      schedule: ["Breakfast 8am", "Lunch 1pm", "Dinner 6pm"],
    },
    exercise: {
      type: "Mixed cardio and strength",
      frequency: "5 times per week",
      duration: "45 minutes",
    },
    sleepSchedule: {
      bedtime: "22:00",
      wakeTime: "06:00",
      sleepGoal: 8,
    },
    metrics: {
      trackWeight: true,
      trackSleep: true,
      trackSteps: true,
      trackSupplements: true,
    },
  };
}
