export const DAY_CAPACITY_HOURS = 6.5;

export type CapacityState =
  | "open"
  | "light"
  | "balanced"
  | "full"
  | "overloaded";

export function capacityState(planned: number, capacity = DAY_CAPACITY_HOURS) {
  const ratio = planned / capacity;

  if (planned <= 0) return { state: "open" as const, ratio };
  if (ratio <= 0.45) return { state: "light" as const, ratio };
  if (ratio <= 0.95) return { state: "balanced" as const, ratio };
  if (ratio <= 1.05) return { state: "full" as const, ratio };
  return { state: "overloaded" as const, ratio };
}
