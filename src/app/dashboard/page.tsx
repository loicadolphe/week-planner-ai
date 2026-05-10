"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { WeeklyGoals } from "@/components/planning/WeeklyGoals";
import { PlanningItemList } from "@/components/planning/PlanningItemList";
import { WeekPlanBoard } from "@/components/planning/WeekPlanBoard";
import { mockGoals, mockPlanningItems, mockWeekPlan } from "@/lib/planning/mock-data";
import type { Goal, PlanningItem, WeekPlan } from "@/types/planning";

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [planningItems, setPlanningItems] = useState<PlanningItem[]>(mockPlanningItems);
  const [weekPlan, setWeekPlan] = useState<WeekPlan>(mockWeekPlan);

  const handleAddGoal = (goal: Goal) => {
    setGoals([...goals, goal]);
  };

  const handleAddPlanningItem = (item: PlanningItem) => {
    setPlanningItems([...planningItems, item]);
  };

  const handleScheduleItem = (itemId: string, day: keyof WeekPlan) => {
    const item = planningItems.find((i) => i.id === itemId);
    if (!item) return;

    const newBlock = {
      id: `block-${Date.now()}`,
      title: item.title,
      planningItemId: item.id,
      estimateMinutes: item.estimateMinutes || 60,
      day,
    };

    setWeekPlan({
      ...weekPlan,
      [day]: [...weekPlan[day], newBlock],
    });
  };

  const handleMoveBlock = (blockId: string, fromDay: keyof WeekPlan, toDay: keyof WeekPlan) => {
    const block = weekPlan[fromDay].find((b) => b.id === blockId);
    if (!block) return;

    const updatedBlock = { ...block, day: toDay };
    
    setWeekPlan({
      ...weekPlan,
      [fromDay]: weekPlan[fromDay].filter((b) => b.id !== blockId),
      [toDay]: [...weekPlan[toDay], updatedBlock],
    });
  };

  const handleRemoveBlock = (blockId: string, day: keyof WeekPlan) => {
    setWeekPlan({
      ...weekPlan,
      [day]: weekPlan[day].filter((b) => b.id !== blockId),
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyGoals goals={goals} onAddGoal={handleAddGoal} />
          <PlanningItemList 
            items={planningItems} 
            onAddItem={handleAddPlanningItem}
            onScheduleItem={handleScheduleItem}
          />
        </div>
        <WeekPlanBoard 
          weekPlan={weekPlan} 
          onMoveBlock={handleMoveBlock}
          onRemoveBlock={handleRemoveBlock}
        />
      </div>
    </AppShell>
  );
}
