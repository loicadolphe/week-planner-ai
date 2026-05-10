import { DAY_CAPACITY_HOURS, capacityState } from "@/lib/capacity";
import { fmtDuration } from "@/lib/format";

const stateLabels = {
  open: "Open",
  light: "Light",
  balanced: "Balanced",
  full: "Full",
  overloaded: "Overloaded",
} as const;

interface CapacityIndicatorProps {
  planned: number;
  compact?: boolean;
}

export function CapacityIndicator({ planned, compact = false }: CapacityIndicatorProps) {
  const capacity = DAY_CAPACITY_HOURS;
  const { state, ratio } = capacityState(planned, capacity);
  const available = Math.max(capacity - planned, 0);
  const overBy = Math.max(planned - capacity, 0);
  const fillWidth = `${Math.min(ratio, 1) * 100}%`;
  const overflowWidth = ratio > 1 ? `${Math.min(((ratio - 1) / ratio) * 100, 100)}%` : "0%";
  const isOverloaded = state === "overloaded";

  return (
    <div className={compact ? "space-y-1.5" : "space-y-2"}>
      <div className="flex items-center justify-between gap-3">
        <span
          className="text-[11px] font-[540]"
          style={{ color: isOverloaded ? "var(--warn-2)" : "var(--ink-2)" }}
        >
          {stateLabels[state]}
        </span>
        <span className="mono text-[11px]" style={{ color: "var(--ink-3)" }}>
          {fmtDuration(planned)} planned of {fmtDuration(capacity)}
        </span>
      </div>
      <div className="capacity-bar" aria-hidden>
        <div className={`capacity-fill ${state}`} style={{ width: fillWidth }} />
        {isOverloaded ? (
          <div className="capacity-overflow" style={{ width: overflowWidth }} />
        ) : null}
      </div>
      {!compact ? (
        <div
          className="mono text-[11px]"
          style={{ color: isOverloaded ? "var(--warn-2)" : "var(--ink-3)" }}
        >
          {isOverloaded
            ? `Over by ${fmtDuration(overBy)}`
            : `${fmtDuration(available)} available`}
        </div>
      ) : null}
    </div>
  );
}
