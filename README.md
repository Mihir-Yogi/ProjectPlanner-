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
- Dashboard, Quick Idea Capture, and Guided Project Discovery page UI
- Guided Discovery adapts its questions to the project type and uses a broad, searchable local technology catalog
- Discovery answers stay in page memory only and are cleared on refresh; they are not saved or sent anywhere
- Saving remains unavailable until frontend integration; unfinished destinations are marked as upcoming
- The post-save choices to open a project, continue answering questions, or add another idea are deferred until saving and destinations work
- No backend, project persistence, or sample project data is included

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
