import type { Task } from "@/types/task"
import { TaskCard } from "./task-card"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/store/app-store"
import { getTranslation } from "@/lib/i18n"

interface TaskColumnProps {
  title: string
  status: Task["status"]
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
}

const statusColors = {
  todo: "bg-slate-100 text-slate-800",
  "in-progress": "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
}

export function TaskColumn({ title, status, tasks, onEditTask, onDeleteTask }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  })

  const { language } = useAppStore()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <Badge variant="secondary" className={statusColors[status]}>
          {tasks.length}
        </Badge>
      </div>

      <div ref={setNodeRef} className="flex-1 space-y-3 min-h-[200px] p-2 rounded-lg bg-muted/30">
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            {getTranslation("noTasksYet", language)}
          </div>
        )}
      </div>
    </div>
  )
}
