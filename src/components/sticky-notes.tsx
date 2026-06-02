"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StickyNote {
  id: string
  content: string
  colorClass: string
}

export function StickyNotesBoard() {
  // Initialized with dummy data for immediate visibility
  const [stickies, setStickies] = useState<StickyNote[]>([
    { id: "1", content: "Review Chapter 1 source notes before final submission.", colorClass: "bg-amber-100 border-amber-200" },
    { id: "2", content: "Todo: Check Prisma schema vs SQL performance.", colorClass: "bg-blue-100 border-blue-200" }
  ])

  const addSticky = () => {
    const colors = ["bg-amber-100 border-amber-200", "bg-blue-100 border-blue-200", "bg-rose-100 border-rose-200"]
    setStickies([...stickies, { id: crypto.randomUUID(), content: "", colorClass: colors[Math.floor(Math.random() * colors.length)] }])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Scratchpad Board</h2>
        <Button size="sm" variant="outline" onClick={addSticky}>+ Add Sticky</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stickies.map(note => (
          <div key={note.id} className={cn("aspect-square p-3 rounded-xl border shadow-sm", note.colorClass)}>
            <textarea 
              defaultValue={note.content} 
              className="w-full h-full bg-transparent resize-none focus:outline-none text-xs" 
              placeholder="Note..." 
            />
          </div>
        ))}
      </div>
    </div>
  )
}