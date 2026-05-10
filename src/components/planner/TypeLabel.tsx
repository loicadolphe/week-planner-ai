import type { PlanningType } from "@/types/planner";

const typeLabels: Record<PlanningType, string> = {
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
  type: PlanningType;
}

export function TypeLabel({ type }: TypeLabelProps) {
  return <span>{typeLabels[type]}</span>;
}
