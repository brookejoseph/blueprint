import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtocolCard from "@/components/protocol/protocol-card";
import MetricsDisplay from "@/components/metrics/metrics-display";
import type { RoutineData, EmbeddedSection } from "@/lib/types";

export default function Routine() {
  const { id } = useParams();

  const { data: routine, isLoading } = useQuery<RoutineData>({
    queryKey: [`/api/routines/${id}`],
  });

  if (isLoading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  if (!routine) {
    return <div className="container mx-auto p-8">Routine not found</div>;
  }

  // Find relevant embedded sections for each protocol component
  const findEmbeddedSection = (category: string): EmbeddedSection | undefined => {
    return routine.embeddedSections?.find((section: EmbeddedSection) => 
      section.title.toLowerCase().includes(category.toLowerCase()) ||
      section.content.toLowerCase().includes(category.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Personalized Protocol</h1>

        <Tabs defaultValue="protocol" className="space-y-8">
          <TabsList>
            <TabsTrigger value="protocol">Protocol</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="protocol" className="space-y-6">
            <ProtocolCard 
              title="Supplements"
              data={routine.supplements}
              embeddedSection={findEmbeddedSection('supplements')}
            />
            <ProtocolCard 
              title="Diet"
              data={routine.diet}
              embeddedSection={findEmbeddedSection('diet')}
            />
            <ProtocolCard 
              title="Exercise"
              data={routine.exercise}
              embeddedSection={findEmbeddedSection('exercise')}
            />
            <ProtocolCard 
              title="Sleep Schedule"
              data={routine.sleepSchedule}
              embeddedSection={findEmbeddedSection('sleep')}
            />
          </TabsContent>

          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle>Your Health Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricsDisplay metrics={routine.metrics} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}