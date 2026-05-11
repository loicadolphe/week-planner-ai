import type { WeekDay, Goal, PlanningItem } from "@/types/planning";
import { uid } from "@/lib/format";

export async function addGoal(title: string): Promise<Goal> {
  return {
    id: uid("goal"),
    title,
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
  input: Omit<PlanningItem, "id">,
): Promise<PlanningItem> {
  return {
    ...input,
    id: uid("item"),
  };
}

export async function deletePlanningItem(id: string): Promise<void> {
  void id;
  return Promise.resolve();
}

export async function scheduleItem(
  itemId: string,
  day: WeekDay,
): Promise<void> {
  void itemId;
  void day;
  return Promise.resolve();
}

export async function moveBlock(
  blockId: string,
  fromDay: WeekDay,
  toDay: WeekDay,
): Promise<void> {
  void blockId;
  void fromDay;
  void toDay;
  return Promise.resolve();
}

export async function unscheduleBlock(
  blockId: string,
  day: WeekDay,
): Promise<void> {
  void blockId;
  void day;
  return Promise.resolve();
}
