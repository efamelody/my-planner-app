"use client"

import { MetricsGrid } from "@/components/metrics-grid"
import { GanttChart } from "@/components/gantt-chart"

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Progress Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Your study stats at a glance
        </p>
      </div>

      <MetricsGrid />

      <div>
        <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Project Timeline
        </h2>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <GanttChart />
        </div>
      </div>
    </div>
  )
}
