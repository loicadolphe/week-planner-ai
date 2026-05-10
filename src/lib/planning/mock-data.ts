import type { Goal, LinearIssue, WeekPlan } from "@/types/planning";

export const mockGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Launch new feature for user authentication",
    description: "Complete the OAuth integration and update user flows",
    priority: "high",
  },
  {
    id: "goal-2",
    title: "Improve dashboard performance",
    description: "Optimize queries and reduce load times by 50%",
    priority: "medium",
  },
  {
    id: "goal-3",
    title: "Write technical documentation",
    description: "Document API endpoints and integration guides",
    priority: "low",
  },
];

export const mockLinearIssues: LinearIssue[] = [
  {
    id: "issue-1",
    identifier: "ENG-123",
    title: "Implement OAuth provider integration",
    status: "In Progress",
    priority: "urgent",
    estimateHours: 8,
  },
  {
    id: "issue-2",
    identifier: "ENG-124",
    title: "Add user profile settings page",
    status: "Todo",
    priority: "high",
    estimateHours: 5,
  },
  {
    id: "issue-3",
    identifier: "ENG-125",
    title: "Optimize database queries in dashboard",
    status: "In Progress",
    priority: "high",
    estimateHours: 6,
  },
  {
    id: "issue-4",
    identifier: "ENG-126",
    title: "Add caching layer for API responses",
    status: "Todo",
    priority: "medium",
    estimateHours: 4,
  },
  {
    id: "issue-5",
    identifier: "ENG-127",
    title: "Write API integration guide",
    status: "Todo",
    priority: "low",
    estimateHours: 3,
  },
  {
    id: "issue-6",
    identifier: "ENG-128",
    title: "Update authentication flow documentation",
    status: "Todo",
    priority: "low",
    estimateHours: 2,
  },
];

export const mockWeekPlan: WeekPlan = {
  monday: [
    {
      id: "task-1",
      title: "Implement OAuth provider integration",
      source: "linear",
      sourceId: "issue-1",
      estimateHours: 4,
    },
    {
      id: "task-2",
      title: "Team sync meeting",
      source: "goal",
      estimateHours: 1,
    },
  ],
  tuesday: [
    {
      id: "task-3",
      title: "Continue OAuth integration",
      source: "linear",
      sourceId: "issue-1",
      estimateHours: 4,
    },
    {
      id: "task-4",
      title: "Code review session",
      source: "goal",
      estimateHours: 2,
    },
  ],
  wednesday: [
    {
      id: "task-5",
      title: "Optimize database queries",
      source: "linear",
      sourceId: "issue-3",
      estimateHours: 6,
    },
  ],
  thursday: [
    {
      id: "task-6",
      title: "Add user profile settings page",
      source: "linear",
      sourceId: "issue-2",
      estimateHours: 5,
    },
  ],
  friday: [
    {
      id: "task-7",
      title: "Add caching layer",
      source: "linear",
      sourceId: "issue-4",
      estimateHours: 4,
    },
    {
      id: "task-8",
      title: "Weekly retrospective",
      source: "goal",
      estimateHours: 1,
    },
  ],
};
