# Dashboard Design Review — Manual Weekly Planning Loop

**Issue**: LOIC-136  
**Date**: May 11, 2026  
**Reviewer**: Cursor Cloud Agent  
**Repository**: [week-planner-ai](https://github.com/loicadolphe/week-planner-ai)

---

## Executive Summary

The `/dashboard` implementation has **drifted significantly** from the core product model defined in `docs/product-model.md`. While the UI successfully supports manual weekly planning for both work and non-work items, there are critical issues with model alignment, missing functionality, and non-functional interactive elements.

**Key Findings:**
- ✅ The UI supports work and non-work planning (work, personal, errands, wellbeing)
- ✅ Manual workflow is functional with drag-and-drop scheduling
- ✅ Goals, backlog, and week plan sections are clearly visible
- ✅ **Resolved**: Dashboard now uses the core model (`planning.ts`); deprecated `planner.ts` has been removed
- ❌ **Critical**: PlanningItem → ScheduledBlock relationship is broken (no `planningItemId` link)
- ❌ **Medium**: Category system was introduced outside the core model
- ❌ **Medium**: Several model fields are missing from implementation
- ❌ **Low**: Some minor UI polish issues

---

## 1. Model Drift Analysis

### 1.1 Duplicate Type Definitions

**Status: ✅ RESOLVED**

The dashboard previously used two separate type systems, but has now been migrated:

1. **`/src/types/planning.ts`** — Core product model (documented in `docs/product-model.md`) ✅ **Now in use**
2. **`/src/types/planner.ts`** — ~~Simplified dashboard model~~ ✅ **Removed (deprecated)**

**Resolution**: The deprecated `planner.ts` has been removed. The dashboard now uses the core product model from `planning.ts`, eliminating the maintenance burden and model drift issues.

### 1.2 Goal Model Drift

**Core model** (`planning.ts`):
```typescript
type Goal = {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
}
```

**Dashboard model** (`planner.ts`):
```typescript
interface Goal {
  id: string;
  text: string;      // Different property name
  done: boolean;     // Not in core model
}
```

**Missing fields**: `description`, `priority`, `timeframe`, `status`, `createdAt`, `updatedAt`

**Issues**:
- `text` vs `title` inconsistency
- `done` boolean is implementation detail, not part of the product model
- Missing priority prevents users from understanding goal importance
- Missing description limits goal context

### 1.3 PlanningItem Model Drift

**Core model** (`planning.ts`):
```typescript
type PlanningItem = {
  id: string;
  title: string;
  description?: string;
  type: PlanningItemType;
  source: PlanningItemSource;     // Required
  externalId?: string;
  externalUrl?: string;
  status?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  estimateMinutes?: number;
  dueDate?: string;
}
```

**Dashboard model** (`planner.ts`):
```typescript
interface PlanningItem {
  id: string;
  title: string;
  category?: Category;        // Not in core model
  type: PlanningType;
  priority: Priority;
  duration: number;           // Different name: estimateMinutes → duration
  createdAt: string;
}
```

**Missing fields**: `source`, `externalId`, `externalUrl`, `status`, `description`, `dueDate`

**Added fields**: `category` (not in core model)

**Issues**:
- `source` field is **critical** for the product vision (Linear, GitHub, manual, etc.)
- `externalId` and `externalUrl` are required for integration traceability
- `category` was added outside the model without documentation
- `description` is missing, limiting item context

### 1.4 ScheduledBlock Model Drift

**Core model** (`planning.ts`):
```typescript
type ScheduledBlock = {
  id: string;
  title: string;
  planningItemId?: string;    // Link to the source planning item
  estimateMinutes: number;
  day: WeekDay;
  startTime?: string;
  endTime?: string;
}
```

**Dashboard model** (`planner.ts`):
```typescript
interface ScheduledBlock extends Omit<PlanningItem, "createdAt"> {
  scheduledAt: string;
}
```

**Issues**:
- **CRITICAL**: No `planningItemId` field — **the link between planning items and scheduled blocks is broken**
- The dashboard implementation **copies properties** from PlanningItem into ScheduledBlock
- This means once an item is scheduled, there is **no relationship** back to the original planning item
- This breaks the core planning model relationship: `Goal → PlanningItem → ScheduledBlock`
- Users cannot unschedule a block and recover the original planning item metadata
- Future features (like syncing status changes) will not work

### 1.5 WeekPlan Model Drift

**Core model** (`planning.ts`):
```typescript
type WeekPlan = Record<WeekDay, ScheduledBlock[]>;
```

**Dashboard model** (`planner.ts`):
```typescript
interface WeekPlan {
  weekOf: string;
  goals: Goal[];
  backlog: PlanningItem[];
  blocks: Record<DayKey, ScheduledBlock[]>;
}
```

**Issues**:
- Core model is too minimal (missing goals and backlog)
- Dashboard model is closer to what's needed but wasn't documented

**Note**: The dashboard model here is actually **better** than the core model, suggesting the core model definition was incomplete.

---

## 2. Category System Analysis

The dashboard introduces a **Category** system that is **not present** in the core product model:

```typescript
type Category = "work" | "personal" | "errands" | "wellbeing";
```

**Usage**:
- Used in `PlanningItem` and `ScheduledBlock`
- Has visual treatment (colored rails, badges, filtering)
- Deeply integrated into the UI

**Analysis**:

### 2.1 Is Category a Good Addition?

**Pros**:
- ✅ Directly supports the requirement "both work and non-work planning items"
- ✅ Makes non-work items (personal, errands, wellbeing) feel natural in the UI
- ✅ Enables useful filtering in the backlog
- ✅ Visual color coding helps users quickly identify item types
- ✅ Aligns with work-life balance planning

**Cons**:
- ❌ Not documented in `docs/product-model.md`
- ❌ Overlaps with `PlanningItemType` (e.g., both have "personal")
- ❌ May conflict with integration-specific categorization (e.g., Linear labels, Jira components)

### 2.2 Recommendation

The Category system should be **formalized in the product model** with the following changes:

1. **Add Category to the core model** in `docs/product-model.md`
2. **Clarify the difference** between Category (work vs. non-work) and Type (task vs. project)
3. **Consider**: Should Category be part of core model, or is it better implemented as:
   - A filtering view over `type` and `source`?
   - Derived from external system metadata?
   - User-defined tags?

**Suggested model addition**:
```typescript
type PlanningItemCategory = "work" | "personal" | "wellbeing" | "admin";

// In PlanningItem:
category?: PlanningItemCategory;
```

**Rationale**:
- Makes work/non-work distinction explicit
- Supports milestone 1's focus on manual weekly planning
- Enables capacity planning across life domains
- Aligns with product vision of supporting whole-person planning

---

## 3. Work and Non-Work Planning Support

### 3.1 UI Support — ✅ PASS

The dashboard **successfully supports** both work and non-work planning:

**Evidence**:
- Category options: Work, Personal, Errands, Wellbeing
- Sample data includes:
  - Work: "Draft stakeholder update", "Review onboarding notes"
  - Personal: "Book annual health check", "Family dinner logistics"
  - Errands: "Pick up framing order", "Grocery run"
  - Wellbeing: "Long run planning", "Evening reset"
- Visual treatment is consistent across categories
- Filtering works for all categories

### 3.2 Do Non-Work Items Feel Natural?

**Assessment**: ✅ YES

- Non-work items have the same visual weight as work items
- Category color coding provides clear visual distinction
- Sample data demonstrates realistic personal/errands/wellbeing use cases
- No UI copy suggests the app is work-only
- Goals can include non-work outcomes (e.g., "Keep one wellbeing anchor visible")

**Minor suggestion**: Consider softer language in UI copy to emphasize life balance (e.g., "This week's priorities" instead of "Week plan").

---

## 4. Relationship Between Unscheduled Items and Scheduled Blocks

### 4.1 Current Implementation — ❌ BROKEN

**Problem**: When a `PlanningItem` is scheduled, the implementation **copies** the item properties into a `ScheduledBlock` and **removes** the item from the backlog:

```typescript:253:274:/workspace/src/app/dashboard/PlannerClient.tsx
case "schedule_item": {
  const item = plan.backlog.find((backlogItem) => backlogItem.id === action.itemId);
  if (!item) return plan;

  const block = {
    id: uid("block"),
    title: item.title,
    category: item.category,
    type: item.type,
    priority: item.priority,
    duration: item.duration,
    scheduledAt: scheduledDate(plan.weekOf, action.day),
  };

  return {
    ...plan,
    backlog: plan.backlog.filter((backlogItem) => backlogItem.id !== action.itemId),
    blocks: {
      ...plan.blocks,
      [action.day]: [...plan.blocks[action.day], block],
    },
  };
}
```

**Issues**:
1. The `ScheduledBlock` gets a **new ID** (`uid("block")`), losing the connection to the original item
2. The `PlanningItem` is **deleted** from the backlog
3. There is **no `planningItemId` field** to maintain the relationship
4. When unscheduling, a **new item** is created with a new ID

**Impact**:
- Cannot track which scheduled blocks came from which planning items
- Cannot preserve metadata like `source`, `externalId`, `externalUrl`
- Cannot sync status changes between external systems and scheduled work
- Cannot show "this item is scheduled on Tuesday" in the backlog
- Future features (calendar sync, AI rescheduling) will be difficult to implement

### 4.2 Expected Implementation

**Core model design**:
```typescript
// PlanningItem stays in the backlog (or moves to a "selected" state)
// ScheduledBlock references the item:
type ScheduledBlock = {
  id: string;
  planningItemId: string;  // Link back to the planning item
  day: WeekDay;
  startTime?: string;
  endTime?: string;
  estimateMinutes: number;
}
```

**Benefits**:
- Clear relationship: One planning item can have multiple scheduled blocks
- Metadata stays with the planning item
- Unscheduling is simple: delete the block, item remains in backlog
- Status sync works: update the planning item, all blocks reflect it

### 4.3 Recommendation

**Fix the relationship model**:

1. Add `planningItemId` to `ScheduledBlock`
2. Keep `PlanningItem` in the backlog even when scheduled (or add a `selected`/`scheduled` state)
3. Update reducer logic:
   - `schedule_item`: Create block with `planningItemId`, keep item in backlog
   - `unschedule_block`: Remove block, item stays in backlog
4. Update UI to show scheduled state (e.g., "Scheduled: Mon, Wed")

---

## 5. Non-Functional Interactive UI Elements

### 5.1 Fully Functional Elements — ✅

The following UI elements **work as expected**:
- ✅ Add goal (input + button)
- ✅ Toggle goal done (checkbox)
- ✅ Delete goal (x button)
- ✅ Add planning item (form with category, type, priority, duration)
- ✅ Delete planning item (x button)
- ✅ Schedule item (button → popover with day selection)
- ✅ Drag item to day column
- ✅ Unschedule block (x button)
- ✅ Drag block between days
- ✅ Category filter chips
- ✅ Toggle category bars

### 5.2 Potentially Misleading UI — ⚠️ Minor

**Observation**: Time durations are shown (e.g., "3h", "1.5h") but blocks do not display specific start/end times.

**User expectation**: Seeing "3h" might suggest the block has a scheduled time (e.g., "9am-12pm").

**Reality**: The dashboard uses duration-based scheduling, not time-based scheduling.

**Recommendation**: This is acceptable for Milestone 1 (manual planning loop). Future milestones should add time-slot scheduling.

### 5.3 Summary — ✅ PASS

No major non-functional interactive elements were found. The UI accurately represents the current implementation capabilities.

---

## 6. Concepts Outside the Product Model

### 6.1 Category System

**Status**: Not in `docs/product-model.md`  
**Recommendation**: Formalize in product model (see Section 2)

### 6.2 Priority Values

**Core model**: `"low" | "medium" | "high" | "urgent"`  
**Dashboard model**: `"low" | "med" | "high"`

**Issue**: Shortened "med" vs "medium", missing "urgent"

**Recommendation**: Use full words for consistency, add "urgent" option

### 6.3 Day Keys

**Core model**: `"monday" | "tuesday" | "wednesday" | "thursday" | "friday"`  
**Dashboard model**: `"mon" | "tue" | "wed" | "thu" | "fri"`

**Issue**: Inconsistent naming

**Recommendation**: Standardize on short codes (`mon`, `tue`) or full names (`monday`, `tuesday`)

### 6.4 Duration vs. EstimateMinutes

**Core model**: `estimateMinutes` (number)  
**Dashboard model**: `duration` (number in hours)

**Issue**: Unit mismatch and naming inconsistency

**Recommendation**: Standardize on `estimateMinutes` (aligns with product model, clearer unit)

---

## 7. Missing Features (Documented in Core Model)

The following fields from the core product model are **missing** from the dashboard implementation:

### 7.1 PlanningItem Missing Fields

- `description` — Limits item context
- `source` — **Critical for integration vision** (Linear, GitHub, manual)
- `sourceId` — Cannot link back to external systems
- `sourceUrl` — Cannot open original issue/task
- `status` — Cannot track item state (candidate, selected, scheduled, completed)
- `dueDate` — Cannot prioritize by deadlines
- `metadata` — Cannot store integration-specific data

**Impact**: Makes future integrations (Linear, GitHub) significantly harder to implement.

### 7.2 ScheduledBlock Missing Fields

- `planningItemId` — **Critical** (see Section 4)
- `startTime` / `endTime` — Required for time-based scheduling
- `isLocked` — Cannot prevent AI from moving blocks
- `notes` — Cannot add context to specific scheduled blocks

**Impact**: Blocks cannot evolve into time-slot scheduling (needed for calendar integration).

### 7.3 Goal Missing Fields

- `priority` — Cannot rank goals
- `description` — Limits goal context
- `timeframe` — Cannot track multi-week goals
- `status` — Cannot track goal state (active, completed, deferred)

**Impact**: Goal management is limited to simple checklists.

---

## 8. Positive Design Decisions

The dashboard implementation includes several **good design decisions**:

### 8.1 Drag-and-Drop

✅ Intuitive scheduling via drag-and-drop  
✅ Works for both items (backlog → day) and blocks (day → day)  
✅ Visual feedback during drag  

### 8.2 Manual Planning Workflow

✅ Clear sections: Goals, Backlog, Week Plan  
✅ Logical flow: Set goals → Add items → Schedule items  
✅ Capacity indicators (daily totals)  

### 8.3 Mobile Support

✅ Dedicated mobile components (`MobileBoard`, `MobileTabs`)  
✅ Tab navigation (Plan / Backlog / Goals)  
✅ Day strip for mobile week view  

### 8.4 Visual Design

✅ Clean, modern UI  
✅ Consistent design language  
✅ Color-coded categories with visual rails  
✅ Clear typography hierarchy  

### 8.5 Category System

✅ Explicit support for work/non-work planning  
✅ Filtering by category  
✅ Visual distinction via color coding  

---

## 9. Recommendations

### 9.1 Critical (Must Fix Before Milestone 1 Completion)

1. **Fix the PlanningItem → ScheduledBlock relationship**
   - Add `planningItemId` to `ScheduledBlock`
   - Keep planning items in backlog when scheduled
   - Update reducer logic to maintain the link

2. **Consolidate type definitions**
   - Choose one authoritative model: `planning.ts` (core model)
   - Migrate dashboard to use core model
   - Delete `planner.ts` or rename as `dashboard-view-model.ts` with clear documentation

3. **Add missing critical fields**
   - Add `source` to `PlanningItem` (with default "manual")
   - Add `sourceId` and `sourceUrl` (nullable, for future integrations)
   - Add `planningItemId` to `ScheduledBlock`

### 9.2 High Priority (Should Fix Soon)

4. **Formalize Category in product model**
   - Document Category system in `docs/product-model.md`
   - Clarify Category vs. Type distinction
   - Standardize naming

5. **Add description fields**
   - Add `description` to `Goal`
   - Add `description` to `PlanningItem`
   - Update UI to show/edit descriptions (optional)

6. **Standardize naming**
   - Use `title` (not `text`) for Goal
   - Use `estimateMinutes` (not `duration`) for PlanningItem
   - Use `"medium"` (not `"med"`) for priority

### 9.3 Medium Priority (Can Defer to Later Milestones)

7. **Add time-slot scheduling**
   - Add `startTime` and `endTime` to `ScheduledBlock`
   - Update UI to show/edit block times
   - Add time-grid view

8. **Add status tracking**
   - Add `status` to `PlanningItem`
   - Add `status` to `Goal`
   - Update UI to show status

9. **Add due date support**
   - Add `dueDate` to `PlanningItem`
   - Add visual indicators for approaching deadlines

---

## 10. Follow-Up Issues

Based on this review, the following Linear issues should be created:

### Issue 1: Fix PlanningItem → ScheduledBlock Relationship
**Title**: Fix broken relationship between planning items and scheduled blocks  
**Description**: Add `planningItemId` to ScheduledBlock and update scheduling logic to maintain the link  
**Priority**: High  
**Milestone**: 1 — Manual weekly planning loop  

### Issue 2: Consolidate Type Definitions
**Title**: Migrate dashboard to use core product model (`planning.ts`)  
**Description**: Remove duplicate type system and align dashboard with `docs/product-model.md`  
**Priority**: High  
**Milestone**: 1 — Manual weekly planning loop  

### Issue 3: Add Source Field to Planning Items
**Title**: Add `source` field to PlanningItem to prepare for integrations  
**Description**: Add `source`, `sourceId`, `sourceUrl` fields with default "manual"  
**Priority**: Medium  
**Milestone**: 1 — Manual weekly planning loop  

### Issue 4: Formalize Category System in Product Model
**Title**: Document and standardize Category system  
**Description**: Add Category to `docs/product-model.md`, clarify Category vs Type  
**Priority**: Medium  
**Milestone**: 1 — Manual weekly planning loop  

### Issue 5: Add Description Fields
**Title**: Add description fields to Goal and PlanningItem  
**Description**: Support richer context for goals and planning items  
**Priority**: Low  
**Milestone**: 2 — Integration preparation  

---

## 11. Conclusion

The `/dashboard` implementation **successfully supports the core manual weekly planning workflow** and explicitly handles both work and non-work planning items. However, there has been **significant model drift** that must be addressed before Milestone 1 is complete.

### Passes Review Criteria

✅ Supports manual weekly planning loop  
✅ UI is clear and functional  
✅ Work and non-work items feel natural  
✅ No non-functional interactive elements  
✅ Mobile support is present  

### Fails Review Criteria

❌ Does NOT use the core product model (`planning.ts`)  
❌ Critical relationship (PlanningItem → ScheduledBlock) is broken  
❌ Introduced concepts (Category) outside documented model  
❌ Missing critical fields needed for future integrations  

### Overall Assessment

**Status**: ⚠️ **Needs Revision**

The dashboard is **functional** but **not aligned with the product model**. Before marking Milestone 1 as complete, the critical issues (relationship model, type consolidation) must be fixed to ensure a solid foundation for future milestones.

---

## 12. Appendix: Sample Data Review

The sample data in `/src/lib/sample-data.ts` demonstrates the dashboard's support for diverse planning items:

**Work Items** (5):
- "Milestone 1 implementation pass" (project, 3h)
- "Design review notes" (review, 1.5h)
- "Customer interview synthesis" (review, 2h)
- "Roadmap tradeoff memo" (decision, 3.5h)
- "Architecture review prep" (meeting_prep, 2.25h)
- "Quarterly planning workshop" (project, 4.75h)
- "Weekly review and next actions" (review, 1.5h)
- "Follow up with design partners" (follow_up, 1h)

**Personal Items** (2):
- "Book annual health check" (personal, 0.5h)
- "Family dinner logistics" (personal, 1h)

**Errands** (2):
- "Pick up framing order" (errands, 0.75h)
- "Grocery run" (errands, 1h)

**Wellbeing** (2):
- "Long run planning" (wellbeing, 1h)
- "Evening reset" (wellbeing, 1h)

**Assessment**: Sample data is realistic and well-balanced across categories. ✅

---

**End of Review**
