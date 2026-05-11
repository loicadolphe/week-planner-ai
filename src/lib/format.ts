import { format, getISOWeek } from "date-fns";
import type { DayKey, ScheduledBlock } from "@/types/planner";

export const DAY_ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri"];

export const DAY_LABELS: Record<DayKey, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
};

export const DAY_SHORT_LABELS: Record<DayKey, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
};

export function fmtDuration(hours: number): string {
  const rounded = Math.round(hours * 4) / 4;
  const wholeHours = Math.floor(rounded);
  const minutes = Math.round((rounded - wholeHours) * 60);

  if (wholeHours <= 0 && minutes <= 0) return "0h";
  if (wholeHours <= 0) return `${minutes}m`;
  if (minutes <= 0) return `${wholeHours}h`;
  return `${wholeHours}h ${minutes}m`;
}

export function sumHours(blocks: Pick<ScheduledBlock, "duration">[]): number {
  return blocks.reduce((total, block) => total + block.duration, 0);
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
