"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"

// 1. REUSED DATA SCHEMA: Syncs perfectly with your workspace timeline data
const DUMMY_PROJECTS = [
  { id: "1", title: "MRTQuest App", start: "2026-06-02", end: "2026-06-08", color: "bg-blue-500" },
  { id: "2", title: "Locus Dashboard", start: "2026-06-05", end: "2026-06-15", color: "bg-emerald-500" },
  { id: "3", title: "Pollution Model", start: "2026-06-12", end: "2026-06-22", color: "bg-amber-500" },
  { id: "4", title: "Personal Website", start: "2026-06-18", end: "2026-06-28", color: "bg-purple-500" }
]

export function GanttChart() {
  const [projects] = useState(DUMMY_PROJECTS)

  // 2. TIMELINE CALCULATOR: Auto-detects bounds so your chart scales perfectly
  const { timelineDates, minTime, totalDurationDays } = useMemo(() => {
    if (projects.length === 0) return { timelineDates: [], minTime: 0, totalDurationDays: 1 }

    // Parse all dates to timestamps
    const timestamps = projects.flatMap(p => [new Date(p.start).getTime(), new Date(p.end).getTime()])
    const minTimestamp = Math.min(...timestamps)
    const maxTimestamp = Math.max(...timestamps)

    const minDate = new Date(minTimestamp)
    const maxDate = new Date(maxTimestamp)

    // Generate daily date objects sequentially from min bounds to max bounds
    const datesArray: Date[] = []
    let currentIter = new Date(minDate)
    while (currentIter <= maxDate) {
      datesArray.push(new Date(currentIter))
      currentIter.setDate(currentIter.getDate() + 1)
    }

    const duration = Math.round((maxTimestamp - minTimestamp) / (1000 * 60 * 60 * 24)) + 1

    return {
      timelineDates: datesArray,
      minTime: minTimestamp,
      totalDurationDays: duration
    }
  }, [projects])

  // Helper calculation function mapping absolute placements inside row boxes
  const getPositionStyles = (startStr: string, endStr: string) => {
    const startMs = new Date(startStr).getTime()
    const endMs = new Date(endStr).getTime()

    // Calculate daily tracking steps relative to chart origin bounds
    const leftDays = Math.round((startMs - minTime) / (1000 * 60 * 60 * 24))
    const barDays = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1

    const leftPercent = (leftDays / totalDurationDays) * 100
    const widthPercent = (barDays / totalDurationDays) * 100

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 select-none">
      <div className="mb-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Project Roadmap Matrix</h2>
        <p className="text-xs text-zinc-400">Overall linear schedule view of your ongoing tasks and milestones</p>
      </div>

      {/* Outer Scroll Container for horizontal sizing flexibility */}
      <div className="overflow-x-auto rounded-lg border border-zinc-100 dark:border-zinc-800/60">
        <div className="min-w-[760px] divide-y divide-zinc-100 dark:divide-zinc-800/40">
          
          {/* THE HEADER AXIS ROW: Renders active tracking dates line */}
          <div className="flex bg-zinc-50 dark:bg-zinc-950 text-center py-2">
            <div className="w-48 text-left pl-4 text-xs font-bold text-zinc-400 uppercase tracking-wider self-center">
              Project Title
            </div>
            <div className="flex-1 relative grid" style={{ gridTemplateColumns: `repeat(${timelineDates.length}, minmax(0, 1fr))` }}>
              {timelineDates.map((date, idx) => (
                <div key={idx} className="text-[10px] font-semibold text-zinc-400 border-l border-zinc-200/40 dark:border-zinc-800/30 first:border-none py-1">
                  <div className="uppercase tracking-tighter opacity-60">
                    {date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1)}
                  </div>
                  <div className="text-zinc-700 dark:text-zinc-300 font-bold mt-0.5">
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* THE DATA ROWS MAPPING AREA */}
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/40 bg-white dark:bg-zinc-900">
            {projects.map((project) => {
              const position = getPositionStyles(project.start, project.end)

              return (
                <div key={project.id} className="flex h-14 items-center group hover:bg-zinc-50/40 dark:hover:bg-zinc-950/20 transition-colors">
                  {/* Left Label Pane */}
                  <div className="w-48 text-sm font-semibold text-zinc-800 dark:text-zinc-200 pl-4 truncate pr-2">
                    {project.title}
                  </div>

                  {/* Right Track Window Layout Canvas */}
                  <div className="flex-1 h-full relative flex items-center pr-2">
                    {/* Underlying Grid Background Striping Guideline Matrix Markers */}
                    <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateColumns: `repeat(${timelineDates.length}, minmax(0, 1fr))` }}>
                      {timelineDates.map((_, gridIdx) => (
                        <div key={gridIdx} className="border-l border-zinc-100 dark:border-zinc-800/30 first:border-none h-full" />
                      ))}
                    </div>

                    {/* Fluid absolute Gantt block position node pill */}
                    <div
                      style={{ left: position.left, width: position.width }}
                      className={cn(
                        "absolute h-7 rounded-lg shadow-sm px-3 flex items-center text-[11px] font-bold text-white transition-all transform group-hover:scale-[1.01] animate-in fade-in duration-300",
                        project.color
                      )}
                    >
                      <span className="truncate drop-shadow-sm">{project.title}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}