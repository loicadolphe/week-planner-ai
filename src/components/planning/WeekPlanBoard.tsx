import type { WeekPlan, WeekDay, ScheduledBlock } from "@/types/planning";

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
  const getTotalMinutes = (blocks: ScheduledBlock[]) => {
    return blocks.reduce((sum, block) => sum + block.estimateMinutes, 0);
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatTimeRange = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) return null;
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
        Week Plan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {weekDays.map(({ key, label }) => {
          const blocks = weekPlan[key];
          const totalMinutes = getTotalMinutes(blocks);

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
                  {formatMinutes(totalMinutes)} planned
                </p>
              </div>
              <div className="space-y-2">
                {blocks.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                    No blocks scheduled
                  </p>
                ) : (
                  blocks.map((block) => {
                    const timeRange = formatTimeRange(block.startTime, block.endTime);
                    
                    return (
                      <div
                        key={block.id}
                        className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded shadow-sm"
                      >
                        {timeRange && (
                          <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-1">
                            {timeRange}
                          </div>
                        )}
                        <p className="text-sm font-medium text-zinc-900 dark:text-white mb-1">
                          {block.title}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          {formatMinutes(block.estimateMinutes)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
