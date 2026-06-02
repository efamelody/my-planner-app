"use client"

import { Fragment } from "react"
import { useProject } from "@/context/project-context"

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function getMonthIndex(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00")
  return d.getFullYear() * 12 + d.getMonth()
}

export function GanttChart() {
  const { projects } = useProject()

  if (projects.length === 0) {
    return <p className="text-sm text-zinc-500">No projects to display</p>
  }

  const minMonth = Math.min(...projects.map((p) => getMonthIndex(p.startDate)))
  const maxMonth = Math.max(...projects.map((p) => getMonthIndex(p.endDate)))
  const totalMonths = maxMonth - minMonth + 1

  const months: { label: string; year: number }[] = []
  for (let i = 0; i < totalMonths; i++) {
    const m = minMonth + i
    months.push({ label: MONTH_LABELS[m % 12], year: Math.floor(m / 12) })
  }

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-0"
        style={{ gridTemplateColumns: `200px repeat(${totalMonths}, minmax(80px, 1fr))` }}
      >
        <div className="sticky left-0 bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          Project
        </div>
        {months.map((m, i) => (
          <div
            key={i}
            className="px-2 py-2 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400"
          >
            {m.label} {i === 0 || (minMonth + i) % 12 === 0 ? m.year : ""}
          </div>
        ))}

        {projects.map((project) => {
          const startIdx = getMonthIndex(project.startDate) - minMonth
          const endIdx = getMonthIndex(project.endDate) - minMonth
          return (
            <Fragment key={project.id}>
              <div className="sticky left-0 flex items-center gap-2 border-t border-zinc-100 bg-white px-4 py-3 text-sm font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </div>
              {months.map((_, colIdx) => (
                <div
                  key={`cell-${project.id}-${colIdx}`}
                  className="relative border-t border-zinc-100 dark:border-zinc-800"
                  style={{ minHeight: 44 }}
                >
                  {colIdx >= startIdx && colIdx <= endIdx && (
                    <div
                      className="absolute inset-y-1 left-1 right-1 rounded-md opacity-70"
                      style={{ backgroundColor: project.color }}
                    />
                  )}
                </div>
              ))}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
