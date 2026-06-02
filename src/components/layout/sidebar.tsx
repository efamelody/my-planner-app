"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dropdown } from "../ui/dropdown"
import { useProject } from "@/context/project-context"

const links = [
  { href: "/", label: "Workspace", icon: "📋" },
  // { href: "/goals", label: "Goals", icon: "🎯" },
  { href: "/progress", label: "Progress", icon: "📊" },
  { href: "/notes", label: "Notes", icon: "📊" },
]


export function Sidebar() {
  const pathname = usePathname()
  const { projects, activeProjectId, setActiveProjectId } = useProject()

  return (
    <aside className="flex h-full w-16 flex-col items-center gap-2 border-r border-zinc-200 bg-white py-4 dark:border-zinc-800 dark:bg-zinc-900 lg:w-56">
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
        SP
      </div>
      <div className="mb-6">
        <Dropdown
          options={projects.map((p) => ({ value: p.id, label: p.name }))}
          value={activeProjectId ?? ""}
          onChange={(e) => setActiveProjectId(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <nav className="flex w-full flex-col gap-1 px-2">
        {links.map((link) => {
          const isActive =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
              )}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="hidden lg:inline">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
