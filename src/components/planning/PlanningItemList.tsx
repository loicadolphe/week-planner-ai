import type { PlanningItem } from "@/types/planning";

interface PlanningItemListProps {
  items: PlanningItem[];
}

export function PlanningItemList({ items }: PlanningItemListProps) {
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
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
        Planning Items
      </h2>
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
            <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              {item.estimateMinutes && (
                <span>Estimate: {formatEstimate(item.estimateMinutes)}</span>
              )}
              {item.dueDate && (
                <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
