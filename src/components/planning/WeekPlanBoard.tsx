import type { WeekPlan, WeekDay, PlanningTask } from "@/types/planning";

interface WeekPlanBoardProps {
  weekPlan: WeekPlan;
}

const weekDays: { key: WeekDay; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
];

export function WeekPlanBoard({ weekPlan }: WeekPlanBoardProps) {
  const getTotalHours = (tasks: PlanningTask[]) => {
    return tasks.reduce((sum, task) => sum + task.estimateHours, 0);
  };

  const sourceColors = {
    goal: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    linear: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
        Week Plan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {weekDays.map(({ key, label }) => {
          const tasks = weekPlan[key];
          const totalHours = getTotalHours(tasks);

          return (
            <div
              key={key}
              className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-700/30"
            >
              <div className="mb-3">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {label}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {totalHours}h planned
                </p>
              </div>
              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                    No tasks planned
                  </p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded shadow-sm"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${sourceColors[task.source]}`}
                        >
                          {task.source}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white mb-1">
                        {task.title}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        {task.estimateHours}h
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
