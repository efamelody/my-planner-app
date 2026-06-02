"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Play, Pause, RotateCcw, Sliders } from "lucide-react"
import { useProjectTasks } from "@/context/project-context"

interface PomodoroTimerProps {
  activeTaskId: string | null
}

export function PomodoroTimer({ activeTaskId }: PomodoroTimerProps) {
  const tasks = useProjectTasks()
  const activeTask = tasks.find((t) => t.id === activeTaskId)

  // Configuration Modes: '25' | '50' | 'custom'
  const [mode, setMode] = useState<"25" | "50" | "custom">("25")
  const [totalMinutes, setTotalMinutes] = useState(25)
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [showCustomInput, setShowCustomInput] = useState(false)

  // Helper routine to switch session presets safely
  const changePreset = (mins: number, selectedMode: "25" | "50" | "custom") => {
    setIsActive(false)
    setMode(selectedMode)
    setTotalMinutes(mins)
    setMinutes(mins)
    setSeconds(0)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          setMinutes((m) => m - 1)
          setSeconds(59)
        } else {
          setSeconds((s) => s - 1)
        }
      }, 1000)
    } else if (minutes === 0 && seconds === 0 && isActive) {
      setIsActive(false)
      alert("🎯 Session finished! Great job staying focused.")
      // Optional backend call hook here: await incrementPomodoroCount(activeTaskId)
    }

    return () => clearInterval(interval)
  }, [isActive, minutes, seconds])

  const totalSeconds = totalMinutes * 60
  const currentSeconds = minutes * 60 + seconds
  const progress = totalSeconds > 0 ? (currentSeconds / totalSeconds) * 100 : 0

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 w-full">
      
      {/* Objective Header Area */}
      <div className="text-center w-full border-b pb-2 dark:border-zinc-800">
        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">Focus Target</span>
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 truncate mt-0.5 min-h-[20px]">
          {activeTask ? `🎯 ${activeTask.title}` : "Select a task below to activate timer"}
        </h3>
      </div>

      {/* Preset Picker Bar Configuration */}
      <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg w-full">
        <button
          onClick={() => changePreset(25, "25")}
          className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
            mode === "25" ? "bg-white text-zinc-950 font-semibold shadow-xs" : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          25 - 5 min
        </button>
        <button
          onClick={() => changePreset(50, "50")}
          className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
            mode === "50" ? "bg-white text-zinc-950 font-semibold shadow-xs" : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          50 - 10 min
        </button>
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className={`p-1 px-2 rounded-md transition-all ${
            mode === "custom" ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Manual Custom Time Configuration Panel */}
      {showCustomInput && (
        <div className="flex items-center justify-between gap-2 w-full bg-zinc-50 dark:bg-zinc-950/40 p-2 rounded-lg border border-dashed animate-in fade-in duration-200">
          <span className="text-xs text-zinc-500">Set Custom Minutes:</span>
          <input
            type="number"
            min="1"
            max="180"
            value={totalMinutes}
            onChange={(e) => {
              const val = Math.max(1, parseInt(e.target.value) || 1)
              changePreset(val, "custom")
            }}
            className="w-16 text-xs p-1 rounded border text-center bg-white dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
      )}

      {/* Circular Progress Interface Counter Grid */}
      <div className="relative w-48 h-48 my-1">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth="3.5" fill="transparent" />
          <motion.circle
            cx="50" cy="50" r="45"
            className="stroke-emerald-500 dark:stroke-emerald-400"
            strokeWidth="3.5"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}` }}
            transition={{ duration: isActive ? 1 : 0.3, ease: "linear" }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center tabular-nums">
            <div className="text-4xl font-light text-zinc-900 dark:text-zinc-50">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase block mt-1">
              {isActive ? "Focus Session" : "Paused"}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Interaction Controller Core Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          disabled={!activeTask}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-95 text-white ${
            !activeTask 
              ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed shadow-none" 
              : isActive 
              ? "bg-amber-500 hover:bg-amber-600" 
              : "bg-emerald-500 hover:bg-emerald-600"
          }`}
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        <button
          onClick={() => changePreset(totalMinutes, mode)}
          className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>

    </div>
  )
}