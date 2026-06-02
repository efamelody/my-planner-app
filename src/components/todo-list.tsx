"use client"

import { useState } from "react"
import { useProject, useProjectTasks } from "@/context/project-context"

interface TodoListProps {
  activeTaskId: string | null
  onSelectTask: (id: string | null) => void
}

export function TodoList({ activeTaskId, onSelectTask }: TodoListProps) {
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
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">To-Do Tasks</h2>
      </div>

      <div className="flex gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 text-sm bg-transparent outline-none border rounded px-2.5 py-1.5 dark:border-zinc-700"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
      </div>

      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 max-h-[250px] overflow-y-auto">
        {tasks.length === 0 && (
          <li className="p-4 text-center text-xs text-zinc-400">No tasks yet</li>
        )}
        {tasks.map((task) => {
          const isSelected = activeTaskId === task.id
          
          return (
            <li 
              key={task.id} 
              onClick={() => !task.completed && onSelectTask(task.id)}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                isSelected ? "bg-blue-50/60 dark:bg-blue-950/20" : "hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
              }`}
            >
              {/* Checkbox button */}
              <button
                onClick={(e) => {
                  e.stopPropagation() // Prevent selecting task when checking it off
                  toggleTask(task.id)
                  if (isSelected) onSelectTask(null)
                }}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  task.completed ? "border-green-500 bg-green-500 text-white" : "border-zinc-300 dark:border-zinc-600"
                }`}
              >
                {task.completed && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              
              <span className={`flex-1 text-sm truncate ${
                task.completed 
                  ? "text-zinc-400 line-through" 
                  : isSelected 
                  ? "text-blue-600 dark:text-blue-400 font-semibold" 
                  : "text-zinc-800 dark:text-zinc-200"
              }`}>
                {task.title}
              </span>
              
              {task.pomodoroCount > 0 && (
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                  🍅 {task.pomodoroCount}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}