"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { Project, Task, Goal } from "@/types"
import { mockProjects, mockTasks, mockGoals, mockPomodoros } from "@/data/mock-data"

interface ProjectContextValue {
  projects: Project[]
  activeProjectId: string | null
  setActiveProjectId: (id: string) => void
  activeProject: Project | undefined
  tasks: Task[]
  goals: Goal[]
  addTask: (title: string) => void
  toggleTask: (taskId: string) => void
  incrementPomodoro: (taskId: string) => void
  addGoal: (title: string, targetDate: string, steps: string[]) => void
  pomodoroSessions: typeof mockPomodoros
  updateTaskSchedule: (taskId: string, scheduledDate: string, startTime: string, endTime: string) => void
  updateProjectDates: (projectId: string, startDate: string, endDate: string) => void
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(mockProjects[0]?.id ?? null)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [goals, setGoals] = useState<Goal[]>(mockGoals)
  const [pomodoroSessions] = useState(mockPomodoros)

  const activeProject = projects.find((p) => p.id === activeProjectId)

  const addTask = useCallback(
    (title: string) => {
      if (!activeProjectId) return
      const newTask: Task = {
        id: `t${Date.now()}`,
        projectId: activeProjectId,
        title,
        completed: false,
        pomodoroCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setTasks((prev) => [newTask, ...prev])
    },
    [activeProjectId],
  )

  const toggleTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)))
  }, [])

  const incrementPomodoro = useCallback((taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, pomodoroCount: t.pomodoroCount + 1 } : t)))
  }, [])

  const addGoal = useCallback(
    (title: string, targetDate: string, steps: string[]) => {
      if (!activeProjectId) return
      const newGoal: Goal = {
        id: `g${Date.now()}`,
        projectId: activeProjectId,
        title,
        targetDate,
        steps,
      }
      setGoals((prev) => [...prev, newGoal])
    },
    [activeProjectId],
  )

  const updateTaskSchedule = useCallback(
    (taskId: string, scheduledDate: string, startTime: string, endTime: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, scheduledDate, startTime, endTime } : t,
        ),
      )
    },
    [],
  )

  const updateProjectDates = useCallback(
    (projectId: string, startDate: string, endDate: string) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, startDate, endDate } : p,
        ),
      )
    },
    [],
  )

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProjectId,
        setActiveProjectId,
        activeProject,
        tasks,
        goals,
        addTask,
        toggleTask,
        incrementPomodoro,
        addGoal,
        pomodoroSessions,
        updateTaskSchedule,
        updateProjectDates,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error("useProject must be used within <ProjectProvider>")
  return ctx
}

export function useProjectTasks() {
  const { tasks, activeProjectId } = useProject()
  return tasks.filter((t) => t.projectId === activeProjectId)
}

export function useProjectGoals() {
  const { goals, activeProjectId } = useProject()
  return goals.filter((g) => g.projectId === activeProjectId)
}
