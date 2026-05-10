import type { DayKey, WeekPlan } from "@/types/planner";
import { DAY_ORDER, DAY_SHORT_LABELS, sumHours } from "@/lib/format";
import { DAY_CAPACITY_HOURS, capacityState } from "@/lib/capacity";

interface DayStripProps {
  plan: WeekPlan;
  selectedDay: DayKey;
  onSelectDay: (day: DayKey) => void;
}

export function DayStrip({ plan, selectedDay, onSelectDay }: DayStripProps) {
  return (
    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
      {DAY_ORDER.map((day) => {
        const planned = sumHours(plan.blocks[day]);
        const { state, ratio } = capacityState(planned);
        const isSelected = day === selectedDay;

        return (
          <button
            key={day}
            type="button"
            className="min-w-[74px] rounded-full border px-3 py-2 text-left transition-colors"
            style={{
              background: isSelected ? "var(--ink-1)" : "var(--surface)",
              borderColor: isSelected ? "var(--ink-1)" : "var(--line)",
              color: isSelected ? "var(--surface)" : "var(--ink-2)",
            }}
            onClick={() => onSelectDay(day)}
          >
            <span className="block text-[12px] font-[540]">{DAY_SHORT_LABELS[day]}</span>
            <span className="capacity-bar mt-2 block bg-[var(--line-soft)]">
              <span
                className={`capacity-fill block ${state}`}
                style={{ width: `${Math.min(ratio, 1) * 100}%` }}
              />
              {state === "overloaded" ? (
                <span
                  className="capacity-overflow block"
                  style={{
                    width: `${Math.min(((ratio - 1) / ratio) * 100, 100)}%`,
                  }}
                />
              ) : null}
            </span>
            <span className="mono mt-1 block text-[10px]" style={{ color: isSelected ? "var(--ink-5)" : "var(--ink-3)" }}>
              {planned}/{DAY_CAPACITY_HOURS}h
            </span>
          </button>
        );
      })}
    </div>
  );
}
