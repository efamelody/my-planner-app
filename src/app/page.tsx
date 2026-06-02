"use client"

import { useState } from "react"
import { useProject } from "@/context/project-context"
import { CalendarView } from "@/components/calendar-view"
import { TodoList } from "@/components/todo-list"
import { DeadlineList } from "@/components/deadline-list"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { DailyView } from "@/components/daily-view"

export default function WorkspacePage() {
  const { activeProject } = useProject()
  
  // Shared state connecting TodoList selection with the Pomodoro Timer
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          <CalendarView />
          <DeadlineList />
        </div>
        
        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pass activeTaskId to timer */}
          <PomodoroTimer activeTaskId={activeTaskId} />
          
          {/* Pass activeTaskId and setter to list */}
          <TodoList activeTaskId={activeTaskId} onSelectTask={setActiveTaskId} />
          
          <DailyView />
        </div>
      </div>
    </div>
  )
}