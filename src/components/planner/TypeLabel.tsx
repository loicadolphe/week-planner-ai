import type { PlanningItemType } from "@/types/planning";

const typeLabels: Record<PlanningItemType, string> = {
  task: "Task",
  project: "Project",
  meeting_prep: "Meeting prep",
  follow_up: "Follow up",
  decision: "Decision",
  review: "Review",
  stakeholder_update: "Stakeholder update",
  personal: "Personal",
  other: "Other",
};

interface TypeLabelProps {
  type: PlanningItemType;
}

export function TypeLabel({ type }: TypeLabelProps) {
  return <span>{typeLabels[type]}</span>;
}
