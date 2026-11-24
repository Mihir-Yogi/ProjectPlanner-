import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./workspace-shell.module.css";

type WorkspaceShellProps = {
  activePage: "dashboard" | "capture";
  children: ReactNode;
};

const futureNavigation = ["Projects", "Templates", "Settings"];

export function WorkspaceShell({
  activePage,
  children,
}: WorkspaceShellProps) {
  const isDashboard = activePage === "dashboard";

  return (
    <div className={styles.appFrame}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarInner}>
          <Link className={styles.brand} href="/" aria-label="ProjectPlanner home">
            <span className={styles.brandMark} aria-hidden="true">
              P
            </span>
            <span className={styles.brandName}>ProjectPlanner</span>
          </Link>

          <div className={styles.workspaceLabel}>Workspace</div>

          <nav className={styles.navigation} aria-label="Main navigation">
            <ul
              className={
                activePage === "capture"
                  ? `${styles.navigationList} ${styles.captureNavigationList}`
                  : styles.navigationList
              }
            >
              <li>
                <Link
                  className={`${styles.navigationItem} ${
                    isDashboard ? styles.activeNavigationItem : ""
                  }`}
                  href="/"
                  aria-current={isDashboard ? "page" : undefined}
                >
                  Dashboard
                </Link>
              </li>
              {activePage === "capture" && (
                <li>
                  <span
                    className={`${styles.navigationItem} ${styles.activeNavigationItem}`}
                    aria-current="page"
                  >
                    Capture
                  </span>
                </li>
              )}
              {futureNavigation.map((item) => (
                <li key={item}>
                  <span className={styles.navigationItem} aria-disabled="true">
                    {item}
                    <span className={styles.navigationStatus}>Soon</span>
                  </span>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.sidebarNote}>
            <span className={styles.sidebarNoteLabel}>A little more focus</span>
            <p>Turn the next good idea into a plan you can follow.</p>
          </div>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
