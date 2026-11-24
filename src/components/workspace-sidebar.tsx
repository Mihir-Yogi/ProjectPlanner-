"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./workspace-shell.module.css";

export type WorkspacePage =
  | "dashboard"
  | "capture"
  | "discovery"
  | "projects";

type WorkspaceSidebarProps = {
  activePage: WorkspacePage;
};

const futureNavigation = ["Templates", "Settings"];

export function WorkspaceSidebar({ activePage }: WorkspaceSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDashboard = activePage === "dashboard";
  const isCapture = activePage === "capture";
  const isDiscovery = activePage === "discovery";
  const isProjects = activePage === "projects";
  const closeNavigation = () => setIsOpen(false);

  return (
    <div className={styles.sidebarInner}>
      <div className={styles.sidebarHeader}>
        <Link
          className={styles.brand}
          href="/"
          aria-label="ProjectPlanner home"
          onClick={closeNavigation}
        >
          <span className={styles.brandMark} aria-hidden="true">
            P
          </span>
          <span className={styles.brandName}>ProjectPlanner</span>
        </Link>

        <button
          className={styles.menuToggle}
          type="button"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="workspace-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span
            className={`${styles.menuIcon} ${
              isOpen ? styles.menuIconOpen : ""
            }`}
            aria-hidden="true"
          >
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
          </span>
          <span className={styles.menuToggleText}>
            {isOpen ? "Close" : "Menu"}
          </span>
        </button>
      </div>

      <div
        className={`${styles.sidebarContent} ${
          isOpen ? styles.sidebarContentOpen : ""
        }`}
      >
        <div className={styles.workspaceLabel}>Workspace</div>

        <nav
          className={styles.navigation}
          id="workspace-navigation"
          aria-label="Main navigation"
        >
          <ul className={`${styles.navigationList} ${styles.mobileMenuList}`}>
            <li>
              <Link
                className={`${styles.navigationItem} ${
                  isDashboard ? styles.activeNavigationItem : ""
                }`}
                href="/"
                aria-current={isDashboard ? "page" : undefined}
                onClick={closeNavigation}
              >
                Dashboard
              </Link>
            </li>
            {isCapture ? (
              <li>
                <span
                  className={`${styles.navigationItem} ${styles.activeNavigationItem}`}
                  aria-current="page"
                >
                  Capture
                </span>
              </li>
            ) : (
              <li>
                <Link
                  className={styles.navigationItem}
                  href="/projects/new"
                  onClick={closeNavigation}
                >
                  Capture
                </Link>
              </li>
            )}
            {isDiscovery ? (
              <li>
                <span
                  className={`${styles.navigationItem} ${styles.activeNavigationItem}`}
                  aria-current="page"
                >
                  Discovery
                </span>
              </li>
            ) : (
              <li>
                <Link
                  className={styles.navigationItem}
                  href="/projects/new/discovery"
                  onClick={closeNavigation}
                >
                  Discovery
                </Link>
              </li>
            )}
            <li>
              <Link
                className={`${styles.navigationItem} ${
                  isProjects ? styles.activeNavigationItem : ""
                }`}
                href="/#recent-projects-title"
                aria-current={isProjects ? "page" : undefined}
                onClick={closeNavigation}
              >
                Projects
              </Link>
            </li>
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
    </div>
  );
}
