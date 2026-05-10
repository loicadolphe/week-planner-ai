# Week Planner AI

A weekly planning app that helps users set goals, pull work from Linear, and create a realistic weekly plan around meetings.

## What It Is

Week Planner AI is a proof of concept (PoC) for an AI-powered weekly planning application. It enables users to organize their work week by setting goals, viewing tasks from Linear, selecting which work to include, and building a realistic schedule. The app is designed to intelligently suggest plans while giving users full control over their schedule.

For more details, see the [project brief](docs/project-brief.md).

## MVP Scope

The MVP focuses on core weekly planning functionality:

- **Set weekly goals** - Define what you want to accomplish this week
- **View work items from Linear** - See your assigned tasks and issues
- **Select tasks to include** - Choose which work to prioritize this week
- **Build a realistic weekly plan** - Create a schedule that fits your capacity
- **Future: Calendar integration** - Connect Google Calendar to schedule tasks around meetings

## Tech Stack

**Current:**
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- React 19

**Planned:**
- PostgreSQL (database)
- Drizzle ORM (database layer)
- Linear API (task management integration)
- Google Calendar API (calendar integration)
- OpenAI or Vercel AI SDK (AI features)

## Getting Started

### Prerequisites

- Node.js 20 or later
- Yarn package manager

### Installation

Install dependencies:

```bash
yarn install
```

### Development

Start the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Other Commands

```bash
yarn build   # Build for production
yarn start   # Start production server
yarn lint    # Run ESLint
```

## Product Principles

The Week Planner AI is guided by these core principles:

- **AI suggests, users decide** - AI should suggest plans, not automatically change calendars without approval
- **Deterministic scheduling** - Deterministic code should handle scheduling constraints
- **AI for intelligence** - AI should handle task breakdown, prioritization, summaries, and overload detection

## Roadmap

The project is currently in the PoC phase. Upcoming features include:

1. **Linear Integration** - Pull real tasks and issues from Linear
2. **Calendar Sync** - Connect Google Calendar to view meetings and availability
3. **AI Planning** - Intelligent task breakdown and schedule optimization
4. **Database Layer** - Persistent storage for plans and user data
5. **Smart Scheduling** - Schedule tasks around existing meetings automatically

## Project Structure

```
src/
├── app/           # Next.js App Router pages and layouts
├── components/    # React components
├── lib/           # Utility functions and helpers
└── types/         # TypeScript type definitions
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
