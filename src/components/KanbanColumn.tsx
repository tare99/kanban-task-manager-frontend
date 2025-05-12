
import { TaskDoc, TaskStatus } from "@/types/task";
import { patchTaskStatus } from "@/services/taskService";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: TaskDoc[];
  onEdit: (task: TaskDoc) => void;
  onDelete: (id: number) => void;
  onTaskMoved: () => void;
  count: number;
}

export function KanbanColumn({ 
  title, 
  status, 
  tasks, 
  onEdit, 
  onDelete, 
  onTaskMoved,
  count
}: KanbanColumnProps) {
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-secondary/50");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("bg-secondary/50");
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-secondary/50");
    
    const taskId = e.dataTransfer.getData("taskId");
    const currentStatus = e.dataTransfer.getData("taskStatus");
    const version = e.dataTransfer.getData("version");

    // Don't do anything if dropping back to the same column
    if (currentStatus === status) return;
    
    try {
      await patchTaskStatus(parseInt(taskId), status, parseInt(version));
      onTaskMoved();
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };

  const columnColorClasses: Record<TaskStatus, string> = {
    "TO_DO": "bg-kanban-purple-light border-kanban-purple",
    "IN_PROGRESS": "bg-kanban-priority-med border-orange-400",
    "DONE": "bg-green-50 border-green-400"
  };

  return (
    <div className="flex flex-col kanban-column">
      <div className="flex justify-between items-center mb-4">
        <h2 className="kanban-column-header text-kanban-purple-dark">{title}</h2>
        <Badge variant="secondary" className="text-sm">{count}</Badge>
      </div>
      
      <div
        className={cn(
          "p-3 rounded-md flex-1 transition-colors duration-200 border-t-2",
          columnColorClasses[status]
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center p-4 border border-dashed rounded-md bg-background/80">
            <p className="text-sm text-muted-foreground">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
