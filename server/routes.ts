import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { routines, users, metrics } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  app.post("/api/routines", async (req, res) => {
    try {
      const userData = req.body;
      console.log('Creating user with data:', userData);

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

      console.log('User created:', user);

      // Generate personalized routine based on user data
      const routine = generateRoutine(userData);
      console.log('Generated routine:', routine);

      // Save routine with protocol links
      const [savedRoutine] = await db.insert(routines).values({
        userId: user.id,
        supplements: routine.supplements,
        diet: routine.diet,
        exercise: routine.exercise,
        sleepSchedule: routine.sleepSchedule,
        metrics: routine.metrics,
        protocolLinks: routine.protocolLinks,
      }).returning();

      console.log('Saved routine:', savedRoutine);
      res.json(savedRoutine);
    } catch (error) {
      console.error('Error creating routine:', error);
      res.status(500).json({ error: "Failed to create routine" });
    }
  });

  app.get("/api/routines/:id", async (req, res) => {
    try {
      const routineId = parseInt(req.params.id);
      console.log('Fetching routine with ID:', routineId);

      const routine = await db.query.routines.findFirst({
        where: eq(routines.id, routineId),
      });

      if (!routine) {
        console.log('Routine not found for ID:', routineId);
        return res.status(404).json({ error: "Routine not found" });
      }

      console.log('Found routine:', routine);
      res.json(routine);
    } catch (error) {
      console.error('Error fetching routine:', error);
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