"use client"

import { useProjectTasks } from "@/context/project-context"
import { DraggableTask } from "./draggable-task"
import { TimeSlot } from "./time-slot"
import { formatDateString, formatTime } from "@/lib/utils"

interface DailyViewProps {
  baseDate: Date
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8)

export function DailyView({ baseDate }: DailyViewProps) {
  const allTasks = useProjectTasks()
  const dateStr = formatDateString(baseDate)
  const today = new Date()
  const isToday = formatDateString(today) === dateStr

  const scheduledTasks = allTasks.filter(
    (t) => t.scheduledDate === dateStr && !t.completed,
  )
  const unscheduledTasks = allTasks.filter(
    (t) => (!t.scheduledDate || t.scheduledDate !== dateStr) && !t.completed,
  )

  const getTasksForHour = (hour: number) => {
    const hh = String(hour).padStart(2, "0")
    return scheduledTasks.filter((t) => t.startTime?.startsWith(hh))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Unscheduled task pool */}
      {unscheduledTasks.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Unscheduled Tasks — drag into a time slot
          </h4>
          <div className="flex flex-wrap gap-2">
            {unscheduledTasks.map((task) => (
              <DraggableTask key={task.id} task={task} variant="pool" />
            ))}
          </div>
        </div>
      )}

      {/* Hourly time grid */}
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {/* Day header */}
        <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {baseDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            {isToday && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                Today
              </span>
            )}
          </h3>
        </div>

        {/* Time slots */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {HOURS.map((hour) => {
            const tasksInSlot = getTasksForHour(hour)
            return (
              <div key={hour} className="flex">
                <div className="w-16 shrink-0 py-3 pl-3 pr-2 text-right text-xs text-zinc-400">
                  {formatTime(hour)}
                </div>
                <div className="flex-1">
                  <TimeSlot date={dateStr} hour={hour}>
                    {tasksInSlot.length > 0 && (
                      <div className="flex flex-col gap-1">
                        {tasksInSlot.map((task) => (
                          <DraggableTask key={task.id} task={task} variant="scheduled" />
                        ))}
                      </div>
                    )}
                  </TimeSlot>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
