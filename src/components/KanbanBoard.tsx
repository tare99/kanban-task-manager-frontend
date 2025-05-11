import React, {useEffect, useState} from 'react';
import {connectWebSocket, disconnectWebSocket} from '@/services/webSocketService';
import {TaskDoc, TaskRequest} from '@/types/task';
import {
  createTask,
  deleteTask,
  fetchTasks,
  patchTaskStatus,
  updateTask
} from '@/services/taskService';
import {toast} from 'sonner';

export function KanbanBoard() {
  const [tasks, setTasks] = useState<TaskDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // WebSocket message handler
  const handleWebSocketMessage = (message: any) => {
    if (message.type === 'PATCHED') {
      setTasks((prevTasks) =>
          prevTasks.map((task) =>
              task.id === message.payload.id ? {...task, ...message.payload} : task
          )
      );
    } else if (message.type === 'CREATED') {
      setTasks((prevTasks) => [...prevTasks, message.payload]);
    } else if (message.type === 'DELETED') {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== message.payload.id));
    }
  };

  const fetchAllTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetchTasks();
      setTasks(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData: TaskRequest) => {
    try {
      const newTask = await createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, newTask]);
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (id: number, taskData: TaskRequest) => {
    try {
      const updatedTask = await updateTask(id, taskData);
      setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handlePatchTaskStatus = async (id: number, status: string) => {
    try {
      const updatedTask = await patchTaskStatus(id, status);
      setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Error patching task status:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    fetchAllTasks();

    // Connect WebSocket
    connectWebSocket(handleWebSocketMessage);

    return () => {
      // Disconnect WebSocket
      disconnectWebSocket();
    };
  }, []);

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
      <div>
        {tasks.map((task) => (
            <div key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <button onClick={() => handlePatchTaskStatus(task.id, 'DONE')}>Mark as Done</button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
        ))}
      </div>
  );
}