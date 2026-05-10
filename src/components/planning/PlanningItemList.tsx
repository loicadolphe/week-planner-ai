"use client";

import { useState } from "react";
import type { PlanningItem, PlanningItemType, WeekDay } from "@/types/planning";

interface PlanningItemListProps {
  items: PlanningItem[];
  onAddItem: (item: PlanningItem) => void;
  onScheduleItem: (itemId: string, day: WeekDay) => void;
}

export function PlanningItemList({ items, onAddItem, onScheduleItem }: PlanningItemListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PlanningItemType>("task");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [estimateMinutes, setEstimateMinutes] = useState("60");
  const [schedulingItemId, setSchedulingItemId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: PlanningItem = {
      id: `item-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      source: "manual",
      priority,
      estimateMinutes: parseInt(estimateMinutes) || 60,
    };

    onAddItem(newItem);
    setTitle("");
    setDescription("");
    setType("task");
    setPriority("medium");
    setEstimateMinutes("60");
    setIsAdding(false);
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setType("task");
    setPriority("medium");
    setEstimateMinutes("60");
    setIsAdding(false);
  };

  const handleSchedule = (itemId: string, day: WeekDay) => {
    onScheduleItem(itemId, day);
    setSchedulingItemId(null);
  };
  const priorityColors = {
    urgent: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  };

  const typeColors = {
    task: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    project: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    meeting_prep: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400",
    follow_up: "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400",
    decision: "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400",
    review: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
    stakeholder_update: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    personal: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
    other: "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300",
  };

  const sourceIcons = {
    manual: "✏️",
    linear: "📋",
    github: "🐙",
    calendar: "📅",
    email: "✉️",
    slack: "💬",
    notion: "📝",
    other: "📌",
  };

  const formatEstimate = (minutes?: number) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatType = (type: string) => {
    return type.replace(/_/g, " ");
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Planning Items
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Add Item
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-700/30">
          <div className="space-y-3">
            <div>
              <label htmlFor="item-title" className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">
                Title *
              </label>
              <input
                id="item-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter item title"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="item-description" className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">
                Description
              </label>
              <textarea
                id="item-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description (optional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="item-type" className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">
                  Type
                </label>
                <select
                  id="item-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as PlanningItemType)}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="task">Task</option>
                  <option value="project">Project</option>
                  <option value="meeting_prep">Meeting prep</option>
                  <option value="follow_up">Follow up</option>
                  <option value="decision">Decision</option>
                  <option value="review">Review</option>
                  <option value="stakeholder_update">Stakeholder update</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="item-priority" className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">
                  Priority
                </label>
                <select
                  id="item-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high" | "urgent")}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="item-estimate" className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">
                Estimated duration (minutes)
              </label>
              <input
                id="item-estimate"
                type="number"
                min="0"
                step="15"
                value={estimateMinutes}
                onChange={(e) => setEstimateMinutes(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="60"
              />
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
                Add Item
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm" title={item.source}>
                    {sourceIcons[item.source]}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[item.type]}`}
                  >
                    {formatType(item.type)}
                  </span>
                  {item.status && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {item.status}
                    </span>
                  )}
                  {item.externalId && (
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      {item.externalId}
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-zinc-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                )}
              </div>
              {item.priority && (
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[item.priority]}`}
                >
                  {item.priority}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-4">
                {item.estimateMinutes && (
                  <span>Estimate: {formatEstimate(item.estimateMinutes)}</span>
                )}
                {item.dueDate && (
                  <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                )}
              </div>
              <button
                onClick={() => setSchedulingItemId(schedulingItemId === item.id ? null : item.id)}
                className="px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              >
                {schedulingItemId === item.id ? "Cancel" : "Schedule"}
              </button>
            </div>
            {schedulingItemId === item.id && (
              <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Schedule to:
                </p>
                <div className="flex flex-wrap gap-2">
                  {(["monday", "tuesday", "wednesday", "thursday", "friday"] as WeekDay[]).map((day) => (
                    <button
                      key={day}
                      onClick={() => handleSchedule(item.id, day)}
                      className="px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors capitalize"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
