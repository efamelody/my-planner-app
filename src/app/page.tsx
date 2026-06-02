"use client"

import { useProject } from "@/context/project-context"
import { Dropdown } from "@/components/ui/dropdown"
import { CalendarView } from "@/components/calendar-view"
import { TodoList } from "@/components/todo-list"
import { DeadlineList } from "@/components/deadline-list"
import { PomodoroTimer } from "@/components/pomodoro-timer"

export default function WorkspacePage() {
  const { projects, activeProjectId, setActiveProjectId } = useProject()

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <Dropdown
          options={projects.map((p) => ({ value: p.id, label: p.name }))}
          value={activeProjectId ?? ""}
          onChange={(e) => setActiveProjectId(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {/* < PomodoroTimer /> */}
          <CalendarView />
        </div>
        <div className="lg:col-span-5">
          < PomodoroTimer />
          <TodoList />
          <DeadlineList />
        </div>
      </div>
    </div>
  )
}
