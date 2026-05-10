# Week Planner AI Product Model

This document defines the core product planning model for Week Planner AI. The model is designed to be **role-neutral** and **integration-agnostic**, ensuring the app can support different planning styles without being tied to any single workflow, tool, or user persona.

## Purpose

Week Planner AI helps users plan their week by:
1. Setting high-level goals for what they want to accomplish
2. Selecting specific work items to include in their week
3. Scheduling those items into realistic time blocks
4. Creating a complete weekly plan that balances goals, capacity, and existing commitments

The product model must remain flexible enough to support various roles (individual contributor, manager, founder, student, freelancer) and integrate with multiple external systems (Linear, Jira, Asana, GitHub, etc.) without favoring any particular workflow.

---

## Core Concepts

### Goal

A **Goal** represents a high-level objective or outcome the user wants to achieve during the planning period (typically one week).

**Properties:**
- `id`: Unique identifier
- `title`: Short description of what the user wants to accomplish
- `description`: Optional detailed explanation or context
- `timeframe`: The period this goal applies to (e.g., "Week of May 10, 2026")
- `status`: Current state (e.g., "active", "completed", "deferred")
- `createdAt`: When the goal was set
- `updatedAt`: When the goal was last modified

**Characteristics:**
- Goals are **user-defined**, not imported from external systems
- Goals are **outcome-focused**, not task-focused
- Goals provide **context** for selecting and prioritizing planning items
- Multiple planning items can contribute to a single goal
- A goal may span multiple weeks but is reviewed weekly

**Examples:**

| Role | Example Goal |
|------|--------------|
| **IC Engineer** | "Ship the new authentication feature" |
| **Engineering Manager** | "Unblock the team on Q2 infrastructure decisions" |
| **Founder** | "Close two pilot customers and finalize pricing" |
| **Student** | "Complete midterm studying and start final project" |
| **Freelancer** | "Deliver client website and send three proposals" |

---

### PlanningItem

A **PlanningItem** represents a specific unit of work that the user can schedule into their week. Planning items can originate from external systems (Linear, Jira, etc.) or be created directly by the user.

**Properties:**
- `id`: Unique identifier
- `title`: What needs to be done
- `description`: Optional details about the work
- `estimatedDuration`: How long the user expects this to take (in minutes)
- `priority`: User-assigned priority (e.g., "high", "medium", "low")
- `source`: Where this item came from (e.g., "linear", "manual", "github")
- `sourceId`: External identifier if imported (e.g., Linear issue ID)
- `sourceUrl`: Link to the original item in the external system
- `goalId`: Optional reference to the goal this supports
- `status`: Current state (e.g., "candidate", "selected", "scheduled", "completed")
- `metadata`: Integration-specific data (stored as JSON)
- `createdAt`: When the item was added
- `updatedAt`: When the item was last modified

**Characteristics:**
- Planning items are **actionable** and **schedulable**
- Items can be **imported** from external systems or **created manually**
- Items should be **granular enough** to schedule (typically 30 minutes to 4 hours)
- Users **select** which items to include in their week (not all items are scheduled)
- Items may need to be **broken down** by the user or AI if too large

**State Flow:**
1. **Candidate**: Item exists but hasn't been selected for this week
2. **Selected**: User has chosen to work on this item this week
3. **Scheduled**: Item has been placed into a specific time block
4. **Completed**: Work is done

**Examples:**

| Role | Source | Example Planning Item |
|------|--------|----------------------|
| **IC Engineer** | Linear | "Implement OAuth2 login flow" (3 hours) |
| **Engineering Manager** | Manual | "1:1 with Sarah" (30 minutes) |
| **Founder** | Linear | "Review legal docs for Acme Corp contract" (1 hour) |
| **Student** | Manual | "Study chapters 5-7 for midterm" (2 hours) |
| **Freelancer** | Manual | "Design homepage mockup for Client X" (4 hours) |

---

### ScheduledBlock

A **ScheduledBlock** represents a specific time slot in the user's calendar where a planning item is scheduled to be worked on.

**Properties:**
- `id`: Unique identifier
- `planningItemId`: Reference to the planning item being scheduled
- `startTime`: When the block begins (ISO 8601 datetime)
- `endTime`: When the block ends (ISO 8601 datetime)
- `duration`: Length of the block in minutes (derived from start/end)
- `date`: The date this block occurs (YYYY-MM-DD)
- `dayOfWeek`: Which day (e.g., "Monday", "Tuesday")
- `isLocked`: Whether this block can be automatically moved by AI
- `notes`: Optional user notes about this specific block
- `createdAt`: When the block was created
- `updatedAt`: When the block was last modified

