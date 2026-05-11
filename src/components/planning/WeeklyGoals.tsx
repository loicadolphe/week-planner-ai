"use client";

import { useState } from "react";
import type { Goal } from "@/types/planning";

interface WeeklyGoalsProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
}

export function WeeklyGoals({ goals, onAddGoal }: WeeklyGoalsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
    };

    onAddGoal(newGoal);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setIsAdding(false);
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setIsAdding(false);
  };
  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Weekly Goals
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Add Goal
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-700/30">
          <div className="space-y-3">
            <div>
              <label htmlFor="goal-title" className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">
                Title *
              </label>
              <input
                id="goal-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter goal title"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="goal-description" className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">
                Description
              </label>
              <textarea
                id="goal-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description (optional)"
              />
            </div>
            <div>
              <label htmlFor="goal-priority" className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">
                Priority
              </label>
              <select
                id="goal-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Add Goal
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-medium text-zinc-900 dark:text-white mb-1">
                  {goal.title}
                </h3>
                {goal.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {goal.description}
                  </p>
                )}
              </div>
              {goal.priority && (
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[goal.priority]}`}
                >
                  {goal.priority}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
