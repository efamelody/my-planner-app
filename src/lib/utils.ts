export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function getMonthName(monthIndex: number): string {
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return names[monthIndex]
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function getMonthDays(year: number, month: number): Date[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = firstDayOfMonth.getDay(); // Sunday = 0, Monday = 1...
  
  // Shift offset if your week starts on Monday like in your image
  const adjustedOffset = startOffset === 0 ? 6 : startOffset - 1;

  const startDate = new Date(year, month, 1 - adjustedOffset);
  const days: Date[] = [];
  
  // Generate a standard 6-week calendar grid (42 days)
  for (let i = 0; i < 42; i++) {
    days.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i));
  }
  return days;
}
