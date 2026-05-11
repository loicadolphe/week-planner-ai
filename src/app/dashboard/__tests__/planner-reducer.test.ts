import { describe, it } from "node:test";
import assert from "node:assert/strict";
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

    assert.equal(result.scheduledBlocks.monday.length, 1);
    const block = result.scheduledBlocks.monday[0];
    assert.equal(block.planningItemId, "item-1");
    assert.equal(block.estimateMinutes, 120);
    assert.equal(block.day, "monday");
  });

  it("scheduling does not delete or mutate the source PlanningItem", () => {
    const plan = createMockPlan();
    const originalItem = plan.planningItems.find((item) => item.id === "item-1");
    
    const result = plannerReducer(plan, {
      type: "schedule_item",
      itemId: "item-1",
      day: "monday",
    });

    // Original planning item still exists
    const itemAfter = result.planningItems.find((item) => item.id === "item-1");
    assert.ok(itemAfter, "Planning item should still exist");
    assert.equal(itemAfter.id, originalItem!.id);
    assert.equal(itemAfter.title, originalItem!.title);
    assert.equal(itemAfter.estimateMinutes, originalItem!.estimateMinutes);
    
    // Planning items array length unchanged
    assert.equal(result.planningItems.length, plan.planningItems.length);
  });

  it("removing/unscheduling a ScheduledBlock leaves the source PlanningItem intact", () => {
    const plan = createMockPlan();
    
    // First schedule an item
    const scheduled = plannerReducer(plan, {
      type: "schedule_item",
      itemId: "item-1",
      day: "monday",
    });
    
    const blockId = scheduled.scheduledBlocks.monday[0].id;
    const planningItemsBefore = scheduled.planningItems.length;
    
    // Then unschedule it
    const result = plannerReducer(scheduled, {
      type: "unschedule_block",
      blockId,
      day: "monday",
    });

    // Block is removed
    assert.equal(result.scheduledBlocks.monday.length, 0);
    
    // Planning item still exists with all metadata
    assert.equal(result.planningItems.length, planningItemsBefore);
    const item = result.planningItems.find((item) => item.id === "item-1");
    assert.ok(item, "Planning item should still exist");
    assert.equal(item.title, "Test Task");
    assert.equal(item.estimateMinutes, 120);
    assert.equal(item.source, "manual");
    assert.equal(item.category, "work");
  });

  it("moving a ScheduledBlock preserves planningItemId", () => {
    const plan = createMockPlan();
    
    // Schedule an item on Monday
    const scheduled = plannerReducer(plan, {
      type: "schedule_item",
      itemId: "item-2",
      day: "monday",
    });
    
    const blockId = scheduled.scheduledBlocks.monday[0].id;
    const originalPlanningItemId = scheduled.scheduledBlocks.monday[0].planningItemId;
    
    // Move to Tuesday
    const result = plannerReducer(scheduled, {
      type: "move_block",
      blockId,
      fromDay: "monday",
      toDay: "tuesday",
    });

    // Block moved from Monday to Tuesday
    assert.equal(result.scheduledBlocks.monday.length, 0);
    assert.equal(result.scheduledBlocks.tuesday.length, 1);
    
    // planningItemId is preserved
    const movedBlock = result.scheduledBlocks.tuesday[0];
    assert.equal(movedBlock.planningItemId, originalPlanningItemId);
    assert.equal(movedBlock.planningItemId, "item-2");
    
    // Planning item still exists unchanged
    const item = result.planningItems.find((item) => item.id === "item-2");
    assert.ok(item, "Planning item should still exist");
    assert.equal(item.title, "Another Task");
  });

  it("scheduling uses estimateMinutes (not duration)", () => {
    const plan = createMockPlan();
    const result = plannerReducer(plan, {
      type: "schedule_item",
      itemId: "item-1",
      day: "monday",
    });

    const block = result.scheduledBlocks.monday[0];
    assert.ok("estimateMinutes" in block);
    assert.equal(typeof block.estimateMinutes, "number");
    // @ts-expect-error - duration should not exist
    assert.equal(block.duration, undefined);
  });

  it("scheduled block references item (not copies all properties)", () => {
    const plan = createMockPlan();
    const result = plannerReducer(plan, {
      type: "schedule_item",
      itemId: "item-1",
      day: "monday",
    });

    const block = result.scheduledBlocks.monday[0];
    
    // Block has reference
    assert.ok("planningItemId" in block);
    assert.equal(block.planningItemId, "item-1");
    
    // Block does NOT have item properties copied
    // @ts-expect-error - title should not be on block
    assert.equal(block.title, undefined);
    // @ts-expect-error - type should not be on block
    assert.equal(block.type, undefined);
    // @ts-expect-error - source should not be on block
    assert.equal(block.source, undefined);
  });
});
