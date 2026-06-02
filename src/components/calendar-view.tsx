"use client"

import { useState, useCallback } from "react"
import { DndContext, DragEndEvent, useSensor, PointerSensor, useSensors } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { useProject } from "@/context/project-context"
import { GanttTimeline } from "./calendar/gantt-timeline"
import { DailyView } from "./calendar/daily-view"

type ViewMode = "daily" | "weekly" | "monthly"

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export function CalendarView() {
  const today = new Date()
  const [view, setView] = useState<ViewMode>("monthly")
  const [baseDate, setBaseDate] = useState(today)
  const { updateTaskSchedule } = useProject()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const goPrev = useCallback(() => {
    setBaseDate((d) => {
      const next = new Date(d)
      if (view === "daily") next.setDate(next.getDate() - 1)
      else if (view === "weekly") next.setDate(next.getDate() - 7)
      else next.setMonth(next.getMonth() - 1)
      return next
    })
  }, [view])

  const goNext = useCallback(() => {
    setBaseDate((d) => {
      const next = new Date(d)
      if (view === "daily") next.setDate(next.getDate() + 1)
      else if (view === "weekly") next.setDate(next.getDate() + 7)
      else next.setMonth(next.getMonth() + 1)
      return next
    })
  }, [view])

  const goToday = () => setBaseDate(new Date())

  const getViewRange = () => {
    if (view === "monthly") {
      const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
      const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0)
      return { start, end }
    }
    if (view === "weekly") {
      const d = new Date(baseDate)
      const day = d.getDay()
      const diff = day === 0 ? -6 : 1 - day
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff)
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      return { start, end }
    }
    return { start: baseDate, end: baseDate }
  }

  const headerLabel = (() => {
    if (view === "daily") {
      return baseDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    }
    if (view === "weekly") {
      const { start, end } = getViewRange()
      const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      return `${fmt(start)} – ${fmt(end)}`
    }
    return `${monthNames[baseDate.getMonth()]} ${baseDate.getFullYear()}`
  })()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const activeData = active.data.current
    const overData = over.data.current
    if (activeData?.type === "task" && overData?.type === "time-slot") {
      const startTime = `${String(overData.hour).padStart(2, "0")}:00`
      const endTime = `${String(overData.hour + 1).padStart(2, "0")}:00`
      updateTaskSchedule(activeData.taskId, overData.date, startTime, endTime)
    }
  }

  const tabs: { key: ViewMode; label: string }[] = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
  ]

  const { start: rangeStart, end: rangeEnd } = getViewRange()

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="w-full rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {headerLabel}
          </h2>

          {/* View switcher */}
          <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setView(tab.key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  view === tab.key
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            <button onClick={goPrev} className="rounded-lg border p-1.5 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-800">‹</button>
            <button onClick={goToday} className="rounded-lg border p-1.5 px-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800">Today</button>
            <button onClick={goNext} className="rounded-lg border p-1.5 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-800">›</button>
          </div>
        </div>

        {/* View content */}
        <div className="overflow-x-auto">
          {view === "daily" && <DailyView baseDate={baseDate} />}
          {view !== "daily" && (
            <GanttTimeline viewStart={rangeStart} viewEnd={rangeEnd} />
          )}
        </div>
      </div>
    </DndContext>
  )
}
