import type { WeekPlan, WeekDay, ScheduledBlock } from "@/types/planning";

interface WeekPlanBoardProps {
  weekPlan: WeekPlan;
  onMoveBlock?: (blockId: string, fromDay: WeekDay, toDay: WeekDay) => void;
  onRemoveBlock?: (blockId: string, day: WeekDay) => void;
}

const weekDays: { key: WeekDay; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
];

export function WeekPlanBoard({ weekPlan, onMoveBlock, onRemoveBlock }: WeekPlanBoardProps) {
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

  const isOverloaded = (minutes: number) => {
    return minutes > 480;
  };

  const handleMoveBlock = (blockId: string, fromDay: WeekDay, toDay: WeekDay) => {
    if (fromDay === toDay || !onMoveBlock) return;
    onMoveBlock(blockId, fromDay, toDay);
  };

  const handleRemoveBlock = (blockId: string, day: WeekDay) => {
    if (!onRemoveBlock) return;
    onRemoveBlock(blockId, day);
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
        Week Plan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {weekDays.map(({ key, label }) => {
          const blocks = weekPlan.scheduledBlocks[key] || [];
          const totalMinutes = getTotalMinutes(blocks);
          const overloaded = isOverloaded(totalMinutes);

          return (
            <div
              key={key}
              className={`border rounded-lg p-4 ${
                overloaded
                  ? 'border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-700/30'
              }`}
            >
              <div className="mb-3">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {label}
                </h3>
                <p className={`text-sm ${
                  overloaded 
                    ? 'text-amber-700 dark:text-amber-400 font-medium' 
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}>
                  {formatMinutes(totalMinutes)} planned
                  {overloaded && ' ⚠️'}
                </p>
              </div>
              <div className="space-y-2">
                {blocks.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                    No blocks scheduled
                  </p>
                ) : (
                  blocks.map((block) => {
                    const item = weekPlan.planningItems.find(i => i.id === block.planningItemId);
                    const timeRange = formatTimeRange(block.startTime, block.endTime);
                    
                    if (!item) return null;
                    
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
                          {item.title}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                          {formatMinutes(block.estimateMinutes)}
                        </p>
                        
                        <div className="flex gap-2 mt-2">
                          <select
                            value={key}
                            onChange={(e) => handleMoveBlock(block.id, key, e.target.value as WeekDay)}
                            className="flex-1 text-xs px-2 py-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Move to day"
                          >
                            {weekDays.map(({ key: dayKey, label: dayLabel }) => (
                              <option key={dayKey} value={dayKey}>
                                {dayLabel}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleRemoveBlock(block.id, key)}
                            className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 rounded hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                            title="Remove block"
                          >
                            ✕
                          </button>
                        </div>
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