**Characteristics:**
- Blocks represent **committed time** in the schedule
- Blocks are **non-overlapping** within a user's schedule
- Blocks can be **manually created** or **AI-suggested**
- Users can **lock** blocks to prevent automatic rescheduling
- Blocks respect **existing calendar commitments** (meetings, appointments)

**Examples:**

| Role | Example Scheduled Block |
|------|-------------------------|
| **IC Engineer** | Monday, May 12, 9:00 AM - 12:00 PM: "Implement OAuth2 login flow" |
| **Engineering Manager** | Tuesday, May 13, 2:00 PM - 2:30 PM: "1:1 with Sarah" |
| **Founder** | Wednesday, May 14, 10:00 AM - 11:00 AM: "Review legal docs for Acme Corp" |
| **Student** | Thursday, May 15, 7:00 PM - 9:00 PM: "Study chapters 5-7 for midterm" |
| **Freelancer** | Friday, May 16, 1:00 PM - 5:00 PM: "Design homepage mockup for Client X" |

---

### WeekPlan

A **WeekPlan** is the complete planning document for a given week, containing goals, selected planning items, and scheduled blocks.

**Properties:**
- `id`: Unique identifier
- `userId`: Who this plan belongs to
- `weekStartDate`: First day of the week (YYYY-MM-DD)
- `weekEndDate`: Last day of the week (YYYY-MM-DD)
- `goals`: List of goal IDs for this week
- `planningItems`: List of planning item IDs selected for this week
- `scheduledBlocks`: List of scheduled block IDs for this week
- `totalScheduledHours`: Sum of all scheduled block durations
- `status`: Current state (e.g., "draft", "active", "completed")
- `createdAt`: When the plan was created
- `updatedAt`: When the plan was last modified
- `finalizedAt`: When the user finalized the plan

**Characteristics:**
- One active WeekPlan per user at a time
- Plans are typically created **before the week starts** (e.g., Friday or Sunday)
- Plans can be **adjusted** during the week
- Plans provide a **complete view** of the week's intentions
- Historical plans are **preserved** for review and learning

**Lifecycle:**
1. **Draft**: User is building the plan (setting goals, selecting items, scheduling)
2. **Active**: Week has started, plan is in effect
3. **Completed**: Week is over, plan is archived

---

## Relationships

### Goal → PlanningItem → ScheduledBlock

The core planning flow follows this hierarchy:

```
┌─────────────────────────────────────────────────────────────┐
│                          GOAL                               │
│  "What do I want to accomplish this week?"                  │
│  Example: "Ship the new authentication feature"             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Supports
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                     PLANNING ITEMS                          │
│  "What specific work needs to be done?"                     │
│  - Implement OAuth2 login flow (3h)                         │
│  - Write authentication tests (2h)                          │
│  - Update user documentation (1h)                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Scheduled into
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    SCHEDULED BLOCKS                         │
│  "When will I do this work?"                                │
│  - Monday 9-12pm: Implement OAuth2 login flow               │
│  - Tuesday 2-4pm: Write authentication tests                │
│  - Friday 10-11am: Update user documentation                │
└─────────────────────────────────────────────────────────────┘
```

**Key Relationships:**

1. **Goals → PlanningItems**: One goal may be supported by multiple planning items. Planning items may optionally reference a goal (some work may not directly support a stated goal).

2. **PlanningItems → ScheduledBlocks**: One planning item may be scheduled across multiple blocks (e.g., a 6-hour task scheduled over 2 days). One scheduled block corresponds to exactly one planning item.

3. **WeekPlan → All**: A week plan aggregates all goals, planning items, and scheduled blocks for a specific week.

**Example: Engineering Manager's Week**

```
Goal: "Unblock team on Q2 infrastructure decisions"
├─ PlanningItem: "Research database scaling options" (4h)
│  └─ ScheduledBlock: Monday 9-11am (2h)
│  └─ ScheduledBlock: Monday 2-4pm (2h)
├─ PlanningItem: "Write infrastructure proposal" (3h)
│  └─ ScheduledBlock: Tuesday 9-12pm (3h)
└─ PlanningItem: "Present options to team" (1h)
   └─ ScheduledBlock: Wednesday 3-4pm (1h)
```

