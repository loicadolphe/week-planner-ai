"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import * as planActions from "@/app/_actions/plan";
import { BacklogSection } from "@/components/planner/BacklogSection";
import type { CategoryFilter } from "@/components/planner/CategoryFilterChips";
import { GoalsSection } from "@/components/planner/GoalsSection";
import { Header } from "@/components/planner/Header";
import { WeekBoard } from "@/components/planner/WeekBoard";
import { MobileBoard } from "@/components/planner/mobile/MobileBoard";
import { MobileTab, MobileTabs } from "@/components/planner/mobile/MobileTabs";
import { DAY_ORDER, sumMinutes, uid } from "@/lib/format";
import type { WeekDay, Goal, PlanningItem, WeekPlan } from "@/types/planning";

const STORAGE_KEY = "week-planner-ai:m1-plan";

type PlannerAction =
  | { type: "hydrate"; plan: WeekPlan }
  | { type: "add_goal"; goal: Goal }
  | { type: "toggle_goal"; id: string }
  | { type: "delete_goal"; id: string }
  | { type: "add_item"; item: PlanningItem }
  | { type: "delete_item"; id: string }
  | { type: "schedule_item"; itemId: string; day: WeekDay }
  | { type: "move_block"; blockId: string; fromDay: WeekDay; toDay: WeekDay }
  | { type: "unschedule_block"; blockId: string; day: WeekDay };

interface PlannerClientProps {
  initialPlan: WeekPlan;
  forceMobile?: boolean;
}

