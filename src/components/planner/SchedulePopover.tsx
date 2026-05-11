import type { DayKey, PlanningItem } from "@/types/planner";
import { DAY_CAPACITY_HOURS } from "@/lib/capacity";
import { DAY_ORDER, DAY_SHORT_LABELS, fmtDuration } from "@/lib/format";

interface SchedulePopoverProps {
  item: PlanningItem;
  dayTotals: Record<DayKey, number>;
  onSchedule: (itemId: string, day: DayKey) => void;
}

export function SchedulePopover({
  item,
  dayTotals,
  onSchedule,
}: SchedulePopoverProps) {
  return (
    <div className="absolute right-3 top-10 z-20 w-[330px] rounded-[14px] border bg-white p-3 shadow-xl shadow-black/10" style={{ borderColor: "var(--line)" }}>
      <div className="schedule-serif mb-2 text-[15px]" style={{ color: "var(--ink-1)" }}>
        Schedule
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {DAY_ORDER.map((day) => {
          const planned = dayTotals[day];
          const projected = planned + item.duration;
          const willOverload = projected > DAY_CAPACITY_HOURS;

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSchedule(item.id, day)}
              className={`rounded-[10px] border px-1.5 py-2 text-left transition-colors hover:bg-[var(--surface-2)] ${
                willOverload ? "is-warn" : ""
              }`}
              style={{
                borderColor: willOverload ? "var(--warn-line)" : "var(--line)",
                background: willOverload ? "var(--warn-bg)" : "var(--surface)",
              }}
            >
              <span className="block text-[11px] font-[540]" style={{ color: "var(--ink-2)" }}>
                {DAY_SHORT_LABELS[day]}
              </span>
              <span className="mono mt-1 block text-[10px]" style={{ color: "var(--ink-3)" }}>
                {fmtDuration(planned)} + {fmtDuration(item.duration)}
              </span>
              {willOverload ? (
                <span className="mt-1 block text-[9.5px] font-[540]" style={{ color: "var(--warn-2)" }}>
                  Will overload
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
