"use client"

import { SelectHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: DropdownOption[]
  placeholder?: string
}

export function Dropdown({ options, placeholder, className, ...props }: DropdownProps) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
        className,
      )}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
