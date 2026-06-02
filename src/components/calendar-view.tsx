"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useProject } from "@/context/project-context"

//TO DO: MAKE IT CONNECT TO GOOGLE CALENDAR
export function CalendarView() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  // Helper arrays
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ]

  // Get a solid grid of Date objects
  const firstDayOfMonth = new Date(year, month, 1)
  const startOffset = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1
  const gridStartDate = new Date(year, month, 1 - startOffset)
  
  const daysGrid = Array.from({ length: 35 }, (_, i) => {
    return new Date(gridStartDate.getFullYear(), gridStartDate.getMonth(), gridStartDate.getDate() + i)
  })

  // Mocked/Context projects with durations matching your requirements
  // In a real setup, pull this from your useProject context!
  const targetProjects = [
    { id: "1", title: "Main Milestone", start: "2026-06-02", end: "2026-06-07", color: "bg-red-400 text-red-950" },
    { id: "2", title: "Side Project", start: "2026-06-08", end: "2026-06-10", color: "bg-orange-300 text-orange-950" },
    { id: "3", title: "2026 Malay", start: "2026-06-10", end: "2026-06-14", color: "bg-purple-200 text-purple-950" }
  ]

  const prevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11) }
    else setMonth((m) => m - 1)
  }

  const nextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0) }
    else setMonth((m) => m + 1)
  }

  const formatDateString = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="rounded-lg border p-1.5 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-800">‹</button>
          <button onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()) }} className="rounded-lg border p-1.5 px-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800">Today</button>
          <button onClick={nextMonth} className="rounded-lg border p-1.5 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-800">›</button>
        </div>
      </div>

      {/* Weekday Label Bar */}
      <div className="grid grid-cols-7 border-b border-zinc-200 text-center text-xs font-semibold text-zinc-500 dark:border-zinc-800">
        {dayLabels.map((label) => (
          <div key={label} className="py-2 border-r border-zinc-100 last:border-none dark:border-zinc-800/50">
            {label}
          </div>
        ))}
      </div>

      {/* The Core 7x5 Calendar Box Grid */}
      <div className="grid grid-cols-7 bg-zinc-200 dark:bg-zinc-800 gap-[1px]">
        {daysGrid.map((date, idx) => {
          const dateStr = formatDateString(date)
          const isCurrentMonth = date.getMonth() === month
          const isToday = formatDateString(today) === dateStr

          // Filter projects active on this specific calendar day
          const activeBlocks = targetProjects.filter(p => dateStr >= p.start && dateStr <= p.end)

          return (
            <div 
              key={idx} 
              className={cn(
                "min-h-[110px] bg-white p-1 dark:bg-zinc-900 flex flex-col justify-between transition-colors",
                !isCurrentMonth && "bg-zinc-50/50 text-zinc-400 dark:bg-zinc-950/40"
              )}
            >
              {/* Day Number Label Indicator */}
              <div className="flex justify-between items-center p-1">
                <span 
                  className={cn(
                    "text-xs font-medium flex h-6 w-6 items-center justify-center rounded-full",
                    isToday ? "bg-blue-600 text-white font-bold" : "text-zinc-700 dark:text-zinc-300"
                  )}
                >
                  {date.getDate() === 1 ? `${date.getDate()} ${monthNames[date.getMonth()].slice(0,3)}` : date.getDate()}
                </span>
              </div>

              {/* Project Gantt Timeline Content Node Container */}
              <div className="flex-1 flex flex-col gap-1 justify-end pb-1 overflow-hidden">
                {activeBlocks.map((project) => {
                  const isStart = dateStr === project.start
                  const isEnd = dateStr === project.end

                  return (
                    <div
                      key={project.id}
                      className={cn(
                        "text-[10px] px-2 py-0.5 truncate font-medium z-10",
                        project.color,
                        isStart && "rounded-l-md mx-0.5",
                        isEnd && "rounded-r-md mx-0.5",
                        !isStart && !isEnd && "rounded-none"
                      )}
                    >
                      {/* Show title on start date or on Mondays so it stays legible */}
                      {(isStart || date.getDay() === 1) && project.title}
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