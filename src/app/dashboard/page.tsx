import { AppShell } from "@/components/layout/AppShell";
import { WeeklyGoals } from "@/components/planning/WeeklyGoals";
import { PlanningItemList } from "@/components/planning/PlanningItemList";
import { WeekPlanBoard } from "@/components/planning/WeekPlanBoard";
import { mockGoals, mockPlanningItems, mockWeekPlan } from "@/lib/planning/mock-data";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyGoals goals={mockGoals} />
          <PlanningItemList items={mockPlanningItems} />
        </div>
        <WeekPlanBoard weekPlan={mockWeekPlan} />
      </div>
    </AppShell>
  );
}