---

## External Sources and Integration Mapping

### Principle: Linear is Just One Source

**Linear**, **Jira**, **Asana**, **GitHub Issues**, **Todoist**, and other task management systems are **external sources** that can populate the planning items list. The product model should not assume Linear exists or favor its data structure.

### Integration Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    EXTERNAL SOURCES                          │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐            │
│  │ Linear │  │  Jira  │  │ GitHub │  │ Manual │  ...        │
│  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘            │
└──────┼───────────┼───────────┼───────────┼──────────────────┘
       │           │           │           │
       │ Map to    │ Map to    │ Map to    │ Already
       │ generic   │ generic   │ generic   │ generic
       ▼           ▼           ▼           ▼
┌──────────────────────────────────────────────────────────────┐
│              GENERIC PLANNING ITEM MODEL                     │
│  id, title, description, estimatedDuration, priority,        │
│  source, sourceId, sourceUrl, metadata, ...                  │
└──────────────────────────────────────────────────────────────┘
       │
       │ User selects items for the week
       ▼
┌──────────────────────────────────────────────────────────────┐
│                    WEEK PLAN                                 │
│  Selected items → Scheduled into time blocks                 │
└──────────────────────────────────────────────────────────────┘
```

### Example: Mapping Linear Issues

When integrating with Linear:

**Linear Issue (external):**
```json
{
  "id": "abc-123",
  "title": "Implement OAuth2 login flow",
  "description": "Add OAuth2 support for Google and GitHub",
  "estimate": 8,
  "priority": 1,
  "state": "todo",
  "assignee": { "name": "Jane Doe" },
  "url": "https://linear.app/company/issue/abc-123"
}
```

**Maps to PlanningItem (generic):**
```json
{
  "id": "uuid-456",
  "title": "Implement OAuth2 login flow",
  "description": "Add OAuth2 support for Google and GitHub",
  "estimatedDuration": 480,
  "priority": "high",
  "source": "linear",
  "sourceId": "abc-123",
  "sourceUrl": "https://linear.app/company/issue/abc-123",
  "goalId": "goal-789",
  "status": "candidate",
  "metadata": {
    "linear": {
      "estimate": 8,
      "priority": 1,
      "state": "todo",
      "assignee": "Jane Doe"
    }
  }
}
```

### Mapping Guidelines for Future Integrations

When adding a new external source, the integration should:

1. **Map to generic fields**: Extract `title`, `description`, `estimatedDuration`, and `priority` from the external format
2. **Store source metadata**: Keep `source`, `sourceId`, and `sourceUrl` for traceability
3. **Preserve original data**: Store integration-specific fields in `metadata` for reference
4. **Handle missing data**: Provide sensible defaults (e.g., if no estimate, use 60 minutes)
5. **Support sync**: Allow re-importing to update changed items
6. **Respect user changes**: Don't overwrite user modifications on re-import

**Example integrations:**

| Source | Title | Description | Duration | Priority | Notes |
|--------|-------|-------------|----------|----------|-------|
| **Linear** | `issue.title` | `issue.description` | `estimate × 60` or default | Map 1→high, 2→medium, 3→low | Store `estimate`, `priority`, `state` |
| **Jira** | `issue.summary` | `issue.description` | `timeoriginalestimate` or default | Map based on `priority.name` | Store `key`, `status`, `issuetype` |
| **GitHub** | `issue.title` | `issue.body` | Default (no estimate field) | Map labels to priority | Store `number`, `state`, `labels` |
| **Manual** | User input | User input | User input | User input | No external source |

---

## Product-Generic vs. Integration-Specific

### What Should Remain Product-Generic

These concepts are **core to the planning model** and should NOT depend on any external system:

- **Goal**: Always user-defined, never imported
- **PlanningItem**: Generic structure works for any source
- **ScheduledBlock**: Calendar-based, independent of task source
- **WeekPlan**: Aggregates all sources into one plan
- **Planning workflow**: Set goals → select items → schedule blocks → review
- **UI/UX**: Planning interface should work the same regardless of integration
- **AI features**: Prioritization, breakdown, and scheduling logic should be source-agnostic

### What Should Be Integration-Specific

These concerns are **unique to each external system** and should be isolated:

- **Authentication**: Each API has its own auth flow
- **API clients**: Each integration needs its own SDK or HTTP client
- **Data fetching**: How to query for assigned issues, filter by user, etc.
- **Mapping logic**: Converting external format to generic `PlanningItem`
- **Sync strategy**: When and how to refresh data from the external system
- **Webhooks**: Handling real-time updates (if supported)
- **UI affordances**: Integration-specific icons, badges, or status displays
- **Metadata storage**: Integration-specific fields stored in `metadata`

### Architectural Guidance

```
src/
├── core/
│   ├── models/
│   │   ├── goal.ts
│   │   ├── planning-item.ts
│   │   ├── scheduled-block.ts
│   │   └── week-plan.ts
│   ├── services/
│   │   ├── planning-service.ts
│   │   └── scheduling-service.ts
│   └── types/
│       └── core.types.ts
├── integrations/
│   ├── linear/
│   │   ├── linear-client.ts
│   │   ├── linear-mapper.ts
│   │   └── linear.types.ts
│   ├── jira/
│   │   ├── jira-client.ts
│   │   ├── jira-mapper.ts
│   │   └── jira.types.ts
│   └── github/
│       ├── github-client.ts
│       ├── github-mapper.ts
│       └── github.types.ts
└── ui/
    ├── planning/
    │   ├── goal-form.tsx
    │   ├── planning-item-list.tsx
    │   └── schedule-view.tsx
    └── integrations/
        ├── integration-selector.tsx
        └── source-badge.tsx
