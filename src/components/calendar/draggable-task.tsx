"use client"

import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { Task } from "@/types"

interface DraggableTaskProps {
  task: Task
  variant?: "pool" | "scheduled"
}

const projectColors: Record<string, string> = {
  p1: "#3b82f6",
  p2: "#10b981",
  p3: "#f59e0b",
}

export function DraggableTask({ task, variant = "pool" }: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `task-${task.id}`,
    data: { type: "task", taskId: task.id, projectId: task.projectId },
    disabled: task.completed,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 }
    : undefined

  const bgColor = projectColors[task.projectId] || "#6b7280"

  if (variant === "scheduled") {
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={cn(
          "rounded-md px-2 py-1 text-xs font-medium text-white cursor-grab active:cursor-grabbing truncate",
          isDragging && "opacity-50",
          task.completed && "opacity-50 line-through cursor-default",
        )}
        style={{ ...style, backgroundColor: bgColor }}
      >
        {task.title}
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow dark:border-zinc-700 dark:bg-zinc-800",
        isDragging && "opacity-50 shadow-lg",
        task.completed && "opacity-50 line-through cursor-default",
      )}
      style={style}
    >
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: bgColor }} />
        <span className="truncate text-zinc-800 dark:text-zinc-200">{task.title}</span>
      </div>
    </div>
  )
}
