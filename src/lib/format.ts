import { format, getISOWeek } from "date-fns";
import type { WeekDay, ScheduledBlock } from "@/types/planning";

export const DAY_ORDER: WeekDay[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];

export const DAY_LABELS: Record<WeekDay, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

export const DAY_SHORT_LABELS: Record<WeekDay, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
};

export function fmtDuration(minutes: number): string {
  const hours = minutes / 60;
  const rounded = Math.round(hours * 4) / 4;
  const wholeHours = Math.floor(rounded);
  const remainingMinutes = Math.round((rounded - wholeHours) * 60);

  if (wholeHours <= 0 && remainingMinutes <= 0) return "0h";
  if (wholeHours <= 0) return `${remainingMinutes}m`;
  if (remainingMinutes <= 0) return `${wholeHours}h`;
  return `${wholeHours}h ${remainingMinutes}m`;
}

export function sumMinutes(blocks: Pick<ScheduledBlock, "estimateMinutes">[]): number {
  return blocks.reduce((total, block) => total + block.estimateMinutes, 0);
}

export function uid(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatWeekLabel(weekOf: string): string {
  const monday = new Date(`${weekOf}T00:00:00`);
  return `Week of ${format(monday, "MMM d")}`;
}

export function formatWeekNumber(weekOf: string): string {
  const monday = new Date(`${weekOf}T00:00:00`);
  return `Week ${getISOWeek(monday)}`;
}

export function formatDayDate(weekOf: string, dayIndex: number): string {
  const date = new Date(`${weekOf}T00:00:00`);
  date.setDate(date.getDate() + dayIndex);
  return format(date, "MMM d");
}
