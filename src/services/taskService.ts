
import { BadRequestResponse, ErrorResponse, TaskDoc, TaskRequest, TaskStatus } from "@/types/task";
import { toast } from "sonner";

// Since we can't access localhost from the hosted environment due to CORS,
// we'll use a mock implementation instead
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciJ9.V7VdhaU778lzNeNfcsbB_eGyJ-MJcPvNUHwS9MLJWuc";

// In-memory storage for tasks
let mockTasks: TaskDoc[] = [
  {
    id: 1,
    title: "Design new landing page",
    description: "Create wireframes and mockups for the new landing page",
    status: "TO_DO",
    priority: "HIGH",
    version: 0,
    _links: {
      self: { href: "/api/tasks/1", type: "GET" },
      update: { href: "/api/tasks/1", type: "PUT" },
      patch: { href: "/api/tasks/1", type: "PATCH" },
      delete: { href: "/api/tasks/1", type: "DELETE" }
    }
  },
  {
    id: 2,
    title: "Implement user authentication",
    description: "Add login and registration functionality",
    status: "IN_PROGRESS",
    priority: "HIGH",
    version: 0,
    _links: {
      self: { href: "/api/tasks/2", type: "GET" },
      update: { href: "/api/tasks/2", type: "PUT" },
      patch: { href: "/api/tasks/2", type: "PATCH" },
      delete: { href: "/api/tasks/2", type: "DELETE" }
    }
  },
  {
    id: 3,
    title: "Write documentation",
    description: "Create user and developer documentation",
    status: "DONE",
    priority: "MED",
    version: 0,
    _links: {
      self: { href: "/api/tasks/3", type: "GET" },
      update: { href: "/api/tasks/3", type: "PUT" },
      patch: { href: "/api/tasks/3", type: "PATCH" },
      delete: { href: "/api/tasks/3", type: "DELETE" }
    }
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchTasks(status?: string) {
  try {
    // Simulate network delay
    await delay(300);
    
    // If status is provided, filter tasks by status
    const filteredTasks = status 
      ? mockTasks.filter(task => task.status === status)
      : mockTasks;
    
    return filteredTasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("Failed to fetch tasks");
    throw error;
  }
}

export async function fetchTask(id: number): Promise<TaskDoc> {
  try {
    await delay(200);
    
    const task = mockTasks.find(t => t.id === id);
    
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    return task;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    toast.error("Failed to fetch task details");
    throw error;
  }
}

export async function createTask(task: TaskRequest): Promise<TaskDoc> {
  try {
    await delay(300);
    
    // Validate required fields
    if (!task.title || !task.status || !task.priority) {
      const errors: Record<string, string> = {};
      if (!task.title) errors.title = "Title is required";
      if (!task.status) errors.status = "Status is required";
      if (!task.priority) errors.priority = "Priority is required";
      
      throw { 
        message: "Validation failed", 
        errors 
      };
    }
    
    // Create new task with auto-incremented ID
    const newId = Math.max(0, ...mockTasks.map(t => t.id)) + 1;
    
    const newTask: TaskDoc = {
      id: newId,
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      version: 0,
      _links: {
        self: { href: `/api/tasks/${newId}`, type: "GET" },
        update: { href: `/api/tasks/${newId}`, type: "PUT" },
        patch: { href: `/api/tasks/${newId}`, type: "PATCH" },
        delete: { href: `/api/tasks/${newId}`, type: "DELETE" }
      }
    };
    
    mockTasks.push(newTask);
    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error(error instanceof Error ? error.message : "Failed to create task");
    throw error;
  }
}

export async function updateTask(id: number, task: TaskRequest): Promise<TaskDoc> {
  try {
    await delay(300);
    
    const index = mockTasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    // Validate required fields
    if (!task.title || !task.status || !task.priority) {
      const errors: Record<string, string> = {};
      if (!task.title) errors.title = "Title is required";
      if (!task.status) errors.status = "Status is required";
      if (!task.priority) errors.priority = "Priority is required";
      
      throw { 
        message: "Validation failed", 
        errors 
      };
    }
    
    // Update the task
    const updatedTask: TaskDoc = {
      ...mockTasks[index],
      title: task.title,
      description: task.description || "",
      status: task.status as TaskStatus,
      priority: task.priority,
      version: mockTasks[index].version + 1
    };
    
    mockTasks[index] = updatedTask;
    return updatedTask;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    toast.error(error instanceof Error ? error.message : "Failed to update task");
    throw error;
  }
}

export async function patchTaskStatus(id: number, status: string): Promise<TaskDoc> {
  try {
    await delay(200);
    
    const index = mockTasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    // Patch the task status
    const updatedTask: TaskDoc = {
      ...mockTasks[index],
      status: status as TaskStatus,
      version: mockTasks[index].version + 1
    };
    
    mockTasks[index] = updatedTask;
    return updatedTask;
  } catch (error) {
    console.error(`Error updating task ${id} status:`, error);
    toast.error("Failed to move task");
    throw error;
  }
}

export async function deleteTask(id: number): Promise<void> {
  try {
    await delay(200);
    
    const index = mockTasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    // Remove the task from our mock data
    mockTasks = mockTasks.filter(t => t.id !== id);
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    toast.error("Failed to delete task");
    throw error;
  }
}
