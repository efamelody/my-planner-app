"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function GoogleDocsWorkspace() {
  // Pre-populated with Chapter and Review dummy data
  const [docs, setDocs] = useState([
    { title: "Chapter 1: Intro to Next.js", embedUrl: "..." },
    { title: "Literature Review Draft", embedUrl: "..." }
  ])

  return (
    <div className="rounded-xl border border-zinc-200 p-4">
      <h2 className="text-lg font-bold mb-4">Attached Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc, i) => (
          <div key={i} className="p-3 border rounded-lg bg-zinc-50 dark:bg-zinc-800 text-sm font-medium">
            📝 {doc.title}
          </div>
        ))}
      </div>
      <Button className="mt-4" size="sm">Add New Google Doc</Button>
    </div>
  )
}