type Priority = "low" | "medium" | "high" | "urgent";

type PriorityBadgeProps = {
  priority?: Priority;
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  if (!priority) {
    return null;
  }

  const priorityStyles: Record<Priority, string> = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    urgent: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  };

  const priorityLabels: Record<Priority, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyles[priority]}`}
      role="status"
      aria-label={`Priority: ${priorityLabels[priority]}`}
    >
      {priorityLabels[priority]}
    </span>
  );
}
