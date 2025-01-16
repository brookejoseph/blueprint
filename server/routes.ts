import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { routines, users, metrics, protocolSections } from "@db/schema";
import { eq } from "drizzle-orm";
import { scrapeProtocolSections, findRelevantSections } from "./utils/protocol-scraper";

const PROTOCOL_URL = "https://protocol.bryanjohnson.com"; // Add PROTOCOL_URL constant

let cachedProtocolSections: any[] = [];

async function initializeProtocolSections() {
  try {
    // Check if we already have sections in the database
    const existingSections = await db.query.protocolSections.findMany();

    if (existingSections.length === 0) {
      // Scrape and store sections if none exist
      const sections = await scrapeProtocolSections();

      for (const section of sections) {
        await db.insert(protocolSections).values({
          sectionId: section.id,
          title: section.title,
          content: section.content,
          categories: section.categories,
          url: section.url,
        });
      }

      cachedProtocolSections = sections;
    } else {
      cachedProtocolSections = existingSections.map(section => ({
        id: section.sectionId,
        title: section.title,
        content: section.content,
        categories: section.categories,
        url: section.url,
      }));
    }
  } catch (error) {
    console.error('Error initializing protocol sections:', error);
  }
}

// Initialize protocol sections when server starts
initializeProtocolSections();

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

      // Find relevant protocol sections based on user preferences
      const relevantSections = findRelevantSections({
        improvementAreas: userData.improvementAreas,
        currentHealth: userData.currentHealth,
        equipment: userData.equipment,
      });

      // Generate personalized routine based on user data
      const routine = generateRoutine(userData, relevantSections);
      console.log('Generated routine:', routine);

      // Save routine with protocol links and embedded sections
      const [savedRoutine] = await db.insert(routines).values({
        userId: user.id,
        supplements: routine.supplements,
        diet: routine.diet,
        exercise: routine.exercise,
        sleepSchedule: routine.sleepSchedule,
        metrics: routine.metrics,
        protocolLinks: routine.protocolLinks,
        embeddedSections: routine.embeddedSections,
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

function generateRoutine(userData: any, relevantSections: Map<string, string>) {
  // Find most relevant embedded sections from cached protocol data
  const embeddedSections = cachedProtocolSections
    .filter(section => {
      const userCategories = [
        ...userData.improvementAreas,
        ...userData.currentHealth,
        ...userData.equipment,
      ];

      // More sophisticated matching using categories and content relevance
      return userCategories.some(category => 
        section.categories.some((sectionCat: string) => 
          sectionCat.toLowerCase().includes(category.toLowerCase())
        ) ||
        section.content.toLowerCase().includes(category.toLowerCase())
      );
    })
    .sort((a, b) => {
      // Sort by category match count for better relevance
      const getCategoryMatchCount = (section: any) => {
        return section.categories.filter((cat: string) => 
          userData.improvementAreas.includes(cat) ||
          userData.currentHealth.includes(cat) ||
          userData.equipment.includes(cat)
        ).length;
      };
      return getCategoryMatchCount(b) - getCategoryMatchCount(a);
    })
    .slice(0, 5) // Take top 5 most relevant sections
    .map(section => ({
      title: section.title,
      content: section.content,
      url: section.url,
    }));

  const protocolLinks = {
    supplements: relevantSections.get('supplements') || `${PROTOCOL_URL}#supplements`,
    exercise: relevantSections.get('exercise') || `${PROTOCOL_URL}#exercise`,
    diet: relevantSections.get('diet') || `${PROTOCOL_URL}#perfect-diet`,
    sleep: relevantSections.get('sleep') || `${PROTOCOL_URL}#sleep`,
    testing: relevantSections.get('testing') || `${PROTOCOL_URL}#measurements`,
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
    protocolLinks,
    embeddedSections,
  };
}