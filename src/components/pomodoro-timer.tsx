'use client'
import { motion } from "motion/react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const totalSeconds = 25 * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = (currentSeconds / totalSeconds) * 100;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-64 h-64">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="2"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl text-white font-light tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-sm text-slate-400 mt-2">Focus Session</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTimer}
          className="w-14 h-14 rounded-full bg-[#10B981] hover:bg-[#10B981]/80
            flex items-center justify-center transition-colors"
        >
          {isActive ? (
            <Pause className="w-6 h-6 text-[#0F172A]" />
          ) : (
            <Play className="w-6 h-6 text-[#0F172A] ml-1" />
          )}
        </button>

        <button
          onClick={resetTimer}
          className="w-14 h-14 rounded-full bg-[#334155] hover:bg-[#475569]
            flex items-center justify-center transition-colors"
        >
          <RotateCcw className="w-5 h-5 text-slate-300" />
        </button>
      </div>
    </div>
  );
}
