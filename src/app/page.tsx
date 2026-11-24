import Link from "next/link";
import { WorkspaceShell } from "@/components/workspace-shell";
import { DashboardProjects } from "./dashboard-projects";
import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <WorkspaceShell activePage="dashboard">
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <div className={styles.pageHeading}>
            <p className={styles.eyebrow}>Your workspace</p>
            <h1>Dashboard</h1>
            <p className={styles.pageDescription}>
              A clear place for ideas to become well-planned projects.
            </p>
          </div>

          <div className={styles.createAction}>
            <Link
              className={styles.createButton}
              href="/projects/new/discovery"
              aria-describedby="create-project-note"
            >
              <span aria-hidden="true">+</span>
              New project
            </Link>
            <span className={styles.createNote} id="create-project-note">
              Start with a clear project plan
            </span>
          </div>
        </header>

        <DashboardProjects />
      </div>
    </WorkspaceShell>
  );
}
