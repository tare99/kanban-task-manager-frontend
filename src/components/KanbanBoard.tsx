import { useEffect, useState } from "react";
import { TaskDoc, TaskRequest, TaskStatus } from "@/types/task";
import { createTask, deleteTask, fetchTasks, updateTask } from "@/services/taskService";
import { KanbanColumn } from "./KanbanColumn";
import { TaskDialog } from "./TaskDialog";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function KanbanBoard() {
  const [tasks, setTasks] = useState<TaskDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskDoc | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAllTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchTasks();
      
      // Handle both possible response formats from the API
      if (response._embedded && response._embedded.taskList) {
        setTasks(response._embedded.taskList);
      } else if (response._embedded && response._embedded.tasks) {
        setTasks(response._embedded.tasks);
      } else if (Array.isArray(response)) {
        setTasks(response);
      } else {
        console.warn("Unexpected response format:", response);
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch tasks");
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleCreateTask = async (taskData: TaskRequest) => {
    try {
      await createTask(taskData);
      toast.success("Task created successfully");
      fetchAllTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async (taskData: TaskRequest) => {
    if (!currentTask) return;
    
    try {
      await updateTask(currentTask.id, taskData);
      toast.success("Task updated successfully");
      fetchAllTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleSaveTask = async (taskData: TaskRequest) => {
    if (currentTask) {
      await handleUpdateTask(taskData);
    } else {
      await handleCreateTask(taskData);
    }
  };

  const handleEditTask = (task: TaskDoc) => {
    setCurrentTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setTaskToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete === null) return;
    
    try {
      await deleteTask(taskToDelete);
      toast.success("Task deleted successfully");
      fetchAllTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleCloseTaskDialog = () => {
    setIsTaskDialogOpen(false);
    setCurrentTask(undefined);
  };

  const filterTasksByStatus = (status: TaskStatus): TaskDoc[] => {
    return tasks.filter(task => task.status === status);
  };

  const todoTasks = filterTasksByStatus("TO_DO");
  const inProgressTasks = filterTasksByStatus("IN_PROGRESS");
  const doneTasks = filterTasksByStatus("DONE");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="animate-pulse text-kanban-purple">Loading Kanban board...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-4">
          <div className="text-red-500 font-semibold">{error}</div>
          <Button 
            onClick={fetchAllTasks}
            className="bg-kanban-purple hover:bg-kanban-purple-dark"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-kanban-purple-dark">Kanban Board {tasks.length > 0 ? `(${tasks.length} tasks)` : ''}</h1>
        <Button 
          className="bg-kanban-purple hover:bg-kanban-purple-dark"
          onClick={() => {
            setCurrentTask(undefined);
            setIsTaskDialogOpen(true);
          }}
        >
          <Plus className="mr-1 h-4 w-4" /> New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KanbanColumn
          title="To Do"
          status="TO_DO"
          tasks={todoTasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteClick}
          onTaskMoved={fetchAllTasks}
          count={todoTasks.length}
        />
        
        <KanbanColumn
          title="In Progress"
          status="IN_PROGRESS"
          tasks={inProgressTasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteClick}
          onTaskMoved={fetchAllTasks}
          count={inProgressTasks.length}
        />
        
        <KanbanColumn
          title="Done"
          status="DONE"
          tasks={doneTasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteClick}
          onTaskMoved={fetchAllTasks}
          count={doneTasks.length}
        />
      </div>
      
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={handleCloseTaskDialog}
        onSave={handleSaveTask}
        task={currentTask}
      />
      
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
}