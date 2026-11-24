import type { ReactNode } from "react";
import { WorkspaceSidebar, type WorkspacePage } from "./workspace-sidebar";
import styles from "./workspace-shell.module.css";

type WorkspaceShellProps = {
  activePage: WorkspacePage;
  children: ReactNode;
};

export function WorkspaceShell({
  activePage,
  children,
}: WorkspaceShellProps) {
  return (
    <div className={styles.appFrame}>
      <aside className={styles.sidebar}>
        <WorkspaceSidebar activePage={activePage} />
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
