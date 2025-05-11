
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { TaskDoc, TaskPriority } from "@/types/task";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Edit, Trash } from "lucide-react";
import { Button } from "./ui/button";

interface TaskCardProps {
  task: TaskDoc;
  onEdit: (task: TaskDoc) => void;
  onDelete: (id: number) => void;
}

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "Low",
  MED: "Medium",
  HIGH: "High"
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('taskId', task.id.toString());
    e.dataTransfer.setData('taskStatus', task.status);
    setIsDragging(true);
    setTimeout(() => {
      e.currentTarget.classList.add('dragging-card');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.classList.remove('dragging-card');
  };

  return (
    <Card
      className={`mb-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-grab priority-${task.priority} animate-fade-in`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start">
          <h3 className="text-md font-semibold">{task.title}</h3>
          <Badge variant={task.priority === 'HIGH' ? 'destructive' : task.priority === 'MED' ? 'default' : 'secondary'}>
            {priorityLabels[task.priority]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <p className="text-sm text-muted-foreground">
          {task.description || "No description provided"}
        </p>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-end gap-2">
        <Button variant="outline" size="icon" onClick={() => onEdit(task)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDelete(task.id)}>
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
