# Minimalist Study & Project Planner

A clean, distraction-free web application designed to help students and developers organize their modules, side projects, schedules, and goals. Built using **Next.js (App Router)**, **Tailwind CSS**, and **Supabase** for a lightning-fast, state-driven workflow.

---

## Project Overview & Architecture

The application is split into three core views, keeping navigation intuitive and data neatly scoped based on a global **Project Filter**.

### The 3-Page Workflow
1. **Workspace (`/`)**: Features a project dropdown, a custom monthly calendar layout, a task-specific Gantt/timeline indicator, an active To-Do list, and a bottom-docked Pomodoro timer (50-10 or 25-5 presets).
2. **Goals (`/goals`)**: A strategic workspace containing a structured data table to map out subgoals, deadlines, and progressive actionable steps.
3. **Progress (`/progress`)**: An overall analytics dashboard displaying total focused hours, daily completion streaks, and a broad timeline view.

---

## Tech Stack & Tooling

* **Framework:** Next.js 15+ (App Router)
* **Styling:** Tailwind CSS
* **Database & Auth:** Supabase (PostgreSQL)
* **Package Manager:** `pnpm`
* **Language:** TypeScript

---

## Directory Architecture

```text
src/
├── app/                        # Next.js App Routing Pages
│   ├── layout.tsx              # Global layouts & UI context providers
│   ├── page.tsx                # Page 1: Main Workspace Dashboard
│   ├── goals/                  # Page 2: Strategic Goals Layout
│   │   └── page.tsx
│   └── progress/               # Page 3: Visual Analytics Dashboard
│       └── page.tsx
├── components/                 # Reusable Layout & Component Blocks
│   ├── calendar-view.tsx       # Custom Calendar grid logic
│   ├── todo-list.tsx           # Scoped project list execution
│   ├── pomodoro-timer.tsx      # Countdowns and focus intervals
│   └── ui/                     # Primitive design tokens (Buttons, Inputs, Tables)
├── context/                    # Shared client state management
│   └── project-context.tsx     # Active Project filter broadcasting
└── lib/                        # Third-party setups
    └── supabase.ts             # Instantiated Supabase database client