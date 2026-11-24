import Link from "next/link";
import { WorkspaceShell } from "@/components/workspace-shell";
import { GuidedDiscoveryExperience } from "./guided-discovery-experience";
import styles from "./page.module.css";

export default function GuidedDiscoveryPage() {
  return (
    <WorkspaceShell activePage="discovery">
      <div className={styles.content}>
        <Link className={styles.backLink} href="/projects/new">
          Back to Quick Idea Capture
        </Link>
        <GuidedDiscoveryExperience />
      </div>
    </WorkspaceShell>
  );
}
