export type Goal = {
  id: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  done?: boolean;
};

export type Category = "work" | "personal" | "errands" | "wellbeing";

export type PlanningItemType =
  | "task"
  | "project"
  | "meeting_prep"
  | "follow_up"
  | "decision"
  | "review"
  | "stakeholder_update"
  | "personal"
  | "other";

export type PlanningItemSource =
  | "manual"
  | "linear"
  | "github"
  | "calendar"
  | "email"
  | "slack"
  | "notion"
  | "other";

export type PlanningItem = {
  id: string;
  title: string;
  description?: string;
  type: PlanningItemType;
  source: PlanningItemSource;
  externalId?: string;
  externalUrl?: string;
  status?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  estimateMinutes?: number;
  dueDate?: string;
  category?: Category;
};

export type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

export type ScheduledBlock = {
  id: string;
  planningItemId: string;
  day: WeekDay;
  estimateMinutes: number;
  startTime?: string;
  endTime?: string;
};

export type WeekPlan = {
  weekOf: string;
  goals: Goal[];
  planningItems: PlanningItem[];
  scheduledBlocks: Record<WeekDay, ScheduledBlock[]>;
};
