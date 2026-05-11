export type Category = "work" | "personal" | "errands" | "wellbeing";

export type PlanningType =
  | "task"
  | "project"
  | "meeting_prep"
  | "follow_up"
  | "decision"
  | "review"
  | "stakeholder_update"
  | "personal"
  | "other";

export type Priority = "low" | "med" | "high";

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri";

export interface Goal {
  id: string;
  text: string;
  done: boolean;
}

export interface PlanningItem {
  id: string;
  title: string;
  category?: Category;
  type: PlanningType;
  priority: Priority;
  duration: number;
  createdAt: string;
}

export interface ScheduledBlock extends Omit<PlanningItem, "createdAt"> {
  scheduledAt: string;
}

export interface WeekPlan {
  weekOf: string;
  goals: Goal[];
  backlog: PlanningItem[];
  blocks: Record<DayKey, ScheduledBlock[]>;
}
