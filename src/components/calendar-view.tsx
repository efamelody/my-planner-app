"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

// Complete Dummy Dataset featuring overlapping timelines to test multi-track performance
const DUMMY_PROJECTS = [
  { id: "1", title: "MRTQuest App", start: "2026-06-02", end: "2026-06-08", color: "bg-blue-500 text-white" },
  { id: "2", title: "Locus Dashboard", start: "2026-06-05", end: "2026-06-12", color: "bg-emerald-500 text-white" },
  { id: "3", title: "Pollution Model", start: "2026-06-15", end: "2026-06-20", color: "bg-amber-500 text-black" }
]

export function CalendarView() {
  const [projects, setProjects] = useState(DUMMY_PROJECTS)
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(5) // June (0-indexed)

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ]

  // Generates a robust 35-day grid mapped to exact ISO strings
  const firstDayOfMonth = new Date(year, month, 1)
  const startOffset = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1
  const gridStartDate = new Date(year, month, 1 - startOffset)
  
  const daysGrid = Array.from({ length: 35 }, (_, i) => {
    return new Date(gridStartDate.getFullYear(), gridStartDate.getMonth(), gridStartDate.getDate() + i)
  })

  const formatDateString = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  // --- NATIVE DRAG AND DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    e.dataTransfer.setData("text/plain", projectId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDrop = (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault()
    const projectId = e.dataTransfer.getData("text/plain")
    const project = projects.find(p => p.id === projectId)
    if (!project) return

    // Keep duration lock stable across relocations
    const start = new Date(project.start)
    const end = new Date(project.end)
    const durationDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    const newStart = new Date(targetDateStr)
    const newEnd = new Date(newStart)
    newEnd.setDate(newStart.getDate() + durationDays)

    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      start: formatDateString(newStart),
      end: formatDateString(newEnd)
    } : p))
  }

  // --- EDGE RESIZE ARROW HANDLERS ---
  const handleResizeEdge = (projectId: string, edge: "start" | "end", direction: "grow" | "shrink") => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p

      const currentStart = new Date(p.start)
      const currentEnd = new Date(p.end)

      if (edge === "start") {
        currentStart.setDate(currentStart.getDate() + (direction === "shrink" ? 1 : -1))
      } else {
        currentEnd.setDate(currentEnd.getDate() + (direction === "shrink" ? -1 : 1))
      }

      // Safeguard: Prevent start crossing after end date
      if (currentStart > currentEnd) return p

      return {
        ...p,
        start: formatDateString(currentStart),
        end: formatDateString(currentEnd)
      }
    }))
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 select-none">
      
      {/* Calendar Controller Header Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-1.5">
          <button 
            onClick={() => setMonth(m => m === 0 ? (setYear(y => y - 1), 11) : m - 1)} 
            className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ‹ Prev
          </button>
          <button 
            onClick={() => setMonth(m => m === 11 ? (setYear(y => y + 1), 0) : m + 1)} 
            className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Next ›
          </button>
        </div>
      </div>

      {/* Main Grid Content Area */}
      <div className="grid grid-cols-7 gap-[1px] bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        
        {/* Day Name Headers */}
        {dayLabels.map(label => (
          <div key={label} className="bg-zinc-50 py-2 text-center text-xs font-semibold text-zinc-500 dark:bg-zinc-950">
            {label}
          </div>
        ))}

        {/* 7x5 Calendar Box Generation */}
        {daysGrid.map((date, index) => {
          const dateStr = formatDateString(date)

          return (
            <div
              key={index}
              onDragOver={(e) => e.preventDefault()} // CRITICAL: Allows dropping
              onDrop={(e) => handleDrop(e, dateStr)}
              className="min-h-[110px] bg-white p-0.5 dark:bg-zinc-900 flex flex-col justify-between group relative border-r border-b border-transparent"
            >
              {/* Numeric Indicator */}
              <div className="p-1">
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                  {date.getDate()}
                </span>
              </div>

              {/* Stacked Vertical Tracks Layer Container */}
              <div className="flex-1 flex flex-col gap-1 justify-end pb-1 w-full">
                {projects.map((project, trackIndex) => {
                  const isStart = dateStr === project.start
                  const isEnd = dateStr === project.end
                  const isWithinTimeline = dateStr >= project.start && dateStr <= project.end

                  if (!isWithinTimeline) {
                    // Empty spacer row maintains parallel project stacking positions across cells
                    return <div key={`space-${project.id}-${trackIndex}`} className="h-5" />
                  }

                  return (
                    <div
                      key={project.id}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, project.id)}
                      className={cn(
                        "h-5 flex items-center justify-between text-[10px] font-medium px-1.5 cursor-grab active:cursor-grabbing transition-shadow shadow-sm select-none relative w-full",
                        project.color,
                        isStart ? "rounded-l-md pl-2" : "rounded-none border-l-0",
                        isEnd ? "rounded-r-md pr-2" : "rounded-none border-r-0"
                      )}
                    >
                      {/* Left Arrow Controls (Visible on hover at start cell) */}
                      {isStart && (
                        <div className="absolute left-0 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 bg-black/10 px-0.5 rounded-l-md">
                          <button onClick={() => handleResizeEdge(project.id, "start", "grow")} className="hover:scale-125 text-[8px]">◀</button>
                          <button onClick={() => handleResizeEdge(project.id, "start", "shrink")} className="hover:scale-125 text-[8px]">▶</button>
                        </div>
                      )}

                      {/* Legible Content Title String */}
                      <span className="truncate flex-1 text-center font-semibold">
                        {(isStart || date.getDay() === 1) && project.title}
                      </span>

                      {/* Right Arrow Controls (Visible on hover at end cell) */}
                      {isEnd && (
                        <div className="absolute right-0 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 bg-black/10 px-0.5 rounded-r-md">
                          <button onClick={() => handleResizeEdge(project.id, "end", "shrink")} className="hover:scale-125 text-[8px]">◀</button>
                          <button onClick={() => handleResizeEdge(project.id, "end", "grow")} className="hover:scale-125 text-[8px]">▶</button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}