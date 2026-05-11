import { PlannerClient } from "@/app/dashboard/PlannerClient";
import { sampleWeekPlan } from "@/lib/sample-data";

export default function MobilePage() {
  return <PlannerClient initialPlan={sampleWeekPlan} forceMobile />;
}
