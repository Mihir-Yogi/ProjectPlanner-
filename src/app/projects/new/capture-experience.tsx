"use client";

import { useState } from "react";
import styles from "./page.module.css";

export function CaptureExperience() {
  const [projectName, setProjectName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const nameError = nameTouched && projectName.trim().length === 0;

  return (
    <div className={styles.captureLayout}>
      <section className={styles.introPanel} aria-labelledby="capture-title">
        <div>
          <p className={styles.eyebrow}>Quick capture</p>
          <h1 id="capture-title">Catch the idea while it is clear.</h1>
          <p className={styles.introText}>
            Start with a name. Add a little context while the idea is fresh.
          </p>
        </div>

        <div className={styles.stepNote}>
          <span className={styles.stepNumber} aria-hidden="true">
            01
          </span>
          <div>
            <p className={styles.stepLabel}>Step 01</p>
            <p className={styles.stepCopy}>
              Keep it rough. You can add detail as you work through the
              questions.
            </p>
          </div>
        </div>
      </section>

      <form className={styles.captureForm}>
        <div className={styles.formHeading}>
          <p className={styles.eyebrow}>First, the basics</p>
          <h2>Shape the first note</h2>
          <p>Only the project name is required.</p>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="project-name">
            Project name <span>Required</span>
          </label>
          <input
            id="project-name"
            name="projectName"
            type="text"
            placeholder="Give your idea a name"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            onBlur={() => setNameTouched(true)}
            aria-invalid={nameError}
            aria-describedby={
              nameError
                ? "project-name-hint project-name-error"
                : "project-name-hint"
            }
            required
          />
          <p className={styles.fieldHint} id="project-name-hint">
            A short working title is enough.
          </p>
          {nameError && (
            <p
              className={styles.fieldError}
              id="project-name-error"
              role="alert"
            >
              Enter a project name to continue.
            </p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="project-description">
            Short description <span>Optional</span>
          </label>
          <textarea
            id="project-description"
            name="description"
            placeholder="What are you imagining?"
            rows={4}
          />
        </div>

        <div className={styles.saveArea}>
          <button
            className={styles.saveButton}
            type="submit"
            disabled
            aria-describedby="save-note"
          >
            Save idea
          </button>
          <p className={styles.saveNote} id="save-note">
            Saving will be available during frontend integration.
          </p>
        </div>
      </form>
    </div>
  );
}
