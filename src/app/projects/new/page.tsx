import Link from "next/link";
import { WorkspaceShell } from "@/components/workspace-shell";
import { CaptureExperience } from "./capture-experience";
import styles from "./page.module.css";

export default function QuickIdeaCapturePage() {
  return (
    <WorkspaceShell activePage="capture">
      <div className={styles.content}>
        <Link className={styles.backLink} href="/">
          Back to Dashboard
        </Link>
        <CaptureExperience />
      </div>
    </WorkspaceShell>
  );
}
