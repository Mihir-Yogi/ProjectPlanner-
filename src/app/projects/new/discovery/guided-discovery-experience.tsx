"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./guided-discovery-experience.module.css";

type ProjectType =
  | "web"
  | "mobile"
  | "desktop"
  | "game"
  | "api"
  | "data"
  | "automation";

type TechCategoryId =
  | "frontend"
  | "backend"
  | "database"
  | "mobile"
  | "desktop"
  | "game"
  | "ai-data"
  | "deployment"
  | "languages"
  | "automation";

type Choice = {
  label: string;
  value: string;
  description?: string;
};

type ProjectTypeChoice = Omit<Choice, "value"> & {
  value: ProjectType;
};

type TechnologyChoice = Choice & {
  aliases?: string[];
};

type TechnologyCategory = {
  id: TechCategoryId;
  label: string;
  title: string;
  description: string;
  choices: TechnologyChoice[];
};

type ProjectTypeStep = {
  id: "project-type";
  type: "single";
  group: "Project";
  title: string;
  description: string;
  choices: ProjectTypeChoice[];
};

type ExperienceStep = {
  id: "experience";
  type: "single";
  group: "Direction";
  title: string;
  description: string;
  choices: Choice[];
};

type TextStep = {
  id: "goal" | "audience";
  type: "text";
  group: "Direction";
  title: string;
  description: string;
  field: "goal" | "audience";
  label: string;
  placeholder: string;
};

type PlatformStep = {
  id: "platforms";
  type: "multi";
  group: "Direction";
  title: string;
  description: string;
  choices: Choice[];
};

type TechnologyStep = {
  id: `technology-${TechCategoryId}`;
  type: "technology";
  group: "Technology";
  category: TechnologyCategory;
};

type DiscoveryStep =
  | ProjectTypeStep
  | ExperienceStep
  | TextStep
  | PlatformStep
  | TechnologyStep;

type Answers = {
  projectType: ProjectType | null;
  goal: string;
  goalNotDecided: boolean;
  audience: string;
  audienceNotDecided: boolean;
  experience: string | null;
  platforms: string[];
  platformsNotDecided: boolean;
  technology: Partial<Record<TechCategoryId, string[]>>;
  technologyNotDecided: Partial<Record<TechCategoryId, boolean>>;
};

const PROJECT_TYPE_CHOICES: ProjectTypeChoice[] = [
  {
    label: "Web app",
    value: "web",
    description: "A website or interactive experience in a browser.",
  },
  {
    label: "Mobile app",
    value: "mobile",
    description: "An app designed for iOS, Android, or both.",
  },
  {
    label: "Desktop app",
    value: "desktop",
    description: "Software people install and use on a computer.",
  },
  {
    label: "Game",
    value: "game",
    description: "A playable experience for one or more platforms.",
  },
  {
    label: "API or service",
    value: "api",
    description: "A backend service, API, or integration.",
  },
  {
    label: "Data or AI project",
    value: "data",
    description: "A data workflow, model, or AI-powered product.",
  },
  {
    label: "Automation or tool",
    value: "automation",
    description: "A script or workflow that removes repetitive work.",
  },
];

const EXPERIENCE_CHOICES: Choice[] = [
  { label: "I am new to building projects", value: "new" },
  { label: "I have tried a few things", value: "some" },
  { label: "I feel confident building software", value: "confident" },
  { label: "Not decided yet", value: "not-decided" },
];

