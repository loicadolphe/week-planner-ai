"use client";

import { useState } from "react";
import type { Goal } from "@/types/planning";

interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: (title: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalsSection({
  goals,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal,
}: GoalsSectionProps) {
  const [text, setText] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddGoal(trimmed);
    setText("");
  };

  return (
    <section className="planner-card p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-[540] tracking-[-0.005em]" style={{ color: "var(--ink-1)" }}>
            Goals
          </h2>
          <p className="mt-1 text-[12px]" style={{ color: "var(--ink-3)" }}>
            Keep the week anchored to outcomes.
          </p>
        </div>
        <span className="mono rounded-full border px-2 py-0.5 text-[11px]" style={{ borderColor: "var(--line)", color: "var(--ink-3)" }}>
          {goals.filter((goal) => !goal.done).length}
        </span>
      </div>
      <form className="mb-3 flex gap-2" onSubmit={handleSubmit}>
        <input
          className="planner-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Add a weekly goal"
        />
        <button className="planner-button" type="submit">
          Add
        </button>
      </form>
      <div className="space-y-2">
        {goals.map((goal) => (
          <label
            key={goal.id}
            className="group flex items-start gap-3 rounded-[10px] border p-3 transition-colors hover:bg-[var(--surface-2)]"
            style={{ background: "var(--surface)", borderColor: "var(--line)" }}
          >
            <input
              type="checkbox"
              checked={goal.done}
              onChange={() => onToggleGoal(goal.id)}
              className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
            />
            <span
              className={`flex-1 text-[13px] leading-snug ${goal.done ? "line-through" : ""}`}
              style={{ color: goal.done ? "var(--ink-4)" : "var(--ink-2)" }}
            >
              {goal.title}
            </span>
            <button
              type="button"
              aria-label={`Delete ${goal.title}`}
              className="opacity-0 rounded-md px-1.5 text-[12px] transition-opacity group-hover:opacity-100"
              style={{ color: "var(--ink-4)" }}
              onClick={(event) => {
                event.preventDefault();
                onDeleteGoal(goal.id);
              }}
            >
              x
            </button>
          </label>
        ))}
      </div>
    </section>
  );
}