```

**Key principles:**
- Core models are **independent** of integrations
- Integrations **adapt** external data to core models
- UI components work with **generic models**, not integration-specific types
- Integration-specific UI (badges, icons) is **opt-in**, not required

---

## Role-Specific Examples

### Individual Contributor (IC) Engineer

**Goals:**
- "Complete the user authentication feature"
- "Review 5 PRs from teammates"

**Planning Items (mixed sources):**
- Linear: "Implement OAuth2 login flow" (3h)
- Linear: "Write authentication tests" (2h)
- GitHub: "Review PR #234: Add logging" (30min)
- GitHub: "Review PR #235: Fix bug in parser" (30min)
- Manual: "Read documentation on security best practices" (1h)

**Scheduled Blocks:**
- Monday 9-12pm: "Implement OAuth2 login flow"
- Tuesday 2-4pm: "Write authentication tests"
- Wednesday 10-11am: "Read documentation on security best practices"
- Friday 2-3pm: "Review PRs (batch of 5)"

---

### Engineering Manager

**Goals:**
- "Unblock team on Q2 infrastructure decisions"
- "Complete mid-year review preparations"

**Planning Items (mixed sources):**
- Manual: "Research database scaling options" (4h)
- Manual: "Write infrastructure proposal" (3h)
- Manual: "1:1 with Sarah" (30min)
- Manual: "1:1 with Marcus" (30min)
- Manual: "1:1 with Priya" (30min)
- Linear: "Review sprint retrospective notes" (1h)
- Manual: "Draft mid-year review for team" (2h)

**Scheduled Blocks:**
- Monday 9-11am: "Research database scaling options" (Part 1)
- Monday 2-4pm: "Research database scaling options" (Part 2)
- Tuesday 9-12pm: "Write infrastructure proposal"
- Tuesday 2:30-3pm: "1:1 with Sarah"
- Wednesday 2-3pm: "Review sprint retrospective notes"
- Thursday 10-12pm: "Draft mid-year review for team"

---

### Founder

**Goals:**
- "Close two pilot customers"
- "Finalize pricing and packaging"

**Planning Items (mixed sources):**
- Linear: "Review legal docs for Acme Corp contract" (1h)
- Linear: "Prepare demo for Beta Inc pitch" (2h)
- Manual: "Customer call with Acme Corp" (1h)
- Manual: "Pricing strategy meeting with co-founder" (1.5h)
- Manual: "Write investor update email" (1h)
- Manual: "Research competitor pricing" (2h)
- Manual: "Update pitch deck" (2h)

**Scheduled Blocks:**
- Monday 10-11am: "Review legal docs for Acme Corp"
- Monday 2-3pm: "Customer call with Acme Corp"
- Tuesday 9-11am: "Prepare demo for Beta Inc pitch"
- Wednesday 1-2pm: "Write investor update email"
- Thursday 9-11am: "Research competitor pricing"
- Friday 10-11:30am: "Pricing strategy meeting with co-founder"
- Friday 2-4pm: "Update pitch deck"

---

### Student

**Goals:**
- "Ace biology midterm"
- "Submit history essay"
- "Start final project for CS class"

**Planning Items (mixed sources):**
- Manual: "Study biology chapters 5-7" (3h)
- Manual: "Review biology lecture notes" (2h)
- Manual: "Do biology practice problems" (2h)
- Manual: "Write history essay outline" (1h)
- Manual: "Research sources for history essay" (2h)
- Manual: "Write history essay draft" (3h)
- Manual: "Brainstorm final project ideas" (1h)
- Manual: "Meet with CS professor for project approval" (30min)

**Scheduled Blocks:**
- Monday 7-9pm: "Study biology chapters 5-7"
- Tuesday 4-6pm: "Review biology lecture notes"
- Wednesday 7-9pm: "Do biology practice problems"
- Thursday 3-4pm: "Brainstorm final project ideas"
- Thursday 4:30-5pm: "Meet with CS professor"
- Friday 2-4pm: "Research sources for history essay"
- Saturday 10am-1pm: "Write history essay draft"

---

### Freelancer (Designer)

**Goals:**
- "Deliver website for Client X"
- "Send proposals to 3 new leads"

**Planning Items (mixed sources):**
- Manual: "Design homepage mockup for Client X" (4h)
- Manual: "Design about page for Client X" (3h)
- Manual: "Client X feedback review call" (1h)
- Manual: "Revise homepage based on feedback" (2h)
- Manual: "Write proposal for Client Y" (1.5h)
- Manual: "Write proposal for Client Z" (1.5h)
- Manual: "Research potential client ABC Corp" (1h)
- Manual: "Update portfolio website" (2h)

**Scheduled Blocks:**
- Monday 9am-1pm: "Design homepage mockup for Client X"
- Monday 3-4pm: "Research potential client ABC Corp"
- Tuesday 9am-12pm: "Design about page for Client X"
- Wednesday 10-11am: "Client X feedback review call"
- Wednesday 2-4pm: "Revise homepage based on feedback"
- Thursday 9-10:30am: "Write proposal for Client Y"
- Thursday 11am-12:30pm: "Write proposal for Client Z"
- Friday 1-3pm: "Update portfolio website"

---

## Guidance for Future Development

### When Adding New Features

Ask: **Does this feature work for all roles and sources?**

- ✅ **Good**: "AI can suggest breaking down a 6-hour task into smaller blocks"
  - Works for any role, any source
- ❌ **Bad**: "Show Linear issue estimates next to each task"
  - Assumes Linear, doesn't work for manual tasks or other sources

### When Adding New Integrations

1. **Create an adapter**: Map external data to generic `PlanningItem` format
2. **Store original metadata**: Preserve integration-specific fields in `metadata`
3. **Test multi-source scenarios**: Ensure UI works with mixed sources
4. **Document mapping**: Explain how fields are converted

### When Designing UI

- Show **source badges** but don't require them for the UI to work
- Allow **filtering by source** but default to showing all
- Display **generic properties** prominently (title, duration, priority)
- Hide **integration-specific details** in expandable sections or tooltips

### When Building AI Features

- AI should work with **generic `PlanningItem` properties**, not integration-specific fields
- AI suggestions should be **source-agnostic**
- If integration-specific context helps (e.g., Linear issue comments), use `metadata` but don't require it

### Testing the Model

The product model passes the test if you can answer "yes" to:

1. Can a user plan their week **without connecting any external integration**?
2. Can the app support **multiple integrations simultaneously** (e.g., Linear + GitHub)?
3. Can we add a **new integration** (e.g., Asana) without changing core models?
4. Does the UI **work the same way** regardless of whether items come from Linear, manual input, or another source?
5. Can **different user personas** (IC, manager, founder) all use the same product model effectively?

If any answer is "no", the model has drifted too far toward one integration or persona.

---

## Summary

Week Planner AI's product model is built on four core concepts:

1. **Goal**: High-level outcomes users want to achieve
2. **PlanningItem**: Specific units of work (from any source)
3. **ScheduledBlock**: Time slots where work is scheduled
4. **WeekPlan**: The complete plan for a week

**Key principles:**
- The model is **role-neutral** (works for ICs, managers, founders, students, freelancers)
- The model is **integration-agnostic** (Linear is just one possible source)
- External systems **adapt to the generic model**, not the other way around
- Core planning concepts remain **product-generic**
- Integration-specific logic is **isolated** in adapter layers

By maintaining this separation, Week Planner AI can evolve to support diverse users and workflows without being constrained by any single integration or use case.
