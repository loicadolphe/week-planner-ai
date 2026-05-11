import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddItemForm } from "../AddItemForm";

describe("AddItemForm", () => {
  it("should render without errors", () => {
    const mockOnAddItem = vi.fn();
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    expect(screen.getByLabelText(/New planning item/i)).toBeTruthy();
  });

  it("should have title input field", () => {
    const mockOnAddItem = vi.fn();
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    const input = screen.getByPlaceholderText(/Add something to plan/i);
    expect(input).toBeTruthy();
  });

  it("should have category dropdown", () => {
    const mockOnAddItem = vi.fn();
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    const categoryTrigger = screen.getByRole("combobox", { name: /Category/i });
    expect(categoryTrigger).toBeTruthy();
  });

  it("should have type dropdown", () => {
    const mockOnAddItem = vi.fn();
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    const typeTrigger = screen.getByRole("combobox", { name: /Type/i });
    expect(typeTrigger).toBeTruthy();
  });

  it("should have priority dropdown", () => {
    const mockOnAddItem = vi.fn();
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    const priorityTrigger = screen.getByRole("combobox", { name: /Priority/i });
    expect(priorityTrigger).toBeTruthy();
  });

  it("should submit form with valid input", async () => {
    const mockOnAddItem = vi.fn();
    const user = userEvent.setup();
    
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    const input = screen.getByPlaceholderText(/Add something to plan/i);
    await user.type(input, "Test task");
    
    const submitButton = screen.getByRole("button", { name: /Add/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnAddItem).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test task",
          type: "task",
          priority: "medium",
          source: "manual",
        })
      );
    });
  });

  it("should not submit with empty title", async () => {
    const mockOnAddItem = vi.fn();
    const user = userEvent.setup();
    
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    const submitButton = screen.getByRole("button", { name: /Add/i });
    await user.click(submitButton);
    
    expect(mockOnAddItem).not.toHaveBeenCalled();
  });

  it("should open category dropdown and show options", async () => {
    const mockOnAddItem = vi.fn();
    const user = userEvent.setup();
    
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    const categoryTrigger = screen.getByRole("combobox", { name: /Category/i });
    await user.click(categoryTrigger);
    
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /No category/i })).toBeTruthy();
      expect(screen.getByRole("option", { name: /^Work$/i })).toBeTruthy();
      expect(screen.getByRole("option", { name: /^Personal$/i })).toBeTruthy();
      expect(screen.getByRole("option", { name: /Errands/i })).toBeTruthy();
      expect(screen.getByRole("option", { name: /Wellbeing/i })).toBeTruthy();
    });
  });

  it("should open type dropdown and show options", async () => {
    const mockOnAddItem = vi.fn();
    const user = userEvent.setup();
    
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    const typeTrigger = screen.getByRole("combobox", { name: /Type/i });
    await user.click(typeTrigger);
    
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /^Task$/i })).toBeTruthy();
      expect(screen.getByRole("option", { name: /Project/i })).toBeTruthy();
      expect(screen.getByRole("option", { name: /Meeting prep/i })).toBeTruthy();
    });
  });

  it("should open priority dropdown and show options", async () => {
    const mockOnAddItem = vi.fn();
    const user = userEvent.setup();
    
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    const priorityTrigger = screen.getByRole("combobox", { name: /Priority/i });
    await user.click(priorityTrigger);
    
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /Low/i })).toBeTruthy();
      expect(screen.getByRole("option", { name: /Medium/i })).toBeTruthy();
      expect(screen.getByRole("option", { name: /High/i })).toBeTruthy();
    });
  });

  it("should select category option", async () => {
    const mockOnAddItem = vi.fn();
    const user = userEvent.setup();
    
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    const categoryTrigger = screen.getByRole("combobox", { name: /Category/i });
    await user.click(categoryTrigger);
    
    const personalOption = await screen.findByRole("option", { name: /^Personal$/i });
    await user.click(personalOption);
    
    const input = screen.getByPlaceholderText(/Add something to plan/i);
    await user.type(input, "Personal task");
    
    const submitButton = screen.getByRole("button", { name: /Add/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnAddItem).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Personal task",
          category: "personal",
        })
      );
    });
  });

  it("should handle no category selection", async () => {
    const mockOnAddItem = vi.fn();
    const user = userEvent.setup();
    
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    const categoryTrigger = screen.getByRole("combobox", { name: /Category/i });
    await user.click(categoryTrigger);
    
    const noCategoryOption = await screen.findByRole("option", { name: /No category/i });
    await user.click(noCategoryOption);
    
    const input = screen.getByPlaceholderText(/Add something to plan/i);
    await user.type(input, "Task without category");
    
    const submitButton = screen.getByRole("button", { name: /Add/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnAddItem).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Task without category",
          category: undefined,
        })
      );
    });
  });

  it("should reset form after submission", async () => {
    const mockOnAddItem = vi.fn();
    const user = userEvent.setup();
    
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    const input = screen.getByPlaceholderText(/Add something to plan/i);
    await user.type(input, "Test task");
    
    const submitButton = screen.getByRole("button", { name: /Add/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe("");
    });
  });

  it("should handle duration input", async () => {
    const mockOnAddItem = vi.fn();
    const user = userEvent.setup();
    
    render(<AddItemForm onAddItem={mockOnAddItem} />);
    
    const durationInput = screen.getByLabelText(/Duration in hours/i);
    await user.clear(durationInput);
    await user.type(durationInput, "2");
    
    const input = screen.getByPlaceholderText(/Add something to plan/i);
    await user.type(input, "Long task");
    
    const submitButton = screen.getByRole("button", { name: /Add/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnAddItem).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Long task",
          estimateMinutes: 120,
        })
      );
    });
  });
});