export function PlannerClient({ initialPlan, forceMobile = false }: PlannerClientProps) {
  const [plan, dispatch] = useReducer(plannerReducer, initialPlan);
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [showCategoryBars, setShowCategoryBars] = useState(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>("plan");
  const [selectedDay, setSelectedDay] = useState<WeekDay>("monday");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        dispatch({ type: "hydrate", plan: JSON.parse(stored) as WeekPlan });
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    queueMicrotask(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    }
  }, [hydrated, plan]);

  const backlogItems = useMemo(
    () => {
      const scheduledItemIds = new Set(
        Object.values(plan.scheduledBlocks)
          .flat()
          .map((block) => block.planningItemId)
      );
      return plan.planningItems.filter((item) => !scheduledItemIds.has(item.id));
    },
    [plan.planningItems, plan.scheduledBlocks]
  );

  const dayTotals = useMemo(
    () =>
      DAY_ORDER.reduce(
        (totals, day) => ({
          ...totals,
          [day]: sumMinutes(plan.scheduledBlocks[day] || []),
        }),
        {} as Record<WeekDay, number>,
      ),
    [plan.scheduledBlocks],
  );

  const handleAddGoal = (title: string) => {
    void (async () => {
      const goal = await planActions.addGoal(title);
      dispatch({ type: "add_goal", goal });
    })();
  };

  const handleToggleGoal = (id: string) => {
    void (async () => {
      await planActions.toggleGoal(id);
      dispatch({ type: "toggle_goal", id });
    })();
  };

  const handleDeleteGoal = (id: string) => {
    void (async () => {
      await planActions.deleteGoal(id);
      dispatch({ type: "delete_goal", id });
    })();
  };

  const handleAddItem = (input: Omit<PlanningItem, "id" | "createdAt">) => {
    void (async () => {
      const item = await planActions.addPlanningItem(input);
      dispatch({ type: "add_item", item });
    })();
  };

  const handleDeleteItem = (id: string) => {
    void (async () => {
      await planActions.deletePlanningItem(id);
      dispatch({ type: "delete_item", id });
    })();
  };

  const handleSchedule = (itemId: string, day: WeekDay) => {
    void (async () => {
      await planActions.scheduleItem(itemId, day);
      dispatch({ type: "schedule_item", itemId, day });
      setMobileTab("plan");
      setSelectedDay(day);
    })();
  };

  const handleMoveBlock = (blockId: string, fromDay: WeekDay, toDay: WeekDay) => {
    void (async () => {
      await planActions.moveBlock(blockId, fromDay, toDay);
      dispatch({ type: "move_block", blockId, fromDay, toDay });
      setSelectedDay(toDay);
    })();
  };

  const handleUnschedule = (blockId: string, day: WeekDay) => {
    void (async () => {
      await planActions.unscheduleBlock(blockId, day);
      dispatch({ type: "unschedule_block", blockId, day });
    })();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const overId = event.over?.id;
    if (!overId || typeof overId !== "string" || !overId.startsWith("day:")) return;

    const day = overId.replace("day:", "") as WeekDay;
    if (!DAY_ORDER.includes(day)) return;

    const data = event.active.data.current;
    if (data?.kind === "item" && typeof data.itemId === "string") {
      handleSchedule(data.itemId, day);
    }

    if (
      data?.kind === "block" &&
      typeof data.blockId === "string" &&
      DAY_ORDER.includes(data.fromDay as WeekDay)
    ) {
      handleMoveBlock(data.blockId, data.fromDay as WeekDay, day);
    }
  };

  const rootClassName = `planner-shell ${showCategoryBars ? "" : "no-bars"}`;

  return (
    <div className={rootClassName}>
      {!forceMobile ? (
        <div className="desktop-planner">
          <Header
            weekOf={plan.weekOf}
            showCategoryBars={showCategoryBars}
            onToggleCategoryBars={() => setShowCategoryBars((current) => !current)}
          />
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <main className="mx-auto grid w-full max-w-[1500px] grid-cols-[360px_1fr] gap-4 px-5 pb-8">
              <div className="space-y-4">
                <BacklogSection
                  items={backlogItems}
                  dayTotals={dayTotals}
                  filter={filter}
                  onFilterChange={setFilter}
                  onAddItem={handleAddItem}
                  onDeleteItem={handleDeleteItem}
                  onSchedule={handleSchedule}
                />
                <GoalsSection
                  goals={plan.goals}
                  onAddGoal={handleAddGoal}
                  onToggleGoal={handleToggleGoal}
                  onDeleteGoal={handleDeleteGoal}
                />
              </div>
              <WeekBoard plan={plan} planningItems={plan.planningItems} onUnschedule={handleUnschedule} />
            </main>
          </DndContext>
        </div>
      ) : null}

      <main className={forceMobile ? "mx-auto min-h-screen max-w-[430px] px-5 py-5" : "mobile-planner px-5 py-5"}>
        <div className="mb-4">
          <p className="mono text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--ink-3)" }}>
            Week Planner AI
          </p>
          <h1 className="mt-1 text-[20px] font-[540]" style={{ color: "var(--ink-1)" }}>
            This week
          </h1>
        </div>
        <div className="mb-4">
          <MobileTabs
            activeTab={mobileTab}
            backlogCount={backlogItems.length}
            goalsCount={plan.goals.filter((goal) => !goal.done).length}
            onChange={setMobileTab}
          />
        </div>
        <MobileBoard
          plan={plan}
          backlogItems={backlogItems}
          planningItems={plan.planningItems}
          activeTab={mobileTab}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onSchedule={handleSchedule}
          onUnschedule={handleUnschedule}
          onAddGoal={handleAddGoal}
          onToggleGoal={handleToggleGoal}
          onDeleteGoal={handleDeleteGoal}
        />
      </main>
    </div>
  );
}

function plannerReducer(plan: WeekPlan, action: PlannerAction): WeekPlan {
  switch (action.type) {
    case "hydrate":
      return action.plan;
    case "add_goal":
      return { ...plan, goals: [...plan.goals, action.goal] };
    case "toggle_goal":
      return {
        ...plan,
        goals: plan.goals.map((goal) =>
          goal.id === action.id ? { ...goal, done: !goal.done } : goal,
        ),
      };
    case "delete_goal":
      return {
        ...plan,
        goals: plan.goals.filter((goal) => goal.id !== action.id),
      };
    case "add_item":
      return { ...plan, planningItems: [action.item, ...plan.planningItems] };
    case "delete_item":
      return {
        ...plan,
        planningItems: plan.planningItems.filter((item) => item.id !== action.id),
      };
    case "schedule_item": {
      const item = plan.planningItems.find((planningItem) => planningItem.id === action.itemId);
      if (!item) return plan;

      const block = {
        id: uid("block"),
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
