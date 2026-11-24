"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSavedProjects, type SavedProject } from "@/lib/project-storage";
import styles from "./page.module.css";

export function DashboardProjects() {
  const [projects, setProjects] = useState<SavedProject[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    function refreshProjects() {
      try {
        setProjects(getSavedProjects());
        setError("");
      } catch (loadError) {
        setProjects(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Saved projects could not be loaded.",
        );
      }
    }

    refreshProjects();
    window.addEventListener("storage", refreshProjects);
    window.addEventListener("focus", refreshProjects);

    return () => {
      window.removeEventListener("storage", refreshProjects);
      window.removeEventListener("focus", refreshProjects);
    };
  }, []);

  const projectCount = projects?.length ?? 0;

  return (
    <section
      className={styles.projectsSection}
      aria-labelledby="recent-projects-title"
    >
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.eyebrow}>Keep your momentum</p>
          <h2 id="recent-projects-title">Recent projects</h2>
        </div>
        <span className={styles.projectCount}>
          {projects === null
            ? "Loading"
            : `${projectCount} ${projectCount === 1 ? "project" : "projects"}`}
        </span>
      </div>

      {error ? (
        <p className={styles.projectsError} role="alert">
          {error}
        </p>
      ) : projects === null ? (
        <p className={styles.projectsLoading} role="status">
          Loading your saved projects…
        </p>
      ) : projects.length > 0 ? (
        <ul className={styles.savedProjectsList}>
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                className={styles.savedProjectCard}
                href={`/projects/${project.id}`}
              >
                <span className={styles.savedProjectType}>
                  {project.mode === "client" ? "Client project" : "Personal idea"}
                </span>
                <h3>{project.title}</h3>
                <p className={styles.savedProjectBrief}>{project.brief}</p>
                <span className={styles.savedProjectFooter}>
                  Updated{" "}
                  {new Intl.DateTimeFormat(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(project.updatedAt))}
                  <span aria-hidden="true">Open project →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyCopy}>
            <p className={styles.emptyKicker}>The next chapter</p>
            <h3>Big ideas. Clear plans.</h3>
            <p>
              No saved projects yet. Create a plan and save it to see it here.
            </p>
          </div>
          <div className={styles.emptyVisual} aria-hidden="true">
            <span className={styles.visualLabel}>Projects</span>
            <span className={styles.visualNumber}>00</span>
            <span className={styles.visualFooter}>Start here</span>
          </div>
        </div>
      )}
    </section>
  );
}
