import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Questionnaire from "@/components/forms/questionnaire";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Personalized Health Protocol
            </h1>
            <p className="text-gray-600 text-lg">
              Build your personalized health routine based on Bryan Johnson's protocol
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="p-6">
                <img
                  src="https://images.unsplash.com/photo-1493770348161-369560ae357d"
                  alt="Healthy Lifestyle"
                  className="rounded-lg w-full h-48 object-cover"
                />
                <h2 className="text-xl font-semibold mt-4">Optimize Your Health</h2>
                <p className="text-gray-600 mt-2">
                  Get a personalized routine based on proven protocols and your specific needs.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="p-6">
                <img
                  src="https://images.unsplash.com/photo-1445384763658-0400939829cd"
                  alt="Wellness Routine"
                  className="rounded-lg w-full h-48 object-cover"
                />
                <h2 className="text-xl font-semibold mt-4">Track Your Progress</h2>
                <p className="text-gray-600 mt-2">
                  Monitor your health metrics and adjust your routine for optimal results.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle>Create Your Personal Protocol</CardTitle>
            </CardHeader>
            <CardContent>
              <Questionnaire />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
