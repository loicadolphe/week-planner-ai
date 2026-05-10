import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <main className="flex flex-col items-center justify-center text-center max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          Week Planner AI
        </h1>
        <p className="text-2xl font-medium text-zinc-700 dark:text-zinc-300 mb-6">
          Plan your week around what matters
        </p>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl">
          Set goals, organise planning items, and shape a realistic week around your meetings and commitments.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-50 px-8 text-base font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
        >
          Open dashboard
        </Link>
      </main>
    </div>
  );
}
