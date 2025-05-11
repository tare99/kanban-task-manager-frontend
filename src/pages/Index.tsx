
import { KanbanBoard } from "@/components/KanbanBoard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <Alert className="mb-6 bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          Using mock API due to CORS restrictions with localhost backend.
        </AlertDescription>
      </Alert>
      <KanbanBoard />
    </div>
  );
};

export default Index;
