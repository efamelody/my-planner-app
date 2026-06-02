"use client"

import { useRef, useEffect, useState } from "react"
import { useProject } from "@/context/project-context"
import { cn, formatDateString, getMonthDays } from "@/lib/utils"

interface GanttTimelineProps {
  viewStart: Date
  viewEnd: Date
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

const dayWeekHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function GanttTimeline({ viewStart, viewEnd }: GanttTimelineProps) {
  const { projects, updateProjectDates } = useProject()
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    projectId: string
    mode: "move" | "resize-left" | "resize-right"
    startX: number
    initialLeft: number
    initialWidth: number
    trackWidth: number
    barEl: HTMLElement
  } | null>(null)

  const [dragCursor, setDragCursor] = useState<"grabbing" | "col-resize" | null>(null)

  useEffect(() => {
    if (dragCursor) {
      document.body.style.cursor = dragCursor
      document.body.style.userSelect = "none"
    } else {
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
    return () => {
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [dragCursor])

  const dayCount = daysBetween(viewStart, viewEnd)
  const today = new Date()
  const isMonthly = dayCount > 10
  const monthDays = isMonthly ? getMonthDays(viewStart.getFullYear(), viewStart.getMonth()) : []
  const todayOffset = daysBetween(viewStart, today)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const d = dragRef.current
      if (!d) return
      e.preventDefault()
      const deltaPx = e.clientX - d.startX
      const deltaPct = (deltaPx / d.trackWidth) * 100
      const minWidthPct = (1 / dayCount) * 100

      let newLeft: number, newWidth: number

      if (d.mode === "move") {
        newLeft = Math.max(0, Math.min(100 - d.initialWidth, d.initialLeft + deltaPct))
        newWidth = d.initialWidth
      } else if (d.mode === "resize-left") {
        newLeft = d.initialLeft + deltaPct
        newWidth = d.initialWidth - deltaPct
        if (newWidth < minWidthPct) { newWidth = minWidthPct; newLeft = d.initialLeft + d.initialWidth - minWidthPct }
        if (newLeft < 0) { newLeft = 0; newWidth = d.initialLeft + d.initialWidth }
      } else {
        newLeft = d.initialLeft
        newWidth = Math.max(minWidthPct, d.initialWidth + deltaPct)
        if (newLeft + newWidth > 100) newWidth = 100 - d.initialLeft
      }

      d.barEl.style.left = `${newLeft}%`
      d.barEl.style.width = `${newWidth}%`
    }

    const handleMouseUp = () => {
      const d = dragRef.current
      if (!d) return

      const leftPct = parseFloat(d.barEl.style.left)
      const widthPct = parseFloat(d.barEl.style.width)
      const startDay = Math.round((leftPct / 100) * dayCount)
      const endDay = startDay + Math.round((widthPct / 100) * dayCount)

      const newStart = formatDateString(new Date(viewStart.getFullYear(), viewStart.getMonth(), viewStart.getDate() + startDay))
      const newEnd = formatDateString(new Date(viewStart.getFullYear(), viewStart.getMonth(), viewStart.getDate() + endDay))

      updateProjectDates(d.projectId, newStart, newEnd)
      dragRef.current = null
      setDragCursor(null)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [dayCount, viewStart, updateProjectDates, setDragCursor])

  const startDrag = (
    e: React.MouseEvent,
    projectId: string,
    mode: "move" | "resize-left" | "resize-right",
    barEl: HTMLElement,
  ) => {
    e.preventDefault()
    const trackEl = trackRef.current
    if (!trackEl) return
    const left = parseFloat(barEl.style.left) || 0
    const width = parseFloat(barEl.style.width) || 0
    dragRef.current = {
      projectId,
      mode,
      startX: e.clientX,
      initialLeft: left,
      initialWidth: width,
      trackWidth: trackEl.clientWidth,
      barEl,
    }
    setDragCursor(mode === "move" ? "grabbing" : "col-resize")
  }

  return (
    <div className="min-w-[700px] p-4 select-none" ref={trackRef}>
      {/* Day-of-week header row */}
      <div className="grid grid-cols-7 mb-0.5">
        {dayWeekHeaders.map((label) => (
          <div key={label} className="text-center text-[10px] font-semibold text-zinc-400 py-1">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar day numbers (monthly only — 7-column grid, 6 weeks) */}
      {isMonthly && (
        <div className="grid grid-cols-7 mb-2">
          {monthDays.map((date, i) => {
            const isCurrentMonth = date.getMonth() === viewStart.getMonth()
            const isToday = formatDateString(date) === formatDateString(today)
            return (
              <div
                key={i}
                className={cn(
                  "text-center py-0.5 text-[11px]",
                  !isCurrentMonth && "text-zinc-300 dark:text-zinc-700",
                  isToday && "font-bold text-blue-600",
                  isCurrentMonth && !isToday && "text-zinc-700 dark:text-zinc-300",
                )}
              >
                {date.getDate()}
              </div>
            )
          })}
        </div>
      )}

      {/* Weekly day labels */}
      {!isMonthly && (
        <div className="grid grid-cols-7 mb-2">
          {Array.from({ length: dayCount }, (_, i) => {
            const d = new Date(viewStart)
            d.setDate(d.getDate() + i)
            const isToday = formatDateString(d) === formatDateString(today)
            return (
              <div key={i} className="text-center">
                <span className={cn(
                  "text-[11px] font-medium",
                  isToday ? "text-blue-600 font-bold" : "text-zinc-500",
                )}>
                  {d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Today indicator line */}
      {todayOffset >= 0 && todayOffset <= dayCount && (
        <div className="relative mb-1" style={{ height: 2 }}>
          <div
            className="absolute top-0 w-px h-4 bg-blue-500 opacity-60"
            style={{ left: `${(todayOffset / dayCount) * 100}%` }}
          />
        </div>
      )}

      {/* Project tracks — full width, no name column */}
      <div className="space-y-1.5">
        {projects.map((project) => {
          const projStart = new Date(project.startDate + "T00:00:00")
          const projEnd = new Date(project.endDate + "T00:00:00")
          let leftDay = daysBetween(viewStart, projStart)
          let rightDay = daysBetween(viewStart, projEnd)
          leftDay = Math.max(0, Math.min(dayCount, leftDay))
          rightDay = Math.max(leftDay + 1, Math.min(dayCount, rightDay))

          const leftPct = (leftDay / dayCount) * 100
          const widthPct = ((rightDay - leftDay) / dayCount) * 100
          const isLeftVisible = leftDay > 0
          const isRightVisible = rightDay < dayCount

          return (
            <div key={project.id} className="relative h-7 bg-zinc-100 rounded-md dark:bg-zinc-800">
              <div
                ref={(el) => {
                  if (el) {
                    el.style.left = `${leftPct}%`
                    el.style.width = `${widthPct}%`
                  }
                }}
                className="absolute top-0 h-full rounded-md cursor-grab active:cursor-grabbing select-none"
                style={{
                  backgroundColor: project.color,
                  borderTopLeftRadius: isLeftVisible ? 0 : undefined,
                  borderBottomLeftRadius: isLeftVisible ? 0 : undefined,
                  borderTopRightRadius: isRightVisible ? 0 : undefined,
                  borderBottomRightRadius: isRightVisible ? 0 : undefined,
                }}
                onMouseDown={(e) => {
                  const target = e.target as HTMLElement
                  const bar = target.closest("[data-bar]") as HTMLElement
                  if (!bar) return
                  if (target.dataset.edge === "left") startDrag(e, project.id, "resize-left", bar)
                  else if (target.dataset.edge === "right") startDrag(e, project.id, "resize-right", bar)
                  else startDrag(e, project.id, "move", bar)
                }}
                data-bar="true"
                data-project-id={project.id}
              >
                <div
                  data-edge="left"
                  className="absolute left-0 top-0 h-full w-2 cursor-col-resize z-10"
                />
                <span className="absolute inset-0 flex items-center px-2 text-[11px] font-medium text-white truncate pointer-events-none">
                  {widthPct > 8 && project.name}
                </span>
                <div
                  data-edge="right"
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize z-10"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
