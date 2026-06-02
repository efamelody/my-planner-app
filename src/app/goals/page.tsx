"use client"

import { useState } from "react"
import { useProject, useProjectGoals } from "@/context/project-context"
import { Dropdown } from "@/components/ui/dropdown"
import { Button } from "@/components/ui/button"
import { Table, TableRow, TableCell } from "@/components/ui/table"

export default function GoalsPage() {
  const { projects, activeProjectId, setActiveProjectId, addGoal } = useProject()
  const goals = useProjectGoals()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [targetDate, setTargetDate] = useState("")
  const [stepsText, setStepsText] = useState("")

  const handleAdd = () => {
    if (!title.trim() || !targetDate) return
    const steps = stepsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
    addGoal(title.trim(), targetDate, steps)
    setTitle("")
    setTargetDate("")
    setStepsText("")
    setShowForm(false)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Dropdown
          options={projects.map((p) => ({ value: p.id, label: p.name }))}
          value={activeProjectId ?? ""}
          onChange={(e) => setActiveProjectId(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Goal"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">New Goal</h3>
          <div className="flex flex-col gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Goal title"
              className="h-9 rounded-lg border border-zinc-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="h-9 rounded-lg border border-zinc-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <textarea
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              placeholder="Steps to achieve (one per line)"
              rows={3}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <Button onClick={handleAdd} size="sm" className="self-start">
              Save Goal
            </Button>
          </div>
        </div>
      )}

      <Table headers={["Goal", "Target Date", "Steps to Achieve"]}>
        {goals.length === 0 && (
          <TableRow>
            <TableCell className="text-center text-zinc-400" colSpan={3}>
              No goals for this project yet
            </TableCell>
          </TableRow>
        )}
        {goals.map((goal) => (
          <TableRow key={goal.id}>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
              {goal.title}
            </TableCell>
            <TableCell className="text-zinc-500">
              {new Date(goal.targetDate + "T00:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </TableCell>
            <TableCell>
              {goal.steps.length > 0 && (
                <ul className="list-inside list-disc space-y-0.5 text-zinc-600 dark:text-zinc-400">
                  {goal.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              )}
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  )
}
