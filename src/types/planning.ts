export type Goal = {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
};

export type LinearIssue = {
  id: string;
  identifier: string;
  title: string;
  status: string;
  priority: "low" | "medium" | "high" | "urgent";
  estimateHours?: number;
};

export type PlanningTask = {
  id: string;
  title: string;
  source: "goal" | "linear";
  sourceId?: string;
  estimateHours: number;
};

export type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

export type WeekPlan = Record<WeekDay, PlanningTask[]>;
