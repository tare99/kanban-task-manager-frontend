
import { BadRequestResponse, ErrorResponse, TaskDoc, TaskRequest } from "@/types/task";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api/tasks";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciJ9.V7VdhaU778lzNeNfcsbB_eGyJ-MJcPvNUHwS9MLJWuc";

// Helper function to add authorization headers to fetch requests
const fetchWithAuth = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${AUTH_TOKEN}`
    }
  });
};

export async function fetchTasks(status?: string) {
  try {
    const url = status ? `${API_URL}?status=${status}` : API_URL;
    const response = await fetchWithAuth(url);
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(errorData.message || "Failed to fetch tasks");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("Failed to fetch tasks");
    throw error;
  }
}

export async function fetchTask(id: number): Promise<TaskDoc> {
  try {
    const response = await fetchWithAuth(`${API_URL}/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(errorData.message || "Failed to fetch task");
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    toast.error("Failed to fetch task details");
    throw error;
  }
}

export async function createTask(task: TaskRequest): Promise<TaskDoc> {
  try {
    const response = await fetchWithAuth(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    
    if (response.status === 400) {
      const badRequestData = await response.json() as BadRequestResponse;
      const errorMessage = Object.values(badRequestData.errors || {}).join(", ") || badRequestData.message;
      throw new Error(errorMessage);
    }
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(errorData.message || "Failed to create task");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error(error instanceof Error ? error.message : "Failed to create task");
    throw error;
  }
}

export async function updateTask(id: number, task: TaskRequest): Promise<TaskDoc> {
  try {
    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    
    if (response.status === 400) {
      const badRequestData = await response.json() as BadRequestResponse;
      const errorMessage = Object.values(badRequestData.errors || {}).join(", ") || badRequestData.message;
      throw new Error(errorMessage);
    }
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(errorData.message || "Failed to update task");
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    toast.error(error instanceof Error ? error.message : "Failed to update task");
    throw error;
  }
}

export async function patchTaskStatus(id: number, status: string): Promise<TaskDoc> {
  try {
    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(errorData.message || "Failed to update task status");
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating task ${id} status:`, error);
    toast.error("Failed to move task");
    throw error;
  }
}

export async function deleteTask(id: number): Promise<void> {
  try {
    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(errorData.message || "Failed to delete task");
    }
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    toast.error("Failed to delete task");
    throw error;
  }
}