const PLATFORM_CHOICES: Record<ProjectType, Choice[]> = {
  web: [
    { label: "Desktop browsers", value: "Desktop browsers" },
    { label: "Mobile browsers", value: "Mobile browsers" },
    { label: "Tablet browsers", value: "Tablet browsers" },
  ],
  mobile: [
    { label: "iOS", value: "iOS" },
    { label: "Android", value: "Android" },
    { label: "Both iOS and Android", value: "Both iOS and Android" },
  ],
  desktop: [
    { label: "Windows", value: "Windows" },
    { label: "macOS", value: "macOS" },
    { label: "Linux", value: "Linux" },
  ],
  game: [
    { label: "PC", value: "PC" },
    { label: "Web", value: "Web" },
    { label: "Mobile", value: "Mobile" },
    { label: "Console", value: "Console" },
  ],
  api: [
    { label: "Public API", value: "Public API" },
    { label: "Internal service", value: "Internal service" },
    { label: "Third-party integrations", value: "Third-party integrations" },
  ],
  data: [
    { label: "Local analysis or notebook", value: "Local analysis or notebook" },
    { label: "Web-based dashboard", value: "Web-based dashboard" },
    { label: "Scheduled data pipeline", value: "Scheduled data pipeline" },
    { label: "API or service", value: "API or service" },
  ],
  automation: [
    { label: "Local scripts", value: "Local scripts" },
    { label: "Browser automation", value: "Browser automation" },
    { label: "Scheduled cloud jobs", value: "Scheduled cloud jobs" },
    { label: "Workflow integrations", value: "Workflow integrations" },
  ],
};

