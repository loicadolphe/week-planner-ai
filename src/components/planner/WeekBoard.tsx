import type { DayKey, WeekPlan } from "@/types/planner";
import { DAY_ORDER } from "@/lib/format";
import { DayColumn } from "./DayColumn";

interface WeekBoardProps {
  plan: WeekPlan;
  onUnschedule: (blockId: string, day: DayKey) => void;
}

export function WeekBoard({ plan, onUnschedule }: WeekBoardProps) {
  return (
    <section className="planner-card p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-[540] tracking-[-0.005em]" style={{ color: "var(--ink-1)" }}>
            Week plan
          </h2>
          <p className="mt-1 text-[12px]" style={{ color: "var(--ink-3)" }}>
            Monday to Friday, capacity balanced at 6h 30m per day.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {DAY_ORDER.map((day) => (
          <DayColumn
            key={day}
            day={day}
            blocks={plan.blocks[day]}
            weekOf={plan.weekOf}
            onUnschedule={onUnschedule}
          />
        ))}
      </div>
    </section>
  );
}
