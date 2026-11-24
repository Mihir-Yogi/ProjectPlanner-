"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSavedProject, type SavedProject } from "@/lib/project-storage";
import styles from "./project-details.module.css";

type ProjectDetailsProps = {
  projectId: string;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "This project could not be loaded.";
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const [project, setProject] = useState<SavedProject | null>(null);
  const [error, setError] = useState("");
  const [loadedProjectId, setLoadedProjectId] = useState<string | null>(null);
  const isLoading = loadedProjectId !== projectId;

  useEffect(() => {
    function loadProject() {
      try {
        setProject(getSavedProject(projectId));
        setError("");
      } catch (loadError) {
        setProject(null);
        setError(getErrorMessage(loadError));
      } finally {
        setLoadedProjectId(projectId);
      }
    }

    loadProject();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className={styles.content}>
        <p className={styles.loading} role="status">
          Loading project…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.content}>
        <Link className={styles.backLink} href="/#recent-projects-title">
          Back to projects
        </Link>
        <p className={styles.error} role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.content}>
        <Link className={styles.backLink} href="/#recent-projects-title">
          Back to projects
        </Link>
        <section className={styles.notFound}>
          <p className={styles.eyebrow}>Project not found</p>
          <h1>This saved project isn’t available in this browser.</h1>
          <p>
            It may have been cleared from browser storage or saved in a
            different browser.
          </p>
        </section>
      </div>
    );
  }

  const updatedDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(project.updatedAt));

  return (
    <div className={styles.content}>
      <Link className={styles.backLink} href="/#recent-projects-title">
        Back to projects
      </Link>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>
            {project.mode === "client" ? "Client project" : "Personal idea"} ·
            Saved project
          </p>
          <h1>{project.title}</h1>
          <p className={styles.pageDescription}>{project.brief}</p>
        </div>
        <p className={styles.savedLabel}>Saved in this browser</p>
      </header>

      <p className={styles.updatedDate}>Last saved {updatedDate}</p>

      <section className={styles.detailSection} aria-labelledby="scope-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>01 / Scope</p>
          <h2 id="scope-heading">First-version features</h2>
        </div>
        {project.scope.length > 0 ? (
          <ul className={styles.featureList}>
            {project.scope.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyNote}>No features have been selected yet.</p>
        )}
      </section>

      <section className={styles.detailSection} aria-labelledby="stack-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>02 / Technology</p>
          <h2 id="stack-heading">Selected stack</h2>
        </div>
        <dl className={styles.stackList}>
          <div>
            <dt>Project type</dt>
            <dd>{project.projectType}</dd>
          </div>
          {project.businessType && (
            <div>
              <dt>Business type</dt>
              <dd>{project.businessType}</dd>
            </div>
          )}
          <div>
            <dt>Frontend</dt>
            <dd>{project.stack.frontend}</dd>
          </div>
          <div>
            <dt>Backend / API</dt>
            <dd>{project.stack.backend}</dd>
          </div>
          <div>
            <dt>Database / storage</dt>
            <dd>{project.stack.database}</dd>
          </div>
          <div>
            <dt>Other services</dt>
            <dd>{project.stack.services}</dd>
          </div>
        </dl>
      </section>

      <section
        className={styles.detailSection}
        aria-labelledby="open-questions-heading"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>03 / Next decisions</p>
          <h2 id="open-questions-heading">Still to clarify</h2>
        </div>
        {project.openQuestions.length > 0 ? (
          <ul className={styles.questionList}>
            {project.openQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyNote}>
            No open discovery questions. Confirm the plan with the project
            owner before work begins.
          </p>
        )}
      </section>

      <div className={styles.actions}>
        <Link className={styles.primaryAction} href="/projects/new/discovery">
          Start a new project
        </Link>
      </div>
    </div>
  );
}
