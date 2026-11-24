# ProjectPlanner

ProjectPlanner is a project discovery and planning workspace. The current frontend milestone includes the Dashboard, Quick Idea Capture, and Guided Project Discovery.

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Current scope

- Next.js App Router with TypeScript
- Dashboard, Quick Idea Capture, and Guided Project Discovery with an editable project plan, local PDF export, and browser-based saving
- Guided Discovery has separate idea and client paths; frontend, backend, and database choices adapt to earlier answers, and integrations follow selected features
- Discovery answers and unsaved plan edits stay in page memory and are cleared on refresh; saved projects stay in this browser's storage and are not sent to a server
- Saved projects appear on the Dashboard and can be reopened in a project details view; the plan PDF is generated locally when requested
- No backend, server-side persistence, cross-device sync, or sample project data is included

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
