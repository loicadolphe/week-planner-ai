import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../theme-provider";

function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <button onClick={toggleTheme} data-testid="toggle">
        Toggle
      </button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("should render children", () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Test</div>
      </ThemeProvider>
    );
    expect(screen.getByTestId("child")).toBeTruthy();
  });

  it("should initialize with light theme by default", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("theme").textContent).toBe("light");
    });
  });

  it("should toggle theme from light to dark", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("theme").textContent).toBe("light");
    });
    
    fireEvent.click(screen.getByTestId("toggle"));
    
    await waitFor(() => {
      expect(screen.getByTestId("theme").textContent).toBe("dark");
    });
  });

  it("should persist theme to localStorage", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("theme").textContent).toBe("light");
    });
    
    fireEvent.click(screen.getByTestId("toggle"));
    
    await waitFor(() => {
      expect(window.localStorage.getItem("week-planner-ai:theme")).toBe("dark");
    });
  });

  it("should load theme from localStorage", async () => {
    window.localStorage.setItem("week-planner-ai:theme", "dark");
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("theme").textContent).toBe("dark");
    });
  });

  it("should update document class when theme changes", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("theme").textContent).toBe("light");
    });
    
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    
    fireEvent.click(screen.getByTestId("toggle"));
    
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  it("should respect prefers-color-scheme dark", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("theme").textContent).toBe("dark");
    });
  });

  it("should throw error when useTheme is used outside provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow("useTheme must be used within a ThemeProvider");
    
    consoleError.mockRestore();
  });
});
