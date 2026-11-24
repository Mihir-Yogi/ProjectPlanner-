export type SavedProject = {
  id: string;
  title: string;
  brief: string;
  mode: "idea" | "client";
  projectType: string;
  businessType: string | null;
  scope: string[];
  stack: {
    frontend: string;
    backend: string;
    database: string;
    services: string;
  };
  openQuestions: string[];
  createdAt: string;
  updatedAt: string;
};

export type SavedProjectDraft = Omit<
  SavedProject,
  "id" | "createdAt" | "updatedAt"
>;

const STORAGE_KEY = "project-planner.saved-projects.v1";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isSavedProject(value: unknown): value is SavedProject {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const project = value as Record<string, unknown>;
  const stack = project.stack;

  return (
    typeof project.id === "string" &&
    typeof project.title === "string" &&
    typeof project.brief === "string" &&
    (project.mode === "idea" || project.mode === "client") &&
    typeof project.projectType === "string" &&
    (typeof project.businessType === "string" ||
      project.businessType === null) &&
    isStringArray(project.scope) &&
    typeof stack === "object" &&
    stack !== null &&
    typeof (stack as Record<string, unknown>).frontend === "string" &&
    typeof (stack as Record<string, unknown>).backend === "string" &&
    typeof (stack as Record<string, unknown>).database === "string" &&
    typeof (stack as Record<string, unknown>).services === "string" &&
    isStringArray(project.openQuestions) &&
    typeof project.createdAt === "string" &&
    typeof project.updatedAt === "string"
  );
}

function getStorage() {
  if (typeof window === "undefined") {
    throw new Error("Projects can only be accessed in a browser.");
  }

  try {
    return window.localStorage;
  } catch {
    throw new Error("Browser storage is unavailable for saved projects.");
  }
}

export function getSavedProjects(): SavedProject[] {
  const storage = getStorage();
  let serialized: string | null;

  try {
    serialized = storage.getItem(STORAGE_KEY);
  } catch {
    throw new Error("Saved projects could not be read from browser storage.");
  }

  if (serialized === null) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    throw new Error("Saved project data is invalid and could not be loaded.");
  }

  if (!Array.isArray(parsed) || !parsed.every(isSavedProject)) {
    throw new Error("Saved project data is invalid and could not be loaded.");
  }

  return [...parsed].sort(
    (first, second) =>
      Date.parse(second.updatedAt) - Date.parse(first.updatedAt),
  );
}

export function getSavedProject(projectId: string): SavedProject | null {
  return getSavedProjects().find((project) => project.id === projectId) ?? null;
}

export function saveProject(
  draft: SavedProjectDraft,
  projectId?: string,
): SavedProject {
  const storage = getStorage();
  const projects = getSavedProjects();
  const existingProject = projectId
    ? projects.find((project) => project.id === projectId)
    : undefined;
  const now = new Date().toISOString();

  if (!projectId && typeof window.crypto.randomUUID !== "function") {
    throw new Error("This browser cannot create a unique project ID.");
  }

  const savedProject: SavedProject = {
    ...draft,
    id: existingProject?.id ?? projectId ?? window.crypto.randomUUID(),
    createdAt: existingProject?.createdAt ?? now,
    updatedAt: now,
  };
  const nextProjects = [
    savedProject,
    ...projects.filter((project) => project.id !== savedProject.id),
  ];

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(nextProjects));
  } catch {
    throw new Error(
      "This project could not be saved. Check that browser storage is enabled and has space.",
    );
  }

  return savedProject;
}
