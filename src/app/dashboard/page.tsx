import { PlannerClient } from "./PlannerClient";
import { sampleWeekPlan } from "@/lib/sample-data";

export default function DashboardPage() {
  return <PlannerClient initialPlan={sampleWeekPlan} />;
}
