import { Project, Task, Goal, PomodoroSession } from "@/types"

const today = new Date()

function daysFromNow(days: number): string {
  const d = new Date(today)
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

export const mockProjects: Project[] = [
  { id: "p1", name: "Mathematics", color: "#3b82f6", startDate: daysFromNow(-14), endDate: daysFromNow(45) },
  { id: "p2", name: "Physics", color: "#10b981", startDate: daysFromNow(-7), endDate: daysFromNow(60) },
  { id: "p3", name: "Literature", color: "#f59e0b", startDate: daysFromNow(0), endDate: daysFromNow(90) },
]

export const mockTasks: Task[] = [
  { id: "t1", projectId: "p1", title: "Review calculus notes", completed: false, pomodoroCount: 2, createdAt: daysFromNow(-3) },
  { id: "t2", projectId: "p1", title: "Solve integrals worksheet", completed: true, pomodoroCount: 4, createdAt: daysFromNow(-2) },
  { id: "t3", projectId: "p1", title: "Watch linear algebra lecture", completed: false, pomodoroCount: 0, createdAt: daysFromNow(0) },
  { id: "t4", projectId: "p2", title: "Read kinematics chapter", completed: false, pomodoroCount: 1, createdAt: daysFromNow(-1) },
  { id: "t5", projectId: "p2", title: "Practice force diagrams", completed: false, pomodoroCount: 0, createdAt: daysFromNow(0) },
  { id: "t6", projectId: "p3", title: "Outline essay on Shakespeare", completed: false, pomodoroCount: 0, createdAt: daysFromNow(0) },
  { id: "t7", projectId: "p3", title: "Read chapter 5-8", completed: false, pomodoroCount: 0, createdAt: daysFromNow(0) },
]

export const mockGoals: Goal[] = [
  { id: "g1", projectId: "p1", title: "Pass Calculus II with A- or higher", targetDate: daysFromNow(45), steps: ["Complete all homework", "Take practice exams", "Attend office hours weekly"] },
  { id: "g2", projectId: "p1", title: "Master integral techniques", targetDate: daysFromNow(14), steps: ["Solve 50 integrals", "Review trig substitution", "Memorize common integrals"] },
  { id: "g3", projectId: "p2", title: "Finish mechanics module", targetDate: daysFromNow(30), steps: ["Complete all problem sets", "Run 3 simulations", "Pass module quiz"] },
  { id: "g4", projectId: "p3", title: "Write A-grade literary analysis", targetDate: daysFromNow(60), steps: ["Outline argument", "Gather quotes", "Write first draft", "Peer review"] },
]

export const mockPomodoros: PomodoroSession[] = [
  { id: "ps1", taskId: "t1", completedAt: daysFromNow(-1), duration: 25 },
  { id: "ps2", taskId: "t1", completedAt: daysFromNow(-1), duration: 25 },
  { id: "ps3", taskId: "t2", completedAt: daysFromNow(-1), duration: 25 },
]
