import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProtocolCardProps {
  title: string;
  data: any;
}

export default function ProtocolCard({ title, data }: ProtocolCardProps) {
  const renderContent = () => {
    if (Array.isArray(data)) {
      return (
        <ul className="space-y-2">
          {data.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>{typeof item === 'string' ? item : item.name}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-600">{key}:</span>
            <span className="font-medium">{String(value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
