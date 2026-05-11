import { startOfWeek, formatISO } from "date-fns";
import type { WeekPlan, PlanningItem, ScheduledBlock } from "@/types/planning";

const monday = startOfWeek(new Date("2026-05-10T12:00:00"), { weekStartsOn: 1 });
const weekOf = formatISO(monday, { representation: "date" });

const planningItems: PlanningItem[] = [
  // Backlog items
  {
    id: "item-1",
    title: "Draft stakeholder update",
    category: "work",
    type: "stakeholder_update",
    source: "manual",
    priority: "high",
    estimateMinutes: 60,
  },
  {
    id: "item-2",
    title: "Review onboarding notes",
    category: "work",
    type: "review",
    source: "manual",
    priority: "medium",
    estimateMinutes: 90,
  },
  {
    id: "item-3",
    title: "Book annual health check",
    category: "personal",
    type: "personal",
    source: "manual",
    priority: "low",
    estimateMinutes: 30,
  },
  {
    id: "item-4",
    title: "Pick up framing order",
    category: "errands",
    type: "other",
    source: "manual",
    priority: "medium",
    estimateMinutes: 45,
  },
  {
    id: "item-5",
    title: "Long run planning",
    category: "wellbeing",
    type: "personal",
    source: "manual",
    priority: "low",
    estimateMinutes: 60,
  },
  // Scheduled items
  {
    id: "item-6",
    title: "Milestone 1 implementation pass",
    category: "work",
    type: "project",
    source: "manual",
    priority: "high",
    estimateMinutes: 180,
  },
  {
    id: "item-7",
    title: "Design review notes",
    category: "work",
    type: "review",
    source: "manual",
    priority: "medium",
    estimateMinutes: 90,
  },
  {
    id: "item-8",
    title: "Customer interview synthesis",
    category: "work",
    type: "review",
    source: "manual",
    priority: "high",
    estimateMinutes: 120,
  },
  {
    id: "item-9",
    title: "Grocery run",
    category: "errands",
    type: "other",
    source: "manual",
    priority: "low",
    estimateMinutes: 60,
  },
  {
    id: "item-10",
    title: "Roadmap tradeoff memo",
    category: "work",
    type: "decision",
    source: "manual",
    priority: "high",
    estimateMinutes: 210,
  },
  {
    id: "item-11",
    title: "Follow up with design partners",
    category: "work",
    type: "follow_up",
    source: "manual",
    priority: "medium",
    estimateMinutes: 60,
  },
  {
    id: "item-12",
    title: "Evening reset",
    category: "wellbeing",
    type: "personal",
    source: "manual",
    priority: "low",
    estimateMinutes: 60,
  },
  {
    id: "item-13",
    title: "Architecture review prep",
    category: "work",
    type: "meeting_prep",
    source: "manual",
    priority: "high",
    estimateMinutes: 135,
  },
  {
    id: "item-14",
    title: "Quarterly planning workshop",
    category: "work",
    type: "project",
    source: "manual",
    priority: "high",
    estimateMinutes: 285,
  },
  {
    id: "item-15",
    title: "Weekly review and next actions",
    category: "work",
    type: "review",
    source: "manual",
    priority: "medium",
    estimateMinutes: 90,
  },
  {
    id: "item-16",
    title: "Family dinner logistics",
    category: "personal",
    type: "personal",
    source: "manual",
    priority: "medium",
    estimateMinutes: 60,
  },
];

const scheduledBlocks: Record<string, ScheduledBlock[]> = {
  monday: [
    {
      id: "block-1",
      planningItemId: "item-6",
      day: "monday",
      estimateMinutes: 180,
    },
    {
      id: "block-2",
      planningItemId: "item-7",
      day: "monday",
      estimateMinutes: 90,
    },
  ],
  tuesday: [
    {
      id: "block-3",
      planningItemId: "item-8",
      day: "tuesday",
      estimateMinutes: 120,
    },
    {
      id: "block-4",
      planningItemId: "item-9",
      day: "tuesday",
      estimateMinutes: 60,
    },
  ],
  wednesday: [
    {
      id: "block-5",
      planningItemId: "item-10",
      day: "wednesday",
      estimateMinutes: 210,
    },
    {
      id: "block-6",
      planningItemId: "item-11",
      day: "wednesday",
      estimateMinutes: 60,
    },
    {
      id: "block-7",
      planningItemId: "item-12",
      day: "wednesday",
      estimateMinutes: 60,
    },
  ],
  thursday: [
    {
      id: "block-8",
      planningItemId: "item-13",
      day: "thursday",
      estimateMinutes: 135,
    },
    {
      id: "block-9",
      planningItemId: "item-14",
      day: "thursday",
      estimateMinutes: 285,
    },
  ],
  friday: [
    {
      id: "block-10",
      planningItemId: "item-15",
      day: "friday",
      estimateMinutes: 90,
    },
    {
      id: "block-11",
      planningItemId: "item-16",
      day: "friday",
      estimateMinutes: 60,
    },
  ],
};

export const sampleWeekPlan: WeekPlan = {
  weekOf,
  goals: [
    {
      id: "goal-1",
      title: "Ship the Milestone 1 planning loop with a crisp manual workflow.",
      done: false,
    },
    {
      id: "goal-2",
      title: "Protect two focused strategy blocks for Q2 roadmap decisions.",
      done: false,
    },
    {
      id: "goal-3",
      title: "Keep one wellbeing anchor visible on the plan.",
      done: true,
    },
  ],
  planningItems,
  scheduledBlocks,
};
