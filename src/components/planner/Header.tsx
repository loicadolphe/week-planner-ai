import { formatWeekLabel, formatWeekNumber } from "@/lib/format";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  weekOf: string;
  showCategoryBars: boolean;
  onToggleCategoryBars: () => void;
}

export function Header({
  weekOf,
  showCategoryBars,
  onToggleCategoryBars,
}: HeaderProps) {
  return (
    <header className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-5 py-5">
      <div>
        <div className="mono text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--ink-3)" }}>
          {formatWeekNumber(weekOf)}
        </div>
        <div className="mt-1 flex items-baseline gap-3">
          <h1 className="text-[22px] font-[540] tracking-[-0.005em]" style={{ color: "var(--ink-1)" }}>
            Week Planner AI
          </h1>
          <span className="text-[14.5px]" style={{ color: "var(--ink-3)" }}>
            {formatWeekLabel(weekOf)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="planner-button secondary h-9 w-9 px-0" type="button" aria-label="Previous week">
          ‹
        </button>
        <button className="planner-button secondary" type="button">
          This week
        </button>
        <button className="planner-button secondary h-9 w-9 px-0" type="button" aria-label="Next week">
          ›
        </button>
        <button
          className={`planner-button ${showCategoryBars ? "secondary" : ""}`}
          type="button"
          onClick={onToggleCategoryBars}
          aria-pressed={showCategoryBars}
        >
          Category bars
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
