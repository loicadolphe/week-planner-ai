import type { Priority } from "@/types/planner";

const priorityCopy: Record<Priority, string> = {
  low: "Low",
  med: "Med",
  high: "High",
};

const priorityColor: Record<Priority, string> = {
  low: "var(--ink-4)",
  med: "var(--accent)",
  high: "var(--warn)",
};

interface PriorityDotProps {
  priority: Priority;
}

export function PriorityDot({ priority }: PriorityDotProps) {
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
