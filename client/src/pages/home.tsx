import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Questionnaire from "@/components/forms/questionnaire";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Blueprint Health Protocol
            </h1>
            <p className="text-gray-600">
              Create your personalized health routine in minutes
            </p>
          </div>

          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle>Start Your Journey</CardTitle>
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