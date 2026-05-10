"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { DayKey, PlanningItem } from "@/types/planner";
import { fmtDuration } from "@/lib/format";
import { CategoryMark, categoryClass } from "./CategoryMark";
import { PriorityDot } from "./PriorityDot";
import { SchedulePopover } from "./SchedulePopover";
import { TypeLabel } from "./TypeLabel";

interface ItemProps {
  item: PlanningItem;
  dayTotals: Record<DayKey, number>;
  onSchedule: (itemId: string, day: DayKey) => void;
  onDelete: (itemId: string) => void;
}

export function Item({ item, dayTotals, onSchedule, onDelete }: ItemProps) {
  const [isScheduling, setIsScheduling] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `item:${item.id}`,
    data: { kind: "item", itemId: item.id },
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const handleSchedule = (itemId: string, day: DayKey) => {
    onSchedule(itemId, day);
    setIsScheduling(false);
  };

  return (
    <article
      ref={setNodeRef}
      className={`relative rounded-[10px] border bg-white px-3 py-3 shadow-sm transition-colors ${categoryClass(
        item.category,
      )} ${isDragging ? "z-30 opacity-70" : ""}`}
      style={{
        ...style,
        borderColor: "var(--line)",
      }}
      {...attributes}
      {...listeners}
    >
      {item.category ? (
        <span
          aria-hidden
          className="category-rail rounded-r-full"
          style={{ background: "var(--cat-color)" }}
        />
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[13.5px] font-[540] leading-snug" style={{ color: "var(--ink-1)" }}>
            {item.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]" style={{ color: "var(--ink-3)" }}>
            <span className="mono">{fmtDuration(item.duration)}</span>
            <TypeLabel type={item.type} />
            <PriorityDot priority={item.priority} />
            <CategoryMark category={item.category} />
          </div>
        </div>
        <div className="relative flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="rounded-md px-2 py-1 text-[11px] font-[540] transition-colors hover:bg-[var(--surface-2)]"
            style={{ color: "var(--accent)" }}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              setIsScheduling((current) => !current);
            }}
          >
            Schedule
          </button>
          <button
            type="button"
            aria-label={`Delete ${item.title}`}
            className="rounded-md px-1.5 py-1 text-[12px] transition-colors hover:bg-[var(--surface-2)]"
            style={{ color: "var(--ink-4)" }}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(item.id);
            }}
          >
            x
          </button>
          {isScheduling ? (
            <SchedulePopover
              item={item}
              dayTotals={dayTotals}
              onSchedule={handleSchedule}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
