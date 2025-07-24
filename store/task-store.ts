import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task, TaskStore } from "@/types/task"

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))
      },
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task)),
        }))
      },
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },
      moveTask: (id, newStatus) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status: newStatus, updatedAt: new Date() } : task,
          ),
        }))
      },
    }),
    {
      name: "taskforge-storage",
    },
  ),
)
