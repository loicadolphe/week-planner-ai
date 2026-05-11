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
import { DAY_ORDER, sumHours, uid } from "@/lib/format";
import type { DayKey, Goal, PlanningItem, WeekPlan } from "@/types/planner";

const STORAGE_KEY = "week-planner-ai:m1-plan";

type PlannerAction =
  | { type: "hydrate"; plan: WeekPlan }
  | { type: "add_goal"; goal: Goal }
  | { type: "toggle_goal"; id: string }
  | { type: "delete_goal"; id: string }
  | { type: "add_item"; item: PlanningItem }
  | { type: "delete_item"; id: string }
  | { type: "schedule_item"; itemId: string; day: DayKey }
  | { type: "move_block"; blockId: string; fromDay: DayKey; toDay: DayKey }
  | { type: "unschedule_block"; blockId: string; day: DayKey };

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
  const [selectedDay, setSelectedDay] = useState<DayKey>("mon");
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

  const dayTotals = useMemo(
    () =>
      DAY_ORDER.reduce(
        (totals, day) => ({
          ...totals,
          [day]: sumHours(plan.blocks[day]),
        }),
        {} as Record<DayKey, number>,
      ),
    [plan.blocks],
  );

  const handleAddGoal = (text: string) => {
    void (async () => {
      const goal = await planActions.addGoal(text);
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

  const handleSchedule = (itemId: string, day: DayKey) => {
    void (async () => {
      await planActions.scheduleItem(itemId, day);
      dispatch({ type: "schedule_item", itemId, day });
      setMobileTab("plan");
      setSelectedDay(day);
    })();
  };

  const handleMoveBlock = (blockId: string, fromDay: DayKey, toDay: DayKey) => {
    void (async () => {
      await planActions.moveBlock(blockId, fromDay, toDay);
      dispatch({ type: "move_block", blockId, fromDay, toDay });
      setSelectedDay(toDay);
    })();
  };

  const handleUnschedule = (blockId: string, day: DayKey) => {
    void (async () => {
      await planActions.unscheduleBlock(blockId, day);
      dispatch({ type: "unschedule_block", blockId, day });
    })();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const overId = event.over?.id;
    if (!overId || typeof overId !== "string" || !overId.startsWith("day:")) return;

    const day = overId.replace("day:", "") as DayKey;
    if (!DAY_ORDER.includes(day)) return;

    const data = event.active.data.current;
    if (data?.kind === "item" && typeof data.itemId === "string") {
      handleSchedule(data.itemId, day);
    }

    if (
      data?.kind === "block" &&
      typeof data.blockId === "string" &&
      DAY_ORDER.includes(data.fromDay as DayKey)
    ) {
      handleMoveBlock(data.blockId, data.fromDay as DayKey, day);
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
                  items={plan.backlog}
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
              <WeekBoard plan={plan} onUnschedule={handleUnschedule} />
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
            backlogCount={plan.backlog.length}
            goalsCount={plan.goals.filter((goal) => !goal.done).length}
            onChange={setMobileTab}
          />
        </div>
        <MobileBoard
          plan={plan}
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
      return { ...plan, backlog: [action.item, ...plan.backlog] };
    case "delete_item":
      return {
        ...plan,
        backlog: plan.backlog.filter((item) => item.id !== action.id),
      };
    case "schedule_item": {
      const item = plan.backlog.find((backlogItem) => backlogItem.id === action.itemId);
      if (!item) return plan;

      const block = {
        id: uid("block"),
        title: item.title,
        category: item.category,
        type: item.type,
        priority: item.priority,
        duration: item.duration,
        scheduledAt: scheduledDate(plan.weekOf, action.day),
      };

      return {
        ...plan,
        backlog: plan.backlog.filter((backlogItem) => backlogItem.id !== action.itemId),
        blocks: {
          ...plan.blocks,
          [action.day]: [...plan.blocks[action.day], block],
        },
      };
    }
    case "move_block": {
      if (action.fromDay === action.toDay) return plan;

      const block = plan.blocks[action.fromDay].find(
        (scheduledBlock) => scheduledBlock.id === action.blockId,
      );
      if (!block) return plan;

      return {
        ...plan,
        blocks: {
          ...plan.blocks,
          [action.fromDay]: plan.blocks[action.fromDay].filter(
            (scheduledBlock) => scheduledBlock.id !== action.blockId,
          ),
          [action.toDay]: [
            ...plan.blocks[action.toDay],
            { ...block, scheduledAt: scheduledDate(plan.weekOf, action.toDay) },
          ],
        },
      };
    }
    case "unschedule_block": {
      const block = plan.blocks[action.day].find(
        (scheduledBlock) => scheduledBlock.id === action.blockId,
      );
      if (!block) return plan;

      const item: PlanningItem = {
        id: uid("item"),
        title: block.title,
        category: block.category,
        type: block.type,
        priority: block.priority,
        duration: block.duration,
        createdAt: new Date().toISOString(),
      };

      return {
        ...plan,
        backlog: [item, ...plan.backlog],
        blocks: {
          ...plan.blocks,
          [action.day]: plan.blocks[action.day].filter(
            (scheduledBlock) => scheduledBlock.id !== action.blockId,
          ),
        },
      };
    }
    default:
      return plan;
  }
}

function scheduledDate(weekOf: string, day: DayKey): string {
  const date = new Date(`${weekOf}T00:00:00`);
  date.setDate(date.getDate() + DAY_ORDER.indexOf(day));
  return date.toISOString().slice(0, 10);
}
