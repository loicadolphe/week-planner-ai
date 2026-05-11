"use client";

import { useState } from "react";
import type { Category, PlanningItem, PlanningItemType } from "@/types/planning";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [category, setCategory] = useState<Category | "none">("work");
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
      category: category === "none" ? undefined : category,
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
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as Category | "none")}
        >
          <SelectTrigger 
            className="planner-input h-auto"
            aria-label="Category"
          >
            <SelectValue placeholder="No category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No category</SelectItem>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={type}
          onValueChange={(value) => setType(value as PlanningItemType)}
        >
          <SelectTrigger 
            className="planner-input h-auto"
            aria-label="Type"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-[1fr_92px_auto] gap-2">
        <Select
          value={priority}
          onValueChange={(value) => setPriority(value as Priority)}
        >
          <SelectTrigger 
            className="planner-input h-auto"
            aria-label="Priority"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
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
