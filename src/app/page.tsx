import { WorkspaceShell } from "@/components/workspace-shell";
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
            <button
              className={styles.createButton}
              type="button"
              disabled
              aria-describedby="create-project-note"
            >
              <span aria-hidden="true">+</span>
              New project
            </button>
            <span className={styles.createNote} id="create-project-note">
              Available after frontend integration
            </span>
          </div>
        </header>

        <section
          className={styles.projectsSection}
          aria-labelledby="recent-projects-title"
        >
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Keep your momentum</p>
              <h2 id="recent-projects-title">Recent projects</h2>
            </div>
            <span className={styles.projectCount}>0 projects</span>
          </div>

          <div className={styles.emptyState}>
            <div className={styles.emptyCopy}>
              <p className={styles.emptyKicker}>The next chapter</p>
              <h3>Big ideas. Clear plans.</h3>
              <p>
                No projects yet. When Idea Capture is ready, your first project
                will show up here.
              </p>
            </div>
            <div className={styles.emptyVisual} aria-hidden="true">
              <span className={styles.visualLabel}>Projects</span>
              <span className={styles.visualNumber}>00</span>
              <span className={styles.visualFooter}>Start here</span>
            </div>
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}
