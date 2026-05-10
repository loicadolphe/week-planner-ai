"use client";

import type { DayKey, PlanningItem, WeekPlan } from "@/types/planner";
import { DAY_LABELS, DAY_ORDER, fmtDuration, sumHours } from "@/lib/format";
import { Block } from "../Block";
import { CapacityIndicator } from "../CapacityIndicator";
import { CategoryMark, categoryClass } from "../CategoryMark";
import { GoalsSection } from "../GoalsSection";
import { PriorityDot } from "../PriorityDot";
import { TypeLabel } from "../TypeLabel";
import { DayStrip } from "./DayStrip";
import type { MobileTab } from "./MobileTabs";

interface MobileBoardProps {
  plan: WeekPlan;
  activeTab: MobileTab;
  selectedDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  onSchedule: (itemId: string, day: DayKey) => void;
  onUnschedule: (blockId: string, day: DayKey) => void;
  onAddGoal: (text: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

export function MobileBoard({
  plan,
  activeTab,
  selectedDay,
  onSelectDay,
  onSchedule,
  onUnschedule,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal,
}: MobileBoardProps) {
  if (activeTab === "backlog") {
    return (
      <div className="space-y-2">
        {plan.backlog.map((item) => (
          <MobileBacklogItem
            key={item.id}
            item={item}
            onSchedule={onSchedule}
          />
        ))}
        {plan.backlog.length === 0 ? (
          <div className="planner-card p-6 text-center text-[13px]" style={{ color: "var(--ink-4)" }}>
            Nothing unscheduled.
          </div>
        ) : null}
      </div>
    );
  }

  if (activeTab === "goals") {
    return (
      <GoalsSection
        goals={plan.goals}
        onAddGoal={onAddGoal}
        onToggleGoal={onToggleGoal}
        onDeleteGoal={onDeleteGoal}
      />
    );
  }

  const blocks = plan.blocks[selectedDay];
  const planned = sumHours(blocks);

  return (
    <div className="space-y-4">
      <DayStrip plan={plan} selectedDay={selectedDay} onSelectDay={onSelectDay} />
      <section className="planner-card p-4">
        <header className="mb-4">
          <h2 className="text-[17px] font-[540]" style={{ color: "var(--ink-1)" }}>
            {DAY_LABELS[selectedDay]}
          </h2>
          <div className="mt-3">
            <CapacityIndicator planned={planned} />
          </div>
        </header>
        <div className="space-y-2">
          {blocks.length > 0 ? (
            blocks.map((block) => (
              <Block
                key={block.id}
                block={block}
                day={selectedDay}
                onUnschedule={onUnschedule}
                draggable={false}
              />
            ))
          ) : (
            <div className="rounded-[10px] border border-dashed p-6 text-center" style={{ borderColor: "var(--line)", color: "var(--ink-4)" }}>
              <p className="text-[13px] font-[540]">Open day</p>
              <p className="mt-1 text-[11px]">Use Backlog to schedule work.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MobileBacklogItem({
  item,
  onSchedule,
}: {
  item: PlanningItem;
  onSchedule: (itemId: string, day: DayKey) => void;
}) {
  return (
    <article
      className={`relative rounded-[10px] border bg-white p-3 ${categoryClass(item.category)}`}
      style={{ borderColor: "var(--line)" }}
    >
      {item.category ? (
        <span
          aria-hidden
          className="category-rail rounded-r-full"
          style={{ background: "var(--cat-color)" }}
        />
      ) : null}
      <h3 className="text-[13.5px] font-[540]" style={{ color: "var(--ink-1)" }}>
        {item.title}
      </h3>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]" style={{ color: "var(--ink-3)" }}>
        <span className="mono">{fmtDuration(item.duration)}</span>
        <TypeLabel type={item.type} />
        <PriorityDot priority={item.priority} />
        <CategoryMark category={item.category} />
      </div>
      <select
        className="planner-input mt-3"
        defaultValue=""
        aria-label={`Schedule ${item.title}`}
        onChange={(event) => {
          const day = event.target.value as DayKey;
          if (day) onSchedule(item.id, day);
          event.currentTarget.value = "";
        }}
      >
        <option value="" disabled>
          Schedule
        </option>
        {DAY_ORDER.map((day) => (
          <option key={day} value={day}>
            {DAY_LABELS[day]}
          </option>
        ))}
      </select>
    </article>
  );
}
