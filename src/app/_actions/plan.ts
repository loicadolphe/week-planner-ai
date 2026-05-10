import type { DayKey, Goal, PlanningItem } from "@/types/planner";
import { uid } from "@/lib/format";

export async function addGoal(text: string): Promise<Goal> {
  return {
    id: uid("goal"),
    text,
    done: false,
  };
}

export async function toggleGoal(id: string): Promise<void> {
  void id;
  return Promise.resolve();
}

export async function deleteGoal(id: string): Promise<void> {
  void id;
  return Promise.resolve();
}

export async function addPlanningItem(
  input: Omit<PlanningItem, "id" | "createdAt">,
): Promise<PlanningItem> {
  return {
    ...input,
    id: uid("item"),
    createdAt: new Date().toISOString(),
  };
}

export async function deletePlanningItem(id: string): Promise<void> {
  void id;
  return Promise.resolve();
}

export async function scheduleItem(
  itemId: string,
  day: DayKey,
): Promise<void> {
  void itemId;
  void day;
  return Promise.resolve();
}

export async function moveBlock(
  blockId: string,
  fromDay: DayKey,
  toDay: DayKey,
): Promise<void> {
  void blockId;
  void fromDay;
  void toDay;
  return Promise.resolve();
}

export async function unscheduleBlock(
  blockId: string,
  day: DayKey,
): Promise<void> {
  void blockId;
  void day;
  return Promise.resolve();
}
