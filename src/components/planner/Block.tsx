"use client";

import { useDraggable } from "@dnd-kit/core";
import type { DayKey, ScheduledBlock } from "@/types/planner";
import { fmtDuration } from "@/lib/format";
import { CategoryMark, categoryClass } from "./CategoryMark";
import { PriorityDot } from "./PriorityDot";
import { TypeLabel } from "./TypeLabel";

interface BlockProps {
  block: ScheduledBlock;
  day: DayKey;
  onUnschedule: (blockId: string, day: DayKey) => void;
  draggable?: boolean;
}

export function Block({ block, day, onUnschedule, draggable = true }: BlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `block:${block.id}`,
    data: { kind: "block", blockId: block.id, fromDay: day },
    disabled: !draggable,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <article
      ref={setNodeRef}
      className={`relative rounded-[10px] border bg-white px-3 py-3 shadow-sm transition-colors ${categoryClass(
        block.category,
      )} ${isDragging ? "z-30 opacity-70" : ""}`}
      style={{
        ...style,
        borderColor: "var(--line)",
      }}
      {...(draggable ? attributes : {})}
      {...(draggable ? listeners : {})}
    >
      {block.category ? (
        <span
          aria-hidden
          className="category-rail rounded-r-full"
          style={{ background: "var(--cat-color)" }}
        />
      ) : null}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-[12.5px] font-[540] leading-snug" style={{ color: "var(--ink-1)" }}>
            {block.title}
          </h4>
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px]" style={{ color: "var(--ink-3)" }}>
            <span className="mono">{fmtDuration(block.duration)}</span>
            <TypeLabel type={block.type} />
            <PriorityDot priority={block.priority} />
            <CategoryMark category={block.category} />
          </div>
        </div>
        <button
          type="button"
          aria-label={`Return ${block.title} to backlog`}
          className="rounded-md px-1.5 py-0.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]"
          style={{ color: "var(--ink-4)" }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onUnschedule(block.id, day);
          }}
        >
          ✕
        </button>
      </div>
    </article>
  );
}
