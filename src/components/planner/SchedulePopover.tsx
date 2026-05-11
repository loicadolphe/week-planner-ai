import type { WeekDay, PlanningItem } from "@/types/planning";
import { DAY_CAPACITY_HOURS } from "@/lib/capacity";
import { DAY_ORDER, DAY_SHORT_LABELS, fmtDuration } from "@/lib/format";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface SchedulePopoverProps {
  item: PlanningItem;
  dayTotals: Record<WeekDay, number>;
  onSchedule: (itemId: string, day: WeekDay) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SchedulePopover({
  item,
  dayTotals,
  onSchedule,
  open,
  onOpenChange,
}: SchedulePopoverProps) {
  const itemMinutes = item.estimateMinutes || 60;
  
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-md px-2 py-1 text-[11px] font-[540] transition-colors hover:bg-[var(--surface-2)]"
          style={{ color: "var(--accent)" }}
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          Schedule
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[330px] rounded-[14px] border bg-white p-3 shadow-xl shadow-black/10" 
        style={{ borderColor: "var(--line)" }}
        align="end"
      >
        <div className="schedule-serif mb-2 text-[15px]" style={{ color: "var(--ink-1)" }}>
          Schedule
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {DAY_ORDER.map((day) => {
            const plannedMinutes = dayTotals[day];
            const projectedMinutes = plannedMinutes + itemMinutes;
            const willOverload = (projectedMinutes / 60) > DAY_CAPACITY_HOURS;

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
                  {fmtDuration(plannedMinutes)} + {fmtDuration(itemMinutes)}
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
      </PopoverContent>
    </Popover>
  );
}
