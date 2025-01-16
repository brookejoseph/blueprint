import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { EmbeddedSection } from "@/lib/types";

interface ProtocolCardProps {
  title: string;
  data: any; // This remains any since it can be different types based on the protocol section
  embeddedSection?: EmbeddedSection;
}

export default function ProtocolCard({ title, data, embeddedSection }: ProtocolCardProps) {
  const handleProtocolLink = (url: string) => {
    window.open(url, '_blank')?.focus();
  };

  const renderContent = () => {
    if (Array.isArray(data)) {
      return (
        <div className="space-y-4">
          <ul className="space-y-2">
            {data.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>{typeof item === 'string' ? item : item.name}</span>
                {item.dosage && <span className="text-gray-600">({item.dosage})</span>}
                {item.timing && <span className="text-gray-600">- {item.timing}</span>}
              </li>
            ))}
          </ul>
          {embeddedSection && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-semibold mb-2">{embeddedSection.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{embeddedSection.content}</p>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full flex items-center justify-center gap-2 text-blue-600"
                onClick={() => handleProtocolLink(embeddedSection.url)}
              >
                <ExternalLink className="h-4 w-4" />
                View Full Details
              </Button>
            </div>
          )}
          {data[0]?.reference && (
            <Button 
              variant="outline" 
              size="sm"
              className="w-full flex items-center justify-center gap-2 text-blue-600"
              onClick={() => handleProtocolLink(data[0].reference)}
            >
              <ExternalLink className="h-4 w-4" />
              View Full Protocol Details
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {Object.entries(data).map(([key, value]) => {
            if (key === 'reference') return null;
            return (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600">{key}:</span>
                <span className="font-medium">{String(value)}</span>
              </div>
            );
          })}
        </div>
        {embeddedSection && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold mb-2">{embeddedSection.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{embeddedSection.content}</p>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full flex items-center justify-center gap-2 text-blue-600"
              onClick={() => handleProtocolLink(embeddedSection.url)}
            >
              <ExternalLink className="h-4 w-4" />
              View Full Details
            </Button>
          </div>
        )}
        {data.reference && (
          <Button 
            variant="outline" 
            size="sm"
            className="w-full flex items-center justify-center gap-2 text-blue-600"
            onClick={() => handleProtocolLink(data.reference)}
          >
            <ExternalLink className="h-4 w-4" />
            View Full Protocol Details
          </Button>
        )}
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