import type { Goal } from "@/types/planning";

interface WeeklyGoalsProps {
  goals: Goal[];
}

export function WeeklyGoals({ goals }: WeeklyGoalsProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
        Weekly Goals
      </h2>
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
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[goal.priority]}`}
              >
                {goal.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
