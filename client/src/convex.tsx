import { ConvexProvider, ConvexReactClient } from "convex/react";
import React, { ReactNode } from "react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is not defined. Please set it in your .env file.");
}

export const convex = new ConvexReactClient(convexUrl);

// Wrapper component to provide Convex context
interface ConvexProviderWrapperProps {
  children: ReactNode;
}

export function ConvexProviderWrapper({ children }: ConvexProviderWrapperProps) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}