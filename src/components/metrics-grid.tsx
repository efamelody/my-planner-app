"use client"

import { useProject } from "@/context/project-context"

export function MetricsGrid() {
  const { tasks, pomodoroSessions } = useProject()

  const completedDates = new Set(
    tasks
      .filter((t) => t.completed)
      .map((t) => t.createdAt)
  )

  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().split("T")[0]
    if (completedDates.has(ds)) {
      streak++
    } else if (i > 0) {
      break
    }
  }

  const totalFocusMinutes = pomodoroSessions.reduce((sum, s) => sum + s.duration, 0)
  const focusHours = (totalFocusMinutes / 60).toFixed(1)

  const cards = [
    { label: "Current Streak", value: `${streak} days`, color: "text-orange-600" },
    { label: "Total Focus Hours", value: `${focusHours}h`, color: "text-blue-600" },
    { label: "Tasks Completed", value: `${tasks.filter((t) => t.completed).length}`, color: "text-green-600" },
    { label: "Pomodoro Sessions", value: `${pomodoroSessions.length}`, color: "text-purple-600" },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{card.label}</p>
          <p className={`mt-1 text-2xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}
