import { KanbanBoard } from "@/components/KanbanBoard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Connected to backend API at http://localhost:8080/api. Make sure the backend server is running to see tasks.
        </AlertDescription>
      </Alert>
      <KanbanBoard />
    </div>
  );
};

export default Index;