const TECHNOLOGY_CATEGORIES: Record<TechCategoryId, TechnologyCategory> = {
  frontend: {
    id: "frontend",
    label: "Frontend",
    title: "What might power the interface?",
    description: "Choose any options you want to explore. Search filters this curated list.",
    choices: [
      { label: "React", value: "React", aliases: ["reactjs"] },
      { label: "Next.js", value: "Next.js", aliases: ["next", "nextjs"] },
      { label: "Vue", value: "Vue", aliases: ["vuejs"] },
      { label: "Nuxt", value: "Nuxt", aliases: ["nuxtjs"] },
      { label: "Angular", value: "Angular", aliases: ["angularjs"] },
      { label: "Svelte", value: "Svelte", aliases: ["sveltekit"] },
      { label: "Astro", value: "Astro", aliases: ["astrojs"] },
      { label: "SolidJS", value: "SolidJS", aliases: ["solid"] },
      { label: "HTML, CSS, and JavaScript", value: "HTML, CSS, and JavaScript" },
      { label: "Qwik", value: "Qwik", aliases: ["qwik city"] },
      { label: "Remix", value: "Remix", aliases: ["react router"] },
      { label: "Ember", value: "Ember", aliases: ["emberjs"] },
    ],
  },
  backend: {
    id: "backend",
    label: "Backend",
    title: "Which backend tools should we keep in mind?",
    description: "Select one or more listed frameworks, runtimes, or services.",
    choices: [
      { label: "Node.js", value: "Node.js", aliases: ["node", "nodejs"] },
      { label: "Express", value: "Express", aliases: ["expressjs"] },
      { label: "NestJS", value: "NestJS", aliases: ["nest"] },
      { label: "Django", value: "Django" },
      { label: "FastAPI", value: "FastAPI" },
      { label: "Flask", value: "Flask" },
      { label: "Ruby on Rails", value: "Ruby on Rails", aliases: ["rails"] },
      { label: "Laravel", value: "Laravel" },
      { label: "Spring Boot", value: "Spring Boot", aliases: ["spring"] },
      { label: "ASP.NET Core", value: "ASP.NET Core", aliases: ["dotnet", ".net"] },
      { label: "Go", value: "Go", aliases: ["golang"] },
      { label: "Rust", value: "Rust" },
      { label: "Supabase", value: "Supabase" },
      { label: "Firebase", value: "Firebase" },
    ],
  },
  database: {
    id: "database",
    label: "Data",
    title: "Where could project data live?",
    description: "Pick any databases or data services you would like to consider.",
    choices: [
      { label: "PostgreSQL", value: "PostgreSQL", aliases: ["postgres", "postgresql"] },
      { label: "MySQL", value: "MySQL" },
      { label: "SQLite", value: "SQLite" },
      { label: "MongoDB", value: "MongoDB", aliases: ["mongo"] },
      { label: "Redis", value: "Redis" },
      { label: "Supabase", value: "Supabase" },
      { label: "Firebase Firestore", value: "Firebase Firestore", aliases: ["firestore"] },
      { label: "DynamoDB", value: "DynamoDB", aliases: ["aws dynamodb"] },
      { label: "Neon", value: "Neon", aliases: ["neon postgres"] },
      { label: "PlanetScale", value: "PlanetScale" },
      { label: "No database yet", value: "No database yet" },
    ],
  },
  mobile: {
    id: "mobile",
    label: "Mobile",
    title: "Which mobile technologies interest you?",
    description: "Choose from this curated list of native and cross-platform tools.",
    choices: [
      { label: "React Native", value: "React Native", aliases: ["rn"] },
      { label: "Expo", value: "Expo" },
      { label: "Flutter", value: "Flutter" },
      { label: "SwiftUI", value: "SwiftUI" },
      { label: "Swift", value: "Swift" },
      { label: "Kotlin", value: "Kotlin" },
      { label: "Jetpack Compose", value: "Jetpack Compose" },
      { label: ".NET MAUI", value: ".NET MAUI", aliases: ["maui"] },
      { label: "Ionic", value: "Ionic" },
      { label: "Capacitor", value: "Capacitor" },
      { label: "NativeScript", value: "NativeScript" },
    ],
  },
  desktop: {
    id: "desktop",
    label: "Desktop",
    title: "Which desktop technologies should we consider?",
    description: "Search and select any listed tools that fit your direction.",
    choices: [
      { label: "Electron", value: "Electron" },
      { label: "Tauri", value: "Tauri" },
      { label: "Qt", value: "Qt" },
      { label: ".NET MAUI", value: ".NET MAUI", aliases: ["maui"] },
      { label: "WPF", value: "WPF", aliases: ["windows presentation foundation"] },
      { label: "Swift and AppKit", value: "Swift and AppKit", aliases: ["mac app"] },
      { label: "JavaFX", value: "JavaFX" },
      { label: "GTK", value: "GTK" },
      { label: "Avalonia UI", value: "Avalonia UI" },
    ],
  },
  game: {
    id: "game",
    label: "Game engines",
    title: "Which game tools could bring it to life?",
    description: "The list covers a range of 2D, 3D, and open-source engines.",
    choices: [
      { label: "Unity", value: "Unity" },
      { label: "Unreal Engine", value: "Unreal Engine", aliases: ["unreal"] },
      { label: "Godot", value: "Godot" },
      { label: "GameMaker", value: "GameMaker", aliases: ["gamemaker studio"] },
      { label: "Defold", value: "Defold" },
      { label: "Bevy", value: "Bevy" },
      { label: "Phaser", value: "Phaser" },
    ],
  },
  "ai-data": {
    id: "ai-data",
    label: "Data and AI",
    title: "Which data or AI tools are worth exploring?",
    description: "Choose any listed libraries, platforms, or APIs to investigate.",
    choices: [
      { label: "Python", value: "Python", aliases: ["py"] },
      { label: "PyTorch", value: "PyTorch", aliases: ["torch"] },
      { label: "TensorFlow", value: "TensorFlow", aliases: ["tf"] },
      { label: "scikit-learn", value: "scikit-learn", aliases: ["sklearn"] },
      { label: "Hugging Face", value: "Hugging Face", aliases: ["transformers"] },
      { label: "LangChain", value: "LangChain" },
      { label: "LlamaIndex", value: "LlamaIndex" },
      { label: "OpenAI API", value: "OpenAI API" },
      { label: "Anthropic API", value: "Anthropic API" },
      { label: "Jupyter", value: "Jupyter", aliases: ["notebook"] },
      { label: "Pandas", value: "Pandas" },
      { label: "Apache Spark", value: "Apache Spark", aliases: ["pyspark"] },
    ],
  },
  deployment: {
    id: "deployment",
    label: "Deployment",
    title: "Where might this project run?",
    description: "Select any hosting or infrastructure options you want to explore.",
    choices: [
      { label: "Vercel", value: "Vercel" },
      { label: "Netlify", value: "Netlify" },
      { label: "Cloudflare", value: "Cloudflare" },
      { label: "AWS", value: "AWS", aliases: ["amazon web services"] },
      { label: "Microsoft Azure", value: "Microsoft Azure", aliases: ["azure"] },
      { label: "Google Cloud", value: "Google Cloud", aliases: ["gcp"] },
      { label: "Fly.io", value: "Fly.io", aliases: ["fly"] },
      { label: "Render", value: "Render" },
      { label: "Railway", value: "Railway" },
      { label: "Docker", value: "Docker" },
      { label: "Kubernetes", value: "Kubernetes", aliases: ["k8s"] },
    ],
  },
  languages: {
    id: "languages",
    label: "Languages",
    title: "Which programming languages do you prefer?",
    description: "Choose familiar languages or ones you would like to learn.",
    choices: [
      { label: "TypeScript", value: "TypeScript", aliases: ["ts"] },
      { label: "JavaScript", value: "JavaScript", aliases: ["js"] },
      { label: "Python", value: "Python", aliases: ["py"] },
      { label: "C#", value: "C#", aliases: ["csharp", "c sharp", "dotnet"] },
      { label: "Java", value: "Java" },
      { label: "Kotlin", value: "Kotlin" },
      { label: "Swift", value: "Swift" },
      { label: "Go", value: "Go", aliases: ["golang"] },
      { label: "Rust", value: "Rust" },
      { label: "SQL", value: "SQL" },
      { label: "C++", value: "C++", aliases: ["cpp"] },
      { label: "Ruby", value: "Ruby" },
      { label: "PHP", value: "PHP" },
    ],
  },
  automation: {
    id: "automation",
    label: "Automation",
    title: "Which automation tools fit the workflow?",
    description: "Choose tools or platforms you would like to build with.",
    choices: [
      { label: "Python scripts", value: "Python scripts", aliases: ["py"] },
      { label: "Node.js scripts", value: "Node.js scripts", aliases: ["node"] },
      { label: "Zapier", value: "Zapier" },
      { label: "Make", value: "Make", aliases: ["integromat"] },
      { label: "n8n", value: "n8n" },
      { label: "GitHub Actions", value: "GitHub Actions" },
      { label: "Power Automate", value: "Power Automate" },
      { label: "Browser automation tools", value: "Browser automation tools" },
    ],
  },
};

