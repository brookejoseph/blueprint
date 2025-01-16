import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  weight: integer("weight"),
  height: integer("height"),
  gender: text("gender").notNull(),
  improvementAreas: json("improvement_areas").notNull(),
  budget: text("budget").notNull(),
  equipment: json("equipment").notNull(),
  currentHealth: json("current_health").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const protocolSections = pgTable("protocol_sections", {
  id: serial("id").primaryKey(),
  sectionId: text("section_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  categories: json("categories").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const routines = pgTable("routines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  supplements: json("supplements").notNull(),
  diet: json("diet").notNull(),
  exercise: json("exercise").notNull(),
  sleepSchedule: json("sleep_schedule").notNull(),
  metrics: json("metrics").notNull(),
  protocolLinks: json("protocol_links").notNull(),
  embeddedSections: json("embedded_sections").default('[]').notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  date: timestamp("date").notNull(),
  weight: integer("weight"),
  sleepHours: integer("sleep_hours"),
  steps: integer("steps"),
  supplements: json("supplements"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type ProtocolSection = typeof protocolSections.$inferSelect;
export type Routine = typeof routines.$inferSelect;
export type Metric = typeof metrics.$inferSelect;