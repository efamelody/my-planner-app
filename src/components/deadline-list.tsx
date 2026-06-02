"use client"

import { useProject } from "@/context/project-context"
import { cn } from "@/lib/utils"

export function DeadlineList() {
  const { activeProject } = useProject()

  if (!activeProject) return null

  const hasTimeline = activeProject.startDate || activeProject.endDate

  // Helper function to calculate days remaining
  const getDaysRemaining = (targetDateStr: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const targetDate = new Date(targetDateStr)
    targetDate.setHours(0, 0, 0, 0)

    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }

  // Format date nicely for display (e.g., "Jun 7, 2026")
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  // Determine urgency badge colors
  const getUrgencyStyles = (daysLeft: number) => {
    if (daysLeft < 0) return "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400" // Overdue/Done
    if (daysLeft <= 3) return "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 font-semibold animate-pulse" // Critical
    if (daysLeft <= 7) return "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400" // Approaching
    return "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" // Safe
  }

  return (
    <div className="mt-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Project Timeline & Deadlines</h2>
        <span className="text-[11px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
          {activeProject.name}
        </span>
      </div>

      <div className="p-4">
        {!hasTimeline ? (
          <div className="text-center py-4 text-xs text-zinc-400 italic">
            No deadlines allocated for this project.
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* Start Date Tracker */}
            {activeProject.startDate && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Kickoff Date</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">{formatDate(activeProject.startDate)}</span>
                </div>
                <span className="text-xs text-zinc-400">Scheduled</span>
              </div>
            )}

            {/* Divider line if both exist */}
            {activeProject.startDate && activeProject.endDate && (
              <div className="border-t border-dashed border-zinc-100 dark:border-zinc-800" />
            )}

            {/* Target/End Date Deadline Tracker */}
            {activeProject.endDate && (() => {
              const daysLeft = getDaysRemaining(activeProject.endDate)
              return (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Final Deadline</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-medium">{formatDate(activeProject.endDate)}</span>
                  </div>
                  
                  <div className={cn("text-xs px-2.5 py-1 rounded-full font-medium", getUrgencyStyles(daysLeft))}>
                    {daysLeft < 0 ? "Overdue" : daysLeft === 0 ? "Due Today" : daysLeft === 1 ? "1 day left" : `${daysLeft} days left`}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}