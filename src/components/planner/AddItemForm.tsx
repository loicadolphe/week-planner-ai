"use client";

import { useState } from "react";
import type { Category, PlanningItem, PlanningItemType } from "@/types/planning";

type Priority = "low" | "medium" | "high";

const typeOptions: { value: PlanningItemType; label: string }[] = [
  { value: "task", label: "Task" },
  { value: "project", label: "Project" },
  { value: "meeting_prep", label: "Meeting prep" },
  { value: "follow_up", label: "Follow up" },
  { value: "decision", label: "Decision" },
  { value: "review", label: "Review" },
  { value: "stakeholder_update", label: "Stakeholder update" },
  { value: "personal", label: "Personal" },
  { value: "other", label: "Other" },
];

const categoryOptions: { value: Category; label: string }[] = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "errands", label: "Errands" },
  { value: "wellbeing", label: "Wellbeing" },
];

interface AddItemFormProps {
  onAddItem: (input: Omit<PlanningItem, "id">) => void;
}

export function AddItemForm({ onAddItem }: AddItemFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | "">("work");
  const [type, setType] = useState<PlanningItemType>("task");
  const [priority, setPriority] = useState<Priority>("medium");
  const [duration, setDuration] = useState("1");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();
    const parsedDuration = Math.max(0.25, Math.round(Number(duration || 1) * 4) / 4);

    if (!trimmed) return;

    onAddItem({
      title: trimmed,
      category: category || undefined,
      type,
      source: "manual",
      priority,
      estimateMinutes: Math.round(parsedDuration * 60),
    });

    setTitle("");
    setCategory("work");
    setType("task");
    setPriority("medium");
    setDuration("1");
  };

  return (
    <form className="planner-subcard space-y-3 p-3" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1.5 block text-[11px] font-[540]" htmlFor="item-title" style={{ color: "var(--ink-3)" }}>
          New planning item
        </label>
        <input
          id="item-title"
          className="planner-input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add something to plan"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select
          className="planner-input"
          aria-label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value as Category | "")}
        >
          <option value="">No category</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          className="planner-input"
          aria-label="Type"
          value={type}
          onChange={(event) => setType(event.target.value as PlanningItemType)}
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-[1fr_92px_auto] gap-2">
        <select
          className="planner-input"
          aria-label="Priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as Priority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          className="planner-input mono"
          aria-label="Duration in hours"
          type="number"
          min="0.25"
          step="0.25"
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
        />
        <button className="planner-button" type="submit">
          Add
        </button>
      </div>
    </form>
  );
}
