import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/layout/sidebar"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { ProjectProvider } from "@/context/project-context"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Study Planner",
  description: "A workspace for studying, goal tracking, and progress analytics",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <ProjectProvider>
          <div className="flex h-full">
            <Sidebar />
            <div className="flex flex-1 flex-col">
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </div>
          {/* TODO: Make a pomodoro summary at the bottom */}
        </ProjectProvider>
      </body>
    </html>
  )
}
