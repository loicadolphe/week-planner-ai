import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { PlannerClient } from "../PlannerClient";
import { ThemeProvider } from "@/lib/theme-provider";
import { sampleWeekPlan } from "@/lib/sample-data";

describe("Dashboard Page", () => {
  it("should render PlannerClient without errors", async () => {
    render(
      <ThemeProvider>
        <PlannerClient initialPlan={sampleWeekPlan} />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      // Multiple instances due to desktop/mobile views
      expect(screen.getAllByText("Week Planner AI").length).toBeGreaterThan(0);
    });
  });

  it("should display the backlog section", async () => {
    render(
      <ThemeProvider>
        <PlannerClient initialPlan={sampleWeekPlan} />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText("Backlog")).toBeTruthy();
    });
  });

  it("should display the goals section", async () => {
    render(
      <ThemeProvider>
        <PlannerClient initialPlan={sampleWeekPlan} />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText("Goals")).toBeTruthy();
    });
  });

  it("should display day columns", async () => {
    render(
      <ThemeProvider>
        <PlannerClient initialPlan={sampleWeekPlan} />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      // Day names appear in the desktop view
      const mondays = screen.queryAllByText("Monday");
      expect(mondays.length).toBeGreaterThan(0);
    });
  });

  it("should have theme toggle buttons", async () => {
    render(
      <ThemeProvider>
        <PlannerClient initialPlan={sampleWeekPlan} />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      // Multiple toggles due to desktop/mobile views
      const themeToggles = screen.getAllByRole("button", { name: /Switch to/i });
      expect(themeToggles.length).toBeGreaterThan(0);
    });
  });

  it("should display planning items from initial data", async () => {
    render(
      <ThemeProvider>
        <PlannerClient initialPlan={sampleWeekPlan} />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      const backlogItems = sampleWeekPlan.planningItems;
      if (backlogItems.length > 0) {
        expect(screen.getByText(backlogItems[0].title)).toBeTruthy();
      }
    });
  });

  it("should display goals from initial data", async () => {
    render(
      <ThemeProvider>
        <PlannerClient initialPlan={sampleWeekPlan} />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      const goals = sampleWeekPlan.goals;
      if (goals.length > 0) {
        expect(screen.getByText(goals[0].title)).toBeTruthy();
      }
    });
  });
});
