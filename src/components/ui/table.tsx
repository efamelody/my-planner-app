import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TableProps {
  headers: string[]
  children: ReactNode
  className?: string
}

export function Table({ headers, children, className }: TableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">{children}</tbody>
      </table>
    </div>
  )
}

export function TableRow({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn("hover:bg-zinc-50 dark:hover:bg-zinc-900/50", className)}>{children}</tr>
}

export function TableCell({ children, className, colSpan }: { children: ReactNode; className?: string; colSpan?: number }) {
  return <td colSpan={colSpan} className={cn("px-4 py-3 text-zinc-700 dark:text-zinc-300", className)}>{children}</td>
}
