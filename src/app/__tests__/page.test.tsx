import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../page";
import { ThemeProvider } from "@/lib/theme-provider";

describe("Home Page", () => {
  it("should render without errors", () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    
    expect(screen.getByText("Week Planner AI")).toBeTruthy();
  });

  it("should display the main heading", () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    
    const heading = screen.getByRole("heading", { name: /Week Planner AI/i });
    expect(heading).toBeTruthy();
  });

  it("should have a link to the dashboard", () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    
    const link = screen.getByRole("link", { name: /Open dashboard/i });
    expect(link.getAttribute("href")).toBe("/dashboard");
  });

  it("should have a theme toggle button", () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    
    const themeToggle = screen.getByRole("button", { name: /Switch to/i });
    expect(themeToggle).toBeTruthy();
  });
});
