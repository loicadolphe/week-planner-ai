import type { Category } from "@/types/planning";

export const categoryLabels: Record<Category, string> = {
  work: "Work",
  personal: "Personal",
  errands: "Errands",
  wellbeing: "Wellbeing",
};

export const categoryOrder: Category[] = [
  "work",
  "personal",
  "errands",
  "wellbeing",
];

interface CategoryMarkProps {
  category?: Category;
}

export function categoryClass(category?: Category): string {
  return category ? `cat-${category}` : "";
}

export function CategoryMark({ category }: CategoryMarkProps) {
  if (!category) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${categoryClass(category)}`}
      style={{ color: "var(--cat-text)" }}
    >
      <span
        aria-hidden
        className="h-[6px] w-[6px] rounded-full"
        style={{ background: "var(--cat-color)" }}
      />
      {categoryLabels[category]}
    </span>
  );
}
