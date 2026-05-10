import type { LinearIssue } from "@/types/planning";

interface LinearIssueListProps {
  issues: LinearIssue[];
}

export function LinearIssueList({ issues }: LinearIssueListProps) {
  const priorityColors = {
    urgent: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  };

  const statusColors = {
    "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    "Todo": "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300",
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
        Linear Issues
      </h2>
      <div className="space-y-3">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
                    {issue.identifier}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      statusColors[issue.status as keyof typeof statusColors] || statusColors.Todo
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>
                <h3 className="font-medium text-zinc-900 dark:text-white">
                  {issue.title}
                </h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}
              >
                {issue.priority}
              </span>
            </div>
            {issue.estimateHours && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Estimate: {issue.estimateHours}h
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
