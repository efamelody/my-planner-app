import { StickyNotesBoard } from "@/components/sticky-notes"
import { GoogleDocsWorkspace } from "@/components/google-docs-embedded"

export default function NotesPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      <StickyNotesBoard />
      <hr />
      <GoogleDocsWorkspace />
    </div>
  )
}