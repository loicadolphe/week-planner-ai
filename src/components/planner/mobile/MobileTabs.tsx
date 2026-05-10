export type MobileTab = "plan" | "backlog" | "goals";

interface MobileTabsProps {
  activeTab: MobileTab;
  backlogCount: number;
  goalsCount: number;
  onChange: (tab: MobileTab) => void;
}

export function MobileTabs({
  activeTab,
  backlogCount,
  goalsCount,
  onChange,
}: MobileTabsProps) {
  const tabs: { key: MobileTab; label: string }[] = [
    { key: "plan", label: "Plan" },
    { key: "backlog", label: `Backlog · ${backlogCount}` },
    { key: "goals", label: `Goals · ${goalsCount}` },
  ];

  return (
    <div className="grid grid-cols-3 rounded-full border bg-[var(--surface-2)] p-1" style={{ borderColor: "var(--line)" }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className="rounded-full px-3 py-2 text-[12px] font-[540] transition-colors"
          style={{
            background: activeTab === tab.key ? "var(--ink-1)" : "transparent",
            color: activeTab === tab.key ? "var(--surface)" : "var(--ink-3)",
          }}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
