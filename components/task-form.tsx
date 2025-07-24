"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { format } from "date-fns"
import { useAppStore } from "@/store/app-store"
import { getTranslation } from "@/lib/i18n"

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  onUpdate?: (id: string, updates: Partial<Task>) => void
  task?: Task | null
}

export function TaskForm({ isOpen, onClose, onSubmit, onUpdate, task }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<Task["status"]>("todo")
  const [priority, setPriority] = useState<Task["priority"]>("medium")
  const [labels, setLabels] = useState<string[]>([])
  const [newLabel, setNewLabel] = useState("")
  const [dueDate, setDueDate] = useState("")

  const { language } = useAppStore()

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setStatus(task.status)
      setPriority(task.priority)
      setLabels(task.labels)
      setDueDate(task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "")
    } else {
      // Reset form
      setTitle("")
      setDescription("")
      setStatus("todo")
      setPriority("medium")
      setLabels([])
      setNewLabel("")
      setDueDate("")
    }
  }, [task, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const taskData = {
      title,
      description,
      status,
      priority,
      labels,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    }

    if (task && onUpdate) {
      onUpdate(task.id, taskData)
    } else {
      onSubmit(taskData)
    }

    onClose()
  }

  const addLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()])
      setNewLabel("")
    }
  }

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter((label) => label !== labelToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addLabel()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {task ? getTranslation("editTask", language) : getTranslation("createTask", language)}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{getTranslation("title", language)}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={getTranslation("enterTaskTitle", language)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{getTranslation("description", language)}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={getTranslation("enterTaskDescription", language)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">{getTranslation("status", language)}</Label>
              <Select value={status} onValueChange={(value: Task["status"]) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">{getTranslation("todo", language)}</SelectItem>
                  <SelectItem value="in-progress">{getTranslation("inProgress", language)}</SelectItem>
                  <SelectItem value="done">{getTranslation("done", language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">{getTranslation("priority", language)}</Label>
              <Select value={priority} onValueChange={(value: Task["priority"]) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{getTranslation("low", language)}</SelectItem>
                  <SelectItem value="medium">{getTranslation("medium", language)}</SelectItem>
                  <SelectItem value="high">{getTranslation("high", language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">{getTranslation("dueDate", language)}</Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>{getTranslation("labels", language)}</Label>
            <div className="flex gap-2">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getTranslation("addLabel", language)}
              />
              <Button type="button" onClick={addLabel} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {labels.map((label) => (
                <Badge key={label} variant="secondary" className="flex items-center gap-1">
                  {label}
                  <button
                    type="button"
                    onClick={() => removeLabel(label)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {getTranslation("cancel", language)}
            </Button>
            <Button type="submit">
              {task ? getTranslation("updateTask", language) : getTranslation("createTask", language)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