const TECHNOLOGY_PATHS: Record<ProjectType, TechCategoryId[]> = {
  web: ["frontend", "backend", "database", "deployment"],
  mobile: ["mobile", "backend", "database", "deployment"],
  desktop: ["desktop", "languages", "database"],
  game: ["game", "languages"],
  api: ["backend", "database", "deployment", "languages"],
  data: ["ai-data", "languages", "database", "deployment"],
  automation: ["automation", "languages", "deployment"],
};

const projectTypeStep: ProjectTypeStep = {
  id: "project-type",
  type: "single",
  group: "Project",
  title: "What kind of project are you imagining?",
  description:
    "Choose the closest fit. Your answer shapes the follow-up questions and technology lists.",
  choices: PROJECT_TYPE_CHOICES,
};

const goalStep: TextStep = {
  id: "goal",
  type: "text",
  group: "Direction",
  title: "What would you like this project to do?",
  description:
    "A rough outcome is enough. You can leave this blank or mark it undecided.",
  field: "goal",
  label: "The idea, in a sentence or two",
  placeholder: "I want to make it easier to...",
};

const audienceStep: TextStep = {
  id: "audience",
  type: "text",
  group: "Direction",
  title: "Who is this project for?",
  description:
    "Think about the people who might use it. It is fine if you are still figuring that out.",
  field: "audience",
  label: "People you have in mind",
  placeholder: "For example, students, small teams, or just me",
};

const experienceStep: ExperienceStep = {
  id: "experience",
  type: "single",
  group: "Direction",
  title: "How do you feel about building software?",
  description:
    "This helps keep the eventual plan at a comfortable level. There is no wrong answer.",
  choices: EXPERIENCE_CHOICES,
};

