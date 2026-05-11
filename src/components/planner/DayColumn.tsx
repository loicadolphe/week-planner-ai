"use client";

import { useDroppable } from "@dnd-kit/core";
import type { WeekDay, ScheduledBlock, PlanningItem } from "@/types/planning";
import { capacityState } from "@/lib/capacity";
import { DAY_LABELS, DAY_ORDER, formatDayDate, sumMinutes } from "@/lib/format";
import { Block } from "./Block";
import { CapacityIndicator } from "./CapacityIndicator";

interface DayColumnProps {
  day: WeekDay;
  blocks: ScheduledBlock[];
  planningItems: PlanningItem[];
  weekOf: string;
  onUnschedule: (blockId: string, day: WeekDay) => void;
}

export function DayColumn({ day, blocks, planningItems, weekOf, onUnschedule }: DayColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `day:${day}`,
    data: { day },
  });
  const plannedMinutes = sumMinutes(blocks);
  const plannedHours = plannedMinutes / 60;
  const { state } = capacityState(plannedHours);
  const dayIndex = DAY_ORDER.indexOf(day);

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[460px] flex-col rounded-[14px] border p-3 transition-all ${
        isOver ? "day-drop-active" : ""
      } ${state === "overloaded" ? "day-overloaded" : ""}`}
      style={{ 
        background: "var(--surface)",
        borderColor: state === "overloaded" ? "var(--warn-line)" : "var(--line)" 
      }}
    >
      <header className="mb-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[13px] font-[540]" style={{ color: "var(--ink-1)" }}>
              {DAY_LABELS[day]}
            </h3>
            <p className="mono mt-0.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
              {formatDayDate(weekOf, dayIndex)}
            </p>
          </div>
          <span className="mono rounded-full border px-2 py-1 text-[10px]" style={{ borderColor: "var(--line)", color: "var(--ink-3)" }}>
            {blocks.length}
          </span>
        </div>
        <CapacityIndicator planned={plannedHours} />
      </header>

      <div className="flex flex-1 flex-col gap-2">
        {blocks.length > 0 ? (
          blocks.map((block) => (
            <Block
              key={block.id}
              block={block}
              planningItems={planningItems}
              day={day}
              onUnschedule={onUnschedule}
            />
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-[10px] border border-dashed px-3 text-center" style={{ borderColor: "var(--line)", color: "var(--ink-4)" }}>
            <div>
              <p className="text-[13px] font-[540]">Open day</p>
              <p className="mt-1 text-[11px]">Drag backlog items here.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
