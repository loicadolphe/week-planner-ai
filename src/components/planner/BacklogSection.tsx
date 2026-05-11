"use client";

import { useMemo } from "react";
import type { Category, DayKey, PlanningItem } from "@/types/planner";
import { AddItemForm } from "./AddItemForm";
import { CategoryFilter, CategoryFilterChips } from "./CategoryFilterChips";
import { Item } from "./Item";

interface BacklogSectionProps {
  items: PlanningItem[];
  dayTotals: Record<DayKey, number>;
  filter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
  onAddItem: (input: Omit<PlanningItem, "id" | "createdAt">) => void;
  onDeleteItem: (itemId: string) => void;
  onSchedule: (itemId: string, day: DayKey) => void;
}

export function BacklogSection({
  items,
  dayTotals,
  filter,
  onFilterChange,
  onAddItem,
  onDeleteItem,
  onSchedule,
}: BacklogSectionProps) {
  const availableCategories = useMemo(
    () =>
      Array.from(
        new Set(items.map((item) => item.category).filter(Boolean) as Category[]),
      ),
    [items],
  );
  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.category === filter);

  return (
    <aside className="planner-card flex h-full flex-col gap-4 p-4">
      <header>
        <div className="flex items-center gap-2">
          <h2 className="text-[17px] font-[540] tracking-[-0.005em]" style={{ color: "var(--ink-1)" }}>
            Backlog
          </h2>
          <span className="mono rounded-full border px-2 py-0.5 text-[11px]" style={{ borderColor: "var(--line)", color: "var(--ink-3)" }}>
            {items.length}
          </span>
        </div>
        <p className="mt-1 text-[12px]" style={{ color: "var(--ink-3)" }}>
          Unscheduled — drag onto a day to schedule.
        </p>
      </header>

      <CategoryFilterChips
        availableCategories={availableCategories}
        selected={filter}
        onSelect={onFilterChange}
      />

      <AddItemForm onAddItem={onAddItem} />

      <div className="flex flex-col gap-2">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Item
              key={item.id}
              item={item}
              dayTotals={dayTotals}
              onSchedule={onSchedule}
              onDelete={onDeleteItem}
            />
          ))
        ) : (
          <div className="rounded-[10px] border border-dashed p-6 text-center" style={{ borderColor: "var(--line)", color: "var(--ink-4)" }}>
            <p className="text-[13px] font-[540]">Nothing unscheduled</p>
            <p className="mt-1 text-[11px]">Add an item or send a block back here.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
