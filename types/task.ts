export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  labels: string[]
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface TaskStore {
  tasks: Task[]
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, newStatus: Task["status"]) => void
}
