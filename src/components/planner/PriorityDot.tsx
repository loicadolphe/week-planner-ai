type Priority = "low" | "medium" | "high" | "urgent";

const priorityCopy: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const priorityColor: Record<Priority, string> = {
  low: "var(--ink-4)",
  medium: "var(--accent)",
  high: "var(--warn)",
  urgent: "var(--warn)",
};

interface PriorityDotProps {
  priority?: Priority;
}

export function PriorityDot({ priority }: PriorityDotProps) {
  if (!priority) return null;
  
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className="h-[6px] w-[6px] rounded-full"
        style={{ background: priorityColor[priority] }}
      />
      {priorityCopy[priority]}
    </span>
  );
}
