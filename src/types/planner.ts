/**
 * @deprecated This file is deprecated and will be removed in a future version.
 * 
 * Please use types from `@/types/planning` instead. This file represented
 * an older version of the planning model that has been superseded by the
 * core planning model.
 * 
 * Key differences:
 * - Use `WeekDay` ("monday", "tuesday", etc.) instead of `DayKey` ("mon", "tue", etc.)
 * - Use `PlanningItemType` instead of `PlanningType`
 * - Use `estimateMinutes` instead of `duration` (in hours)
 * - Use "medium" instead of "med" for priority
 * - Use `title` instead of `text` for Goal
 * - ScheduledBlock now references PlanningItem via `planningItemId` instead of copying data
 * - WeekPlan structure has changed to use `planningItems` and `scheduledBlocks`
 * 
 * Migration guide:
 * 1. Import from `@/types/planning` instead of `@/types/planner`
 * 2. Update day keys from abbreviated to full names
 * 3. Convert duration from hours to minutes (* 60)
 * 4. Update priority values ("med" -> "medium")
 * 5. Update goal properties ("text" -> "title")
 * 6. Restructure scheduled blocks to use references
 * 
 * See `docs/product-model.md` for the complete planning model documentation.
 */

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
