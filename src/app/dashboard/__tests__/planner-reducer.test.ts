import { describe, it, expect } from "vitest";
import type { WeekPlan, PlanningItem, ScheduledBlock } from "@/types/planning";

// Extract reducer logic for testing
type PlannerAction =
  | { type: "add_item"; item: PlanningItem }
  | { type: "schedule_item"; itemId: string; day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" }
  | { type: "move_block"; blockId: string; fromDay: "monday"; toDay: "tuesday" }
  | { type: "unschedule_block"; blockId: string; day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" };

function plannerReducer(plan: WeekPlan, action: PlannerAction): WeekPlan {
  switch (action.type) {
    case "add_item":
      return { ...plan, planningItems: [action.item, ...plan.planningItems] };
    case "schedule_item": {
      const item = plan.planningItems.find((planningItem) => planningItem.id === action.itemId);
      if (!item) return plan;

      const block: ScheduledBlock = {
        id: `block-${Date.now()}`,
        planningItemId: item.id,
        day: action.day,
        estimateMinutes: item.estimateMinutes || 60,
      };

      return {
        ...plan,
        scheduledBlocks: {
          ...plan.scheduledBlocks,
          [action.day]: [...(plan.scheduledBlocks[action.day] || []), block],
        },
      };
    }
    case "move_block": {
      if (action.fromDay === action.toDay) return plan;

      const block = (plan.scheduledBlocks[action.fromDay] || []).find(
        (scheduledBlock) => scheduledBlock.id === action.blockId,
      );
      if (!block) return plan;

      return {
        ...plan,
        scheduledBlocks: {
          ...plan.scheduledBlocks,
          [action.fromDay]: (plan.scheduledBlocks[action.fromDay] || []).filter(
            (scheduledBlock) => scheduledBlock.id !== action.blockId,
          ),
          [action.toDay]: [
            ...(plan.scheduledBlocks[action.toDay] || []),
            { ...block, day: action.toDay },
          ],
        },
      };
    }
    case "unschedule_block": {
      const block = (plan.scheduledBlocks[action.day] || []).find(
        (scheduledBlock) => scheduledBlock.id === action.blockId,
      );
      if (!block) return plan;

      return {
        ...plan,
        scheduledBlocks: {
          ...plan.scheduledBlocks,
          [action.day]: (plan.scheduledBlocks[action.day] || []).filter(
            (scheduledBlock) => scheduledBlock.id !== action.blockId,
          ),
        },
      };
    }
    default:
      return plan;
  }
}

// Test setup
const createMockPlan = (): WeekPlan => ({
  weekOf: "2026-05-11",
  goals: [],
  planningItems: [
    {
      id: "item-1",
      title: "Test Task",
      type: "task",
      source: "manual",
      priority: "medium",
      estimateMinutes: 120,
      category: "work",
    },
    {
      id: "item-2",
      title: "Another Task",
      type: "review",
      source: "manual",
      estimateMinutes: 60,
    },
  ],
  scheduledBlocks: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
  },
});

describe("Planner Reducer - Model Alignment Tests", () => {
  it("scheduling a planning item creates a ScheduledBlock with planningItemId", () => {
    const plan = createMockPlan();
    const result = plannerReducer(plan, {
      type: "schedule_item",
      itemId: "item-1",
      day: "monday",
    });

    expect(result.scheduledBlocks.monday).toHaveLength(1);
    const block = result.scheduledBlocks.monday[0];
    expect(block.planningItemId).toBe("item-1");
    expect(block.estimateMinutes).toBe(120);
    expect(block.day).toBe("monday");
  });

  it("scheduling does not delete or mutate the source PlanningItem", () => {
    const plan = createMockPlan();
    const originalItem = plan.planningItems.find((item) => item.id === "item-1");
    
    const result = plannerReducer(plan, {
      type: "schedule_item",
      itemId: "item-1",
      day: "monday",
    });

    const itemAfter = result.planningItems.find((item) => item.id === "item-1");
    expect(itemAfter).toBeDefined();
    expect(itemAfter!.id).toBe(originalItem!.id);
    expect(itemAfter!.title).toBe(originalItem!.title);
    expect(itemAfter!.estimateMinutes).toBe(originalItem!.estimateMinutes);
    
    expect(result.planningItems).toHaveLength(plan.planningItems.length);
  });

  it("removing/unscheduling a ScheduledBlock leaves the source PlanningItem intact", () => {
    const plan = createMockPlan();
    
    const scheduled = plannerReducer(plan, {
      type: "schedule_item",
      itemId: "item-1",
      day: "monday",
    });
    
    const blockId = scheduled.scheduledBlocks.monday[0].id;
    const planningItemsBefore = scheduled.planningItems.length;
    
    const result = plannerReducer(scheduled, {
      type: "unschedule_block",
      blockId,
      day: "monday",
    });

    expect(result.scheduledBlocks.monday).toHaveLength(0);
    
    expect(result.planningItems).toHaveLength(planningItemsBefore);
    const item = result.planningItems.find((item) => item.id === "item-1");
    expect(item).toBeDefined();
    expect(item!.title).toBe("Test Task");
    expect(item!.estimateMinutes).toBe(120);
    expect(item!.source).toBe("manual");
    expect(item!.category).toBe("work");
  });

  it("moving a ScheduledBlock preserves planningItemId", () => {
    const plan = createMockPlan();
    
    const scheduled = plannerReducer(plan, {
      type: "schedule_item",
      itemId: "item-2",
      day: "monday",
    });
    
    const blockId = scheduled.scheduledBlocks.monday[0].id;
    const originalPlanningItemId = scheduled.scheduledBlocks.monday[0].planningItemId;
    
    const result = plannerReducer(scheduled, {
      type: "move_block",
      blockId,
      fromDay: "monday",
      toDay: "tuesday",
    });

    expect(result.scheduledBlocks.monday).toHaveLength(0);
    expect(result.scheduledBlocks.tuesday).toHaveLength(1);
    
    const movedBlock = result.scheduledBlocks.tuesday[0];
    expect(movedBlock.planningItemId).toBe(originalPlanningItemId);
    expect(movedBlock.planningItemId).toBe("item-2");
    
    const item = result.planningItems.find((item) => item.id === "item-2");
    expect(item).toBeDefined();
    expect(item!.title).toBe("Another Task");
  });

  it("scheduling uses estimateMinutes (not duration)", () => {
    const plan = createMockPlan();
    const result = plannerReducer(plan, {
      type: "schedule_item",
      itemId: "item-1",
      day: "monday",
    });

    const block = result.scheduledBlocks.monday[0];
    expect(block).toHaveProperty("estimateMinutes");
    expect(typeof block.estimateMinutes).toBe("number");
    // @ts-expect-error - duration should not exist
    expect(block.duration).toBeUndefined();
  });

  it("scheduled block references item (not copies all properties)", () => {
    const plan = createMockPlan();
    const result = plannerReducer(plan, {
      type: "schedule_item",
      itemId: "item-1",
      day: "monday",
    });

    const block = result.scheduledBlocks.monday[0];
    
    expect(block).toHaveProperty("planningItemId");
    expect(block.planningItemId).toBe("item-1");
    
    // @ts-expect-error - title should not be on block
    expect(block.title).toBeUndefined();
    // @ts-expect-error - type should not be on block
    expect(block.type).toBeUndefined();
    // @ts-expect-error - source should not be on block
    expect(block.source).toBeUndefined();
  });
});
