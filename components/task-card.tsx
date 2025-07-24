"use client"

import type { Task } from "@/types/task"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Flag, MoreHorizontal, Trash2, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useAppStore } from "@/store/app-store"
import { getTranslation } from "@/lib/i18n"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
}

const priorityIcons = {
  low: <Flag className="w-3 h-3" />,
  medium: <Flag className="w-3 h-3" />,
  high: <Flag className="w-3 h-3" />,
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const { language } = useAppStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? "shadow-lg" : ""
      } ${isOverdue ? "border-red-300" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm leading-tight">{task.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="w-4 h-4" />
                <span className="sr-only">{getTranslation("openMenu", language)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="w-4 h-4 mr-2" />
                {getTranslation("edit", language)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                {getTranslation("delete", language)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {task.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>}

        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.map((label) => (
            <Badge key={label} variant="secondary" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
              {priorityIcons[task.priority]}
              <span className="ml-1 capitalize">{getTranslation(task.priority, language)}</span>
            </Badge>
          </div>

          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
              {isOverdue ? <Clock className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
              <span>{format(new Date(task.dueDate), "MMM dd")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
