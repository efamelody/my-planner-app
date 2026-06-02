"use client"

import { useState } from "react"
import { useProject, useProjectTasks } from "@/context/project-context"
import { Button } from "@/components/ui/button"

export function TodoList() {
  const [newTitle, setNewTitle] = useState("")
  const { addTask, toggleTask, activeProject } = useProject()
  const tasks = useProjectTasks()

  const handleAdd = () => {
    const title = newTitle.trim()
    if (!title) return
    addTask(title)
    setNewTitle("")
  }

  if (!activeProject) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
        Select a project to get started
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">To-Do</h2>
      </div>

      <div className="flex gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a new task..."
          className="h-9 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
        />
        <Button size="sm" onClick={handleAdd}>
          Add
        </Button>
      </div>

      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {tasks.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-zinc-400">No tasks yet</li>
        )}
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-3 px-4 py-2.5">
            <button
              onClick={() => toggleTask(task.id)}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                task.completed
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-zinc-300 dark:border-zinc-600"
              }`}
            >
              {task.completed && (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span
              className={`flex-1 text-sm ${
                task.completed
                  ? "text-zinc-400 line-through"
                  : "text-zinc-800 dark:text-zinc-200"
              }`}
            >
              {task.title}
            </span>
            {task.pomodoroCount > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                🍅 {task.pomodoroCount}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