function createSteps(projectType: ProjectType | null): DiscoveryStep[] {
  if (!projectType) {
    return [projectTypeStep];
  }

  return [
    projectTypeStep,
    goalStep,
    audienceStep,
    experienceStep,
    {
      id: "platforms",
      type: "multi",
      group: "Direction",
      title: "Where should people be able to use it?",
      description:
        "Select any that fit. You can leave this open if you have not decided.",
      choices: PLATFORM_CHOICES[projectType],
    },
    ...TECHNOLOGY_PATHS[projectType].map((categoryId) => {
      const category = TECHNOLOGY_CATEGORIES[categoryId];
      return {
        id: `technology-${categoryId}` as const,
        type: "technology" as const,
        group: "Technology" as const,
        category,
      };
    }),
  ];
}

function createInitialAnswers(): Answers {
  return {
    projectType: null,
    goal: "",
    goalNotDecided: false,
    audience: "",
    audienceNotDecided: false,
    experience: null,
    platforms: [],
    platformsNotDecided: false,
    technology: {},
    technologyNotDecided: {},
  };
}

function getChoiceLabel(choices: Choice[], value: string | null) {
  return choices.find((choice) => choice.value === value)?.label ?? "Skipped";
}

export function GuidedDiscoveryExperience() {
  const [answers, setAnswers] = useState<Answers>(createInitialAnswers);
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState({ stepId: "", value: "" });
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousActiveIndex = useRef(activeIndex);
  const steps = createSteps(answers.projectType);
  const currentStep = steps[activeIndex];
  const isReview = activeIndex >= steps.length;
  const currentSearch = search.stepId === currentStep?.id ? search.value : "";
  const progressValue = isReview
    ? 100
    : answers.projectType
      ? Math.round((activeIndex / steps.length) * 100)
      : 0;
  const progressLabel = answers.projectType
    ? `${activeIndex + 1} / ${steps.length}`
    : null;

  useEffect(() => {
    if (previousActiveIndex.current !== activeIndex) {
      const heading = questionHeadingRef.current;
      heading?.focus({ preventScroll: true });
      if (heading) {
        window.scrollTo(
          0,
          window.scrollY + heading.getBoundingClientRect().top - 20,
        );
      }
      previousActiveIndex.current = activeIndex;
    }
  }, [activeIndex]);

  function chooseProjectType(value: ProjectType) {
    setAnswers((previous) => ({
      ...previous,
      projectType: value,
      platforms: [],
      platformsNotDecided: false,
      technology: {},
      technologyNotDecided: {},
    }));
  }

  function chooseSingle(step: ProjectTypeStep | ExperienceStep, value: string) {
    if (step.id === "project-type") {
      const selectedType = step.choices.find(
        (choice) => choice.value === value,
      );
      if (!selectedType) {
        throw new Error("Unknown project type choice.");
      }

      chooseProjectType(selectedType.value);
      return;
    }

    setAnswers((previous) => ({ ...previous, experience: value }));
  }

  function togglePlatform(value: string) {
    setAnswers((previous) => ({
      ...previous,
      platforms: previous.platforms.includes(value)
        ? previous.platforms.filter((platform) => platform !== value)
        : [...previous.platforms, value],
      platformsNotDecided: false,
    }));
  }

  function toggleTechnology(categoryId: TechCategoryId, value: string) {
    setAnswers((previous) => {
      const selected = previous.technology[categoryId] ?? [];
      return {
        ...previous,
        technology: {
          ...previous.technology,
          [categoryId]: selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value],
        },
        technologyNotDecided: {
          ...previous.technologyNotDecided,
          [categoryId]: false,
        },
      };
    });
  }

  function goBack() {
    setActiveIndex((index) => Math.max(0, index - 1));
    setSearch({ stepId: "", value: "" });
  }

  function goForward() {
    if (
      currentStep?.id === "project-type" &&
      answers.projectType === null
    ) {
      return;
    }

    if (
      currentStep?.id === "experience" &&
      answers.experience === null
    ) {
      return;
    }

    setActiveIndex((index) => Math.min(steps.length, index + 1));
    setSearch({ stepId: "", value: "" });
  }

  function startOver() {
    setAnswers(createInitialAnswers());
    setActiveIndex(0);
    setSearch({ stepId: "", value: "" });
  }

  return (
    <div className={styles.experience}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Guided discovery / Step 02</p>
          <h1>Give your idea a direction.</h1>
          <p className={styles.pageDescription}>
            One question at a time. Your answers help shape a starting point,
            not a locked-in plan.
          </p>
        </div>
        <p className={styles.memoryNote}>
          <span className={styles.memoryDot} aria-hidden="true" />
          Stays in this page · Not saved
        </p>
      </header>

      <section className={styles.wizard} aria-label="Guided project discovery">
        <div className={styles.progressArea}>
          <div className={styles.progressTopline}>
            <ol className={styles.progressGroups} aria-label="Question groups">
              {(["Project", "Direction", "Technology"] as const).map(
                (group) => {
                  const groupSteps = steps.filter(
                    (step) => step.group === group,
                  );
                  const isComplete =
                    isReview ||
                    (groupSteps.length > 0 &&
                      groupSteps.every((step) => steps.indexOf(step) < activeIndex));
                  const isActive = currentStep?.group === group;

                  return (
                    <li
                      className={`${styles.progressGroup} ${
                        isActive ? styles.activeProgressGroup : ""
                      } ${isComplete ? styles.completeProgressGroup : ""}`}
                      key={group}
                      aria-current={isActive ? "step" : undefined}
                    >
                      <span className={styles.groupMarker} aria-hidden="true" />
                      {group}
                    </li>
                  );
                },
              )}
            </ol>
            <p className={styles.progressCount}>
              {isReview
                ? "Review"
                : progressLabel
                  ? `Question ${progressLabel}`
                  : "Choose a project type"}
            </p>
          </div>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-label="Discovery progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressValue}
          >
            <span style={{ width: `${progressValue}%` }} />
          </div>
          <p className={styles.pathNote}>
            The next questions adapt to your project type.
          </p>
        </div>

        {isReview ? (
          <section className={styles.review} aria-labelledby="review-title">
            <p className={styles.questionEyebrow}>Your discovery notes</p>
            <h2
              id="review-title"
              ref={questionHeadingRef}
              tabIndex={-1}
            >
              A useful first direction.
            </h2>
            <p className={styles.reviewIntro}>
              This is a working summary of your answers, not a saved project.
              Nothing has been stored.
            </p>

            <dl className={styles.reviewList}>
              <div className={styles.reviewRow}>
                <dt>Project type</dt>
                <dd>
                  {getChoiceLabel(PROJECT_TYPE_CHOICES, answers.projectType)}
                </dd>
              </div>
              <div className={styles.reviewRow}>
                <dt>Goal</dt>
                <dd>
                  {answers.goalNotDecided
                    ? "Not decided yet"
                    : answers.goal.trim() || "Skipped"}
                </dd>
              </div>
              <div className={styles.reviewRow}>
                <dt>For</dt>
                <dd>
                  {answers.audienceNotDecided
                    ? "Not decided yet"
                    : answers.audience.trim() || "Skipped"}
                </dd>
              </div>
              <div className={styles.reviewRow}>
                <dt>Experience</dt>
                <dd>
                  {getChoiceLabel(EXPERIENCE_CHOICES, answers.experience)}
                </dd>
              </div>
              <div className={styles.reviewRow}>
                <dt>Platforms</dt>
                <dd>
                  {answers.platformsNotDecided
                    ? "Not decided yet"
                    : answers.platforms.join(", ") || "Skipped"}
                </dd>
              </div>
              {answers.projectType &&
                TECHNOLOGY_PATHS[answers.projectType].map((categoryId) => {
                  const category = TECHNOLOGY_CATEGORIES[categoryId];
                  const selected = answers.technology[categoryId] ?? [];
                  const value = answers.technologyNotDecided[categoryId]
                    ? "Not decided yet"
                    : selected.join(", ") || "Skipped";

                  return (
                    <div className={styles.reviewRow} key={categoryId}>
                      <dt>{category.label}</dt>
                      <dd>{value}</dd>
                    </div>
                  );
                })}
            </dl>

            <div className={styles.reviewActions}>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => setActiveIndex(steps.length - 1)}
              >
                Back to answers
              </button>
              <button
                className={styles.textButton}
                type="button"
                onClick={startOver}
              >
                Start over
              </button>
            </div>
            <p className={styles.reviewNote}>
              Refreshing this page clears these answers. Saving will come with
              frontend integration.
            </p>
          </section>
        ) : currentStep ? (
          <section className={styles.question} aria-labelledby="question-title">
            <div className={styles.questionHeading}>
              <p className={styles.questionEyebrow}>
                {currentStep.group} / Question {activeIndex + 1}
              </p>
              <h2
                id="question-title"
                ref={questionHeadingRef}
                tabIndex={-1}
              >
                {getStepTitle(currentStep)}
              </h2>
              <p>{getStepDescription(currentStep)}</p>
            </div>

            <div className={styles.answerArea}>
              {currentStep.type === "single" && (
                <div className={styles.choiceList}>
                  {currentStep.choices.map((choice) => {
                    const selected =
                      currentStep.id === "project-type"
                        ? answers.projectType === choice.value
                        : answers.experience === choice.value;

                    return (
                      <button
                        className={`${styles.singleChoice} ${
                          selected ? styles.selectedChoice : ""
                        }`}
                        type="button"
                        aria-pressed={selected}
                        key={choice.value}
                        onClick={() =>
                          chooseSingle(currentStep, choice.value)
                        }
                      >
                        <span className={styles.choiceCopy}>
                          <span className={styles.choiceTitle}>
                            {choice.label}
                          </span>
                          {choice.description && (
                            <span className={styles.choiceDescription}>
                              {choice.description}
                            </span>
                          )}
                        </span>
                        <span className={styles.choiceState}>
                          {selected ? "Selected" : "Choose"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentStep.type === "text" && (
                <div className={styles.textAnswer}>
                  <label htmlFor={`answer-${currentStep.field}`}>
                    {currentStep.label}
                    <span>Optional</span>
                  </label>
                  <textarea
                    id={`answer-${currentStep.field}`}
                    rows={4}
                    placeholder={currentStep.placeholder}
                    value={answers[currentStep.field]}
                    disabled={answers[`${currentStep.field}NotDecided`]}
                    onChange={(event) =>
                      setAnswers((previous) => ({
                        ...previous,
                        [currentStep.field]: event.target.value,
                        [`${currentStep.field}NotDecided`]: false,
                      }))
                    }
                  />
                  <button
                    className={`${styles.notDecidedButton} ${
                      answers[`${currentStep.field}NotDecided`]
                        ? styles.selectedNotDecided
                        : ""
                    }`}
                    type="button"
                    aria-pressed={answers[`${currentStep.field}NotDecided`]}
                    onClick={() =>
                      setAnswers((previous) => ({
                        ...previous,
                        [currentStep.field]: "",
                        [`${currentStep.field}NotDecided`]:
                          !previous[`${currentStep.field}NotDecided`],
                      }))
                    }
                  >
                    Not decided yet
                  </button>
                </div>
              )}

              {currentStep.type === "multi" && (
                <div className={styles.multiChoiceArea}>
                  <div className={styles.multiChoiceList}>
                    {currentStep.choices.map((choice) => (
                      <label className={styles.multiChoice} key={choice.value}>
                        <input
                          type="checkbox"
                          checked={answers.platforms.includes(choice.value)}
                          onChange={() => togglePlatform(choice.value)}
                        />
                        <span className={styles.checkboxMark} aria-hidden="true" />
                        <span>{choice.label}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    className={`${styles.notDecidedButton} ${
                      answers.platformsNotDecided
                        ? styles.selectedNotDecided
                        : ""
                    }`}
                    type="button"
                    aria-pressed={answers.platformsNotDecided}
                    onClick={() =>
                      setAnswers((previous) => ({
                        ...previous,
                        platforms: [],
                        platformsNotDecided: !previous.platformsNotDecided,
                      }))
                    }
                  >
                    Not decided yet
                  </button>
                </div>
              )}

              {currentStep.type === "technology" && (
                <div className={styles.technologyArea}>
                  <label className={styles.searchLabel} htmlFor="technology-search">
                    Search {currentStep.category.label.toLowerCase()} options
                  </label>
                  <input
                    className={styles.searchInput}
                    id="technology-search"
                    type="search"
                    value={currentSearch}
                    placeholder="Type to filter the curated list"
                    onChange={(event) =>
                      setSearch({
                        stepId: currentStep.id,
                        value: event.target.value,
                      })
                    }
                  />
                  <p className={styles.catalogNote}>
                    Broad curated list · Listed options only
                  </p>
                  <div className={styles.multiChoiceList}>
                    {getFilteredChoices(currentStep.category.choices, currentSearch).map(
                      (choice) => (
                        <label className={styles.multiChoice} key={choice.value}>
                          <input
                            type="checkbox"
                            checked={
                              answers.technology[currentStep.category.id]?.includes(
                                choice.value,
                              ) ?? false
                            }
                            onChange={() =>
                              toggleTechnology(
                                currentStep.category.id,
                                choice.value,
                              )
                            }
                          />
                          <span
                            className={styles.checkboxMark}
                            aria-hidden="true"
                          />
                          <span>{choice.label}</span>
                        </label>
                      ),
                    )}
                    {getFilteredChoices(
                      currentStep.category.choices,
                      currentSearch,
                    ).length === 0 && (
                      <p className={styles.noResults}>
                        No match in this curated list. Try another search.
                      </p>
                    )}
                  </div>
                  <button
                    className={`${styles.notDecidedButton} ${
                      answers.technologyNotDecided[currentStep.category.id]
                        ? styles.selectedNotDecided
                        : ""
                    }`}
                    type="button"
                    aria-pressed={
                      answers.technologyNotDecided[currentStep.category.id] ??
                      false
                    }
                    onClick={() =>
                      setAnswers((previous) => ({
                        ...previous,
                        technology: {
                          ...previous.technology,
                          [currentStep.category.id]: [],
                        },
                        technologyNotDecided: {
                          ...previous.technologyNotDecided,
                          [currentStep.category.id]:
                            !previous.technologyNotDecided[
                              currentStep.category.id
                            ],
                        },
                      }))
                    }
                  >
                    Not decided yet
                  </button>
                </div>
              )}
            </div>

            <div className={styles.questionFooter}>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={goBack}
                disabled={activeIndex === 0}
              >
                Back
              </button>
              <button
                className={styles.continueButton}
                type="button"
                onClick={goForward}
                disabled={
                  (currentStep.id === "project-type" &&
                    answers.projectType === null) ||
                  (currentStep.id === "experience" &&
                    answers.experience === null)
                }
              >
                {answers.projectType !== null &&
                activeIndex === steps.length - 1
                  ? "Review answers"
                  : "Continue"}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        ) : null}
      </section>
    </div>
  );
}

function getStepTitle(step: DiscoveryStep) {
  return step.type === "technology" ? step.category.title : step.title;
}

function getStepDescription(step: DiscoveryStep) {
  return step.type === "technology" ? step.category.description : step.description;
}

function getFilteredChoices(
  choices: TechnologyChoice[],
  searchTerm: string,
) {
  const query = searchTerm.trim().toLocaleLowerCase();
  if (!query) {
    return choices;
  }

  return choices.filter((choice) =>
    [choice.label, ... (choice.aliases ?? [])]
      .join(" ")
      .toLocaleLowerCase()
      .includes(query),
  );
}
