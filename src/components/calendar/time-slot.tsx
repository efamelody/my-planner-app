"use client"

import { useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"

interface TimeSlotProps {
  date: string
  hour: number
  children?: React.ReactNode
}

export function TimeSlot({ date, hour, children }: TimeSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `time-slot-${date}-${hour}`,
    data: { type: "time-slot", date, hour },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[56px] border-b border-zinc-100 dark:border-zinc-800 px-3 py-1 transition-colors",
        isOver && "bg-blue-50 dark:bg-blue-950/30",
      )}
    >
      {children}
    </div>
  )
}
