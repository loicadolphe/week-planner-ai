import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@/lib/theme-provider";
import { ThemeToggle } from "../theme-toggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("should render sun icon in light mode", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toBeTruthy();
    });
  });

  it("should toggle between light and dark mode when clicked", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });

  it("should have accessible aria-label", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button.getAttribute("aria-label")).toMatch(/Switch to (dark|light) mode/);
    });
  });

  it("should persist theme selection", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(window.localStorage.getItem("week-planner-ai:theme")).toBeNull();
    });
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(window.localStorage.getItem("week-planner-ai:theme")).toBe("dark");
    });
  });
});
