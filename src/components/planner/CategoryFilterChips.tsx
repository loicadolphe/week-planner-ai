import type { Category } from "@/types/planning";
import { categoryLabels, categoryOrder } from "./CategoryMark";

export type CategoryFilter = Category | "all";

interface CategoryFilterChipsProps {
  availableCategories: Category[];
  selected: CategoryFilter;
  onSelect: (filter: CategoryFilter) => void;
}

export function CategoryFilterChips({
  availableCategories,
  selected,
  onSelect,
}: CategoryFilterChipsProps) {
  const available = new Set(availableCategories);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className={`chip ${selected === "all" ? "is-active" : ""}`}
        onClick={() => onSelect("all")}
      >
        All
      </button>
      {categoryOrder
        .filter((category) => available.has(category))
        .map((category) => (
          <button
            key={category}
            type="button"
            className={`chip ${selected === category ? "is-active" : ""}`}
            onClick={() => onSelect(category)}
          >
            {categoryLabels[category]}
          </button>
        ))}
    </div>
  );
}
