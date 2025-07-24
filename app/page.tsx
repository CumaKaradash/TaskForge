"use client"

import { useState } from "react"
import { useTaskStore } from "@/store/task-store"
import { TaskColumn } from "@/components/task-column"
import { TaskForm } from "@/components/task-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter } from "lucide-react"
import type { Task } from "@/types/task"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { TaskCard } from "@/components/task-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/store/app-store"
import { getTranslation } from "@/lib/i18n"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"

export default function TaskForge() {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useTaskStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [activeId, setActiveId] = useState<string | null>(null)
  const { language } = useAppStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  // Filter tasks based on search and priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.labels.some((label) => label.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesPriority
  })

  const todoTasks = filteredTasks.filter((task) => task.status === "todo")
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in-progress")
  const doneTasks = filteredTasks.filter((task) => task.status === "done")

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as Task["status"]

    const task = tasks.find((t) => t.id === taskId)
    if (task && task.status !== newStatus) {
      moveTask(taskId, newStatus)
    }

    setActiveId(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const activeTask = activeId ? tasks.find((task) => task.id === activeId) : null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{getTranslation("title", language)}</h1>
              <p className="text-muted-foreground">{getTranslation("subtitle", language)}</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSelector />
              <Button onClick={() => setIsFormOpen(true)} className="w-fit">
                <Plus className="w-4 h-4 mr-2" />
                {getTranslation("newTask", language)}
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={getTranslation("searchTasks", language)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{getTranslation("allPriority", language)}</SelectItem>
                  <SelectItem value="high">{getTranslation("high", language)}</SelectItem>
                  <SelectItem value="medium">{getTranslation("medium", language)}</SelectItem>
                  <SelectItem value="low">{getTranslation("low", language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Task Board */}
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskColumn
              title={getTranslation("todo", language)}
              status="todo"
              tasks={todoTasks}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
            />
            <TaskColumn
              title={getTranslation("inProgress", language)}
              status="in-progress"
              tasks={inProgressTasks}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
            />
            <TaskColumn
              title={getTranslation("done", language)}
              status="done"
              tasks={doneTasks}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
            />
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} /> : null}
          </DragOverlay>
        </DndContext>

        {/* Task Form */}
        <TaskForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={addTask}
          onUpdate={updateTask}
          task={editingTask}
        />
      </div>
    </div>
  )
}
