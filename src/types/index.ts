export interface Project {
  id: string
  name: string
  color: string
  startDate: string
  endDate: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  completed: boolean
  pomodoroCount: number
  createdAt: string
  scheduledDate?: string
  startTime?: string
  endTime?: string
}

export interface Goal {
  id: string
  projectId: string
  title: string
  targetDate: string
  steps: string[]
}

export interface PomodoroSession {
  id: string
  taskId: string
  completedAt: string
  duration: number
}
