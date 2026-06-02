"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface DailyTask {
  id: string
  title: string
  startTime: string | null // Format: "HH:00"
}

export function DailyView() {
  // 1. DUMMY DATA: Unscheduled and Scheduled Tasks for today
  const [tasks, setTasks] = useState<DailyTask[]>([
    { id: "1", title: "Write Chapter 1 Intro", startTime: "09:00" },
    { id: "2", title: "Fix Prisma Schema performance", startTime: null },
    { id: "3", title: "Review MRTQuest designs", startTime: "11:00" },
    { id: "4", title: "Clean up project repository", startTime: null },
  ])

  // Simple hours array from 08:00 (8 AM) to 17:00 (5 PM)
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  const handleAssignTime = (taskId: string, time: string | null) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, startTime: time } : t))
    // When connecting Supabase later: 
    // await supabase.from('tasks').update({ scheduled_time_start: time }).eq('id', taskId)
  }

  return (
    <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Today's Focus Blocks</h2>
        <p className="text-xs text-zinc-400">Allocate tasks to specific time slots</p>
      </div>

      {/* Hourly Timeline Grid */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {hours.map((hour) => {
          // Check if any task is assigned to this exact hour block
          const assignedTask = tasks.find(t => t.startTime === hour)

          return (
            <div key={hour} className="flex items-center gap-3 group min-h-[40px] py-1 border-b border-zinc-100 dark:border-zinc-800/50 last:border-none">
              {/* Time Prefix Label */}
              <span className="text-xs font-medium text-zinc-400 w-10 shrink-0">{hour}</span>
              
              {/* Slot Target Node */}
              <div className="flex-1 flex items-center justify-between">
                {assignedTask ? (
                  <div className="w-full flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-100 dark:border-blue-900/30">
                    <span className="truncate">{assignedTask.title}</span>
                    <button 
                      onClick={() => handleAssignTime(assignedTask.id, null)}
                      className="text-zinc-400 hover:text-red-500 font-bold ml-2 text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  /* Unallocated Dropdown Launcher Menu */
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleAssignTime(e.target.value, hour)
                      e.target.value = "" // Reset control
                    }}
                    className="w-full text-left bg-transparent text-zinc-400 text-xs py-1 px-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled>+ Block out hour...</option>
                    {tasks.filter(t => t.startTime === null).map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                    {tasks.filter(t => t.startTime === null).length === 0 && (
                      <option disabled>No tasks available to plan</option>
                    )}
                  </select>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}