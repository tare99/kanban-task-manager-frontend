
import { BadRequestResponse, ErrorResponse, TaskDoc, TaskRequest, TaskStatus } from "@/types/task";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciJ9.V7VdhaU778lzNeNfcsbB_eGyJ-MJcPvNUHwS9MLJWuc";

// Helper function to add authorization header to all requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // Add authorization header to every request
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${AUTH_TOKEN}`,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

export async function fetchTasks(status?: string) {
  try {
    let url = `${API_URL}/tasks`;
    if (status) {
      url += `?status=${status}`;
    }
    
    const response = await fetchWithAuth(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("Failed to fetch tasks");
    throw error;
  }
}

export async function fetchTask(id: number): Promise<TaskDoc> {
  try {
    const response = await fetchWithAuth(`${API_URL}/tasks/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch task: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    toast.error("Failed to fetch task details");
    throw error;
  }
}

export async function createTask(task: TaskRequest): Promise<TaskDoc> {
  try {
    const response = await fetchWithAuth(`${API_URL}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        const errorData: BadRequestResponse = await response.json();
        throw errorData;
      }
      throw new Error(`Failed to create task: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error(error instanceof Error ? error.message : "Failed to create task");
    throw error;
  }
}

export async function updateTask(id: number, task: TaskRequest): Promise<TaskDoc> {
  try {
    const response = await fetchWithAuth(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        const errorData: BadRequestResponse = await response.json();
        throw errorData;
      }
      throw new Error(`Failed to update task: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    toast.error(error instanceof Error ? error.message : "Failed to update task");
    throw error;
  }
}

export async function patchTaskStatus(id: number, status: string): Promise<TaskDoc> {
  try {
    const response = await fetchWithAuth(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update task status: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating task ${id} status:`, error);
    toast.error("Failed to move task");
    throw error;
  }
}

export async function deleteTask(id: number): Promise<void> {
  try {
    const response = await fetchWithAuth(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete task: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    toast.error("Failed to delete task");
    throw error;
  }
}
