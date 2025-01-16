import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import type { MetricsConfig } from "@/lib/types";

interface MetricsDisplayProps {
  metrics: MetricsConfig;
}

export default function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  const sampleData = [
    { name: "Day 1", value: 65 },
    { name: "Day 2", value: 64.8 },
    { name: "Day 3", value: 64.6 },
    { name: "Day 4", value: 64.2 },
    { name: "Day 5", value: 64 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weight Tracking</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
