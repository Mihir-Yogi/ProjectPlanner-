"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./guided-discovery-experience.module.css";

type ProjectMode = "idea" | "client";
type ProjectType =
  | "business-site"
  | "online-store"
  | "booking-site"
  | "web-app"
  | "mobile-app"
  | "other";
type DiscoveryGroup =
  | "Start"
  | "Project"
  | "Idea"
  | "Client brief"
  | "Technology";
type SingleField =
  | "mode"
  | "projectType"
  | "businessType"
  | "clientApprover"
  | "frontendStack"
  | "backendStack"
  | "database";
type TextField = "ideaSpark" | "clientBrief";
type MultiField =
  | "ideaGoals"
  | "ideaAudience"
  | "ideaAssets"
  | "clientOutcomes"
  | "clientUsers"
  | "clientFeatures"
  | "clientAssets"
  | "clientConstraints"
  | "stackServices";

type Choice = {
  label: string;
  value: string;
  description?: string;
};

type ProjectTypeChoice = Choice & {
  value: ProjectType;
};

type SingleStep = {
  id:
    | "mode"
    | "project-type"
    | "business-type"
    | "client-approver"
    | "frontend-stack"
    | "backend-stack"
    | "database";
  type: "single";
  group: DiscoveryGroup;
  field: SingleField;
  title: string;
  description: string;
  choices: Choice[];
};

type TextStep = {
  id: "idea-spark" | "client-brief";
  type: "text";
  group: "Idea" | "Client brief";
  field: TextField;
  title: string;
  description: string;
  label: string;
  placeholder: string;
};

type MultiStep = {
  id:
    | "idea-goals"
    | "idea-audience"
    | "idea-assets"
    | "client-outcomes"
    | "client-users"
    | "client-features"
    | "client-assets"
    | "client-constraints"
    | "external-services";
  type: "multi";
  group: "Idea" | "Client brief" | "Technology";
  field: MultiField;
  title: string;
  description: string;
  choices: Choice[];
};

type DiscoveryStep = SingleStep | TextStep | MultiStep;

type Answers = {
  mode: ProjectMode | null;
  projectType: ProjectType | null;
  businessType: string | null;
  ideaSpark: string;
  clientBrief: string;
  clientApprover: string | null;
  frontendStack: string | null;
  backendStack: string | null;
  database: string | null;
  textNotDecided: Record<TextField, boolean>;
  multiAnswers: Record<MultiField, string[]>;
  multiNotDecided: Record<MultiField, boolean>;
};

const MODE_CHOICES: Choice[] = [
  {
    label: "I have an idea",
    value: "idea",
    description: "Explore something you noticed or want to build.",
  },
  {
    label: "I am building for a client",
    value: "client",
    description: "Turn a client conversation into a clear project brief.",
  },
];

const PROJECT_TYPE_CHOICES: ProjectTypeChoice[] = [
  {
    label: "Business or store website",
    value: "business-site",
    description: "Share what a local business offers and how to reach it.",
  },
  {
    label: "Online store",
    value: "online-store",
    description: "Show products and accept orders online.",
  },
  {
    label: "Booking website",
    value: "booking-site",
    description: "Let people view services and request appointments.",
  },
  {
    label: "Web app or internal tool",
    value: "web-app",
    description: "Help people or a team complete tasks online.",
  },
  {
    label: "Mobile app",
    value: "mobile-app",
    description: "An app designed for phones or tablets.",
  },
  {
    label: "Something else / not sure",
    value: "other",
    description: "You can describe the idea in your own words.",
  },
];

const BUSINESS_TYPE_CHOICES: Choice[] = [
  { label: "Shop or retail store", value: "Shop or retail store" },
  { label: "Cafe, restaurant, or food business", value: "Cafe or food business" },
  { label: "Salon or personal services", value: "Salon or personal services" },
  { label: "Professional service", value: "Professional service" },
  { label: "Other / not sure", value: "Other / not sure" },
];

const PROJECT_FEATURE_CHOICES: Record<ProjectType, Choice[]> = {
  "business-site": [
    { label: "Show products or services and prices", value: "Show products or services and prices" },
    { label: "Show opening hours, location, and directions", value: "Opening hours and directions" },
    { label: "Let people call, message, or send an enquiry", value: "Contact or enquiries" },
    { label: "Let people request an appointment", value: "Appointment requests" },
    { label: "Accept orders or payments online", value: "Online orders or payments" },
  ],
  "online-store": [
    { label: "Browse and search products", value: "Product browsing and search" },
    { label: "View product details and availability", value: "Product details and availability" },
    { label: "Add items to a cart and check out", value: "Cart and checkout" },
    { label: "Pay online", value: "Online payments" },
    { label: "Choose delivery or store pickup", value: "Delivery or pickup" },
    { label: "Manage orders and stock", value: "Orders and stock" },
  ],
  "booking-site": [
    { label: "Show services, prices, and availability", value: "Services and availability" },
    { label: "Request, change, or cancel an appointment", value: "Appointment management" },
    { label: "Send booking reminders", value: "Booking reminders" },
    { label: "Take payment for a booking", value: "Booking payments" },
    { label: "Let people contact the business", value: "Contact details" },
  ],
  "web-app": [
    { label: "Sign in and manage an account", value: "Accounts and sign-in" },
    { label: "Create and manage information", value: "Create and manage information" },
    { label: "Search and filter records", value: "Search and filters" },
    { label: "View a dashboard or reports", value: "Dashboard and reports" },
    { label: "Give team members different access", value: "Team access" },
  ],
  "mobile-app": [
    { label: "Sign in and manage a profile", value: "Accounts and profiles" },
    { label: "Complete the main task on a phone", value: "Mobile task flow" },
    { label: "Receive notifications", value: "Notifications" },
    { label: "Make a payment or purchase", value: "Payments" },
    { label: "Use key parts without internet", value: "Offline use" },
  ],
  other: [
    { label: "Share information or useful content", value: "Share information" },
    { label: "Let people contact or message someone", value: "Contact or messaging" },
    { label: "Submit a form or request", value: "Forms and requests" },
    { label: "Manage tasks or records", value: "Tasks and records" },
    { label: "Sign in and manage an account", value: "Accounts and sign-in" },
  ],
};

const IDEA_AUDIENCE_CHOICES: Choice[] = [
  { label: "People who live or work nearby", value: "Nearby customers" },
  { label: "People already familiar with the business", value: "Existing customers" },
  { label: "New customers finding it online", value: "New customers" },
  { label: "Staff or the business owner", value: "Staff or owner" },
  { label: "A specific group of people", value: "Specific group" },
];

const IDEA_ASSET_CHOICES: Choice[] = [
  { label: "Logo or brand colours", value: "Logo and brand" },
  { label: "Product or service list and prices", value: "Products or services" },
  { label: "Photos", value: "Photos" },
  { label: "Business hours, address, and contact details", value: "Business details" },
  { label: "An existing website or domain name", value: "Website or domain" },
  { label: "Nothing ready yet", value: "Nothing ready yet" },
];

const CLIENT_OUTCOME_CHOICES: Choice[] = [
  { label: "Reach more or new customers", value: "Reach new customers" },
  { label: "Replace or improve an existing website", value: "Improve existing website" },
  { label: "Sell products or take orders online", value: "Online sales or orders" },
  { label: "Get more enquiries or appointments", value: "Enquiries or appointments" },
  { label: "Make information easier to find", value: "Easier-to-find information" },
  { label: "Reduce manual work for the team", value: "Reduce manual work" },
];

const CLIENT_USER_CHOICES: Choice[] = [
  { label: "Customers or clients", value: "Customers or clients" },
  { label: "Staff or the client's team", value: "Staff or team" },
  { label: "The business owner or administrator", value: "Owner or administrator" },
  { label: "Suppliers or business partners", value: "Suppliers or partners" },
  { label: "The general public", value: "General public" },
];

const CLIENT_ASSET_CHOICES: Choice[] = [
  { label: "Existing website or domain", value: "Existing website or domain" },
  { label: "Logo, brand guide, or design files", value: "Brand materials" },
  { label: "Approved text, product list, or service details", value: "Approved content" },
  { label: "Photos or product images", value: "Photos or product images" },
  { label: "Current booking, payment, or inventory tools", value: "Existing business tools" },
  { label: "Nothing has been shared yet", value: "Nothing shared yet" },
];

const CLIENT_CONSTRAINT_CHOICES: Choice[] = [
  { label: "A target launch date or deadline", value: "Deadline" },
  { label: "A budget range", value: "Budget" },
  { label: "An existing website or system to keep using", value: "Existing systems" },
  { label: "Connections to other tools, such as payments or inventory", value: "Integrations" },
  { label: "Brand or content that needs client approval", value: "Brand and content approval" },
  { label: "Privacy, accessibility, or security requirements", value: "Privacy, accessibility, or security" },
];

const CLIENT_APPROVER_CHOICES: Choice[] = [
  { label: "The client or business owner", value: "Client or owner" },
  { label: "A manager or team lead", value: "Manager or team lead" },
  { label: "Several people need to approve", value: "Several approvers" },
  { label: "Not confirmed yet", value: "Not confirmed yet" },
];

const FRONTEND_CHOICES: Record<ProjectType, Choice[]> = {
  "business-site": [
    { label: "WordPress theme", value: "WordPress theme", description: "Good when the business should edit pages itself." },
    { label: "Next.js + React + TypeScript", value: "Next.js + React + TypeScript", description: "A custom frontend for a distinctive design or interactions." },
    { label: "Wix or Squarespace", value: "Wix or Squarespace", description: "A hosted builder for a simple site with little custom code." },
  ],
  "online-store": [
    { label: "Shopify theme (Liquid)", value: "Shopify theme (Liquid)", description: "A direct way to customize a Shopify storefront." },
    { label: "WooCommerce theme (WordPress)", value: "WooCommerce theme (WordPress)", description: "A flexible storefront for a WooCommerce store." },
    { label: "Next.js + React + TypeScript", value: "Next.js + React + TypeScript", description: "A custom storefront when the built-in themes are not enough." },
  ],
  "booking-site": [
    { label: "WordPress theme + booking plugin", value: "WordPress theme + booking plugin" },
    { label: "Next.js + React + TypeScript", value: "Next.js + React + TypeScript", description: "For a custom booking experience." },
    { label: "Hosted booking page embedded in a site", value: "Hosted booking page", description: "Avoids building booking screens from scratch." },
  ],
  "web-app": [
    { label: "Next.js + React + TypeScript", value: "Next.js + React + TypeScript" },
    { label: "React + Vite + TypeScript", value: "React + Vite + TypeScript" },
    { label: "Vue + TypeScript", value: "Vue + TypeScript" },
  ],
  "mobile-app": [
    { label: "React Native + TypeScript", value: "React Native + TypeScript", description: "One codebase for iOS and Android." },
    { label: "Flutter + Dart", value: "Flutter + Dart", description: "One codebase for iOS and Android." },
    { label: "Native Swift (iOS) / Kotlin (Android)", value: "Native Swift / Kotlin" },
  ],
  other: [
    { label: "Next.js + React + TypeScript", value: "Next.js + React + TypeScript" },
    { label: "React + Vite + TypeScript", value: "React + Vite + TypeScript" },
    { label: "WordPress", value: "WordPress" },
  ],
};

const BACKEND_CHOICES: Record<ProjectType, Choice[]> = {
  "business-site": [
    { label: "No custom backend — static pages and hosted forms", value: "No custom backend" },
    { label: "WordPress / PHP", value: "WordPress / PHP" },
    { label: "Next.js server routes", value: "Next.js server routes", description: "For small custom APIs or form handling." },
    { label: "Wix-managed services", value: "Wix managed services" },
  ],
  "online-store": [
    { label: "Shopify-managed backend and checkout", value: "Shopify-managed backend" },
    { label: "WooCommerce / WordPress / PHP", value: "WooCommerce / WordPress / PHP" },
    { label: "Node.js + TypeScript API", value: "Node.js + TypeScript API", description: "For a custom store backend." },
  ],
  "booking-site": [
    { label: "Booking service manages bookings", value: "Hosted booking backend" },
    { label: "WordPress booking plugin", value: "WordPress booking plugin" },
    { label: "Node.js + TypeScript API", value: "Node.js + TypeScript API", description: "For custom booking rules or integrations." },
  ],
  "web-app": [
    { label: "Next.js server actions and route handlers", value: "Next.js server features" },
    { label: "Node.js + Express or NestJS", value: "Node.js + Express or NestJS" },
    { label: "Django + Python", value: "Django + Python" },
    { label: "Supabase managed backend", value: "Supabase managed backend" },
  ],
  "mobile-app": [
    { label: "Supabase managed backend", value: "Supabase managed backend" },
    { label: "Firebase managed backend", value: "Firebase managed backend" },
    { label: "Node.js + TypeScript API", value: "Node.js + TypeScript API" },
    { label: "No backend — offline-only app", value: "No backend" },
  ],
  other: [
    { label: "Node.js + Express or NestJS", value: "Node.js + Express or NestJS" },
    { label: "Django + Python", value: "Django + Python" },
    { label: "Laravel + PHP", value: "Laravel + PHP" },
    { label: "Supabase managed backend", value: "Supabase managed backend" },
  ],
};

const DATABASE_CHOICES: Record<ProjectType, Choice[]> = {
  "business-site": [
    { label: "No database — pages and forms only", value: "No database" },
    { label: "MySQL / MariaDB (WordPress)", value: "MySQL / MariaDB" },
    { label: "PostgreSQL (custom features)", value: "PostgreSQL" },
  ],
  "online-store": [
    { label: "Managed by Shopify", value: "Shopify-managed data" },
    { label: "MySQL / MariaDB (WooCommerce)", value: "MySQL / MariaDB" },
    { label: "PostgreSQL (custom store)", value: "PostgreSQL" },
  ],
  "booking-site": [
    { label: "Managed by the booking service or plugin", value: "Provider-managed data" },
    { label: "MySQL / MariaDB (WordPress)", value: "MySQL / MariaDB" },
    { label: "PostgreSQL (custom booking)", value: "PostgreSQL" },
  ],
  "web-app": [
    { label: "PostgreSQL", value: "PostgreSQL", description: "A common default for structured app data." },
    { label: "Supabase Postgres", value: "Supabase Postgres", description: "Managed PostgreSQL with related services." },
    { label: "MySQL / MariaDB", value: "MySQL / MariaDB" },
    { label: "MongoDB", value: "MongoDB", description: "A document database for flexible data shapes." },
  ],
  "mobile-app": [
    { label: "Supabase Postgres", value: "Supabase Postgres" },
    { label: "Firebase Firestore", value: "Firebase Firestore" },
    { label: "PostgreSQL behind an API", value: "PostgreSQL behind an API" },
    { label: "Local storage only", value: "Local storage only" },
  ],
  other: [
    { label: "PostgreSQL", value: "PostgreSQL" },
    { label: "MySQL / MariaDB", value: "MySQL / MariaDB" },
    { label: "SQLite (small or local project)", value: "SQLite" },
    { label: "Managed by the selected platform", value: "Platform-managed data" },
  ],
};

const NOT_SURE_STACK_CHOICE: Choice = {
  label: "Not sure yet — decide after the requirements",
  value: "Not sure yet",
};

function getBackendChoices(
  projectType: ProjectType,
  frontendStack: string | null,
): Choice[] {
  const choices = BACKEND_CHOICES[projectType];
  let relevantChoices = choices;

  if (projectType === "business-site") {
    if (frontendStack === "WordPress theme") {
      relevantChoices = choices.filter((choice) =>
        ["No custom backend", "WordPress / PHP"].includes(choice.value),
      );
    } else if (frontendStack === "Next.js + React + TypeScript") {
      relevantChoices = choices.filter((choice) =>
        ["No custom backend", "Next.js server routes"].includes(choice.value),
      );
    } else if (frontendStack === "Wix or Squarespace") {
      relevantChoices = choices.filter(
        (choice) => choice.value === "Wix managed services",
      );
    }
  } else if (projectType === "online-store") {
    if (frontendStack === "Shopify theme (Liquid)") {
      relevantChoices = choices.filter(
        (choice) => choice.value === "Shopify-managed backend",
      );
    } else if (frontendStack === "WooCommerce theme (WordPress)") {
      relevantChoices = choices.filter((choice) =>
        choice.value === "WooCommerce / WordPress / PHP",
      );
    } else if (frontendStack === "Next.js + React + TypeScript") {
      relevantChoices = choices.filter(
        (choice) => choice.value === "Node.js + TypeScript API",
      );
    }
  } else if (projectType === "booking-site") {
    if (frontendStack === "WordPress theme + booking plugin") {
      relevantChoices = choices.filter(
        (choice) => choice.value === "WordPress booking plugin",
      );
    } else if (frontendStack === "Next.js + React + TypeScript") {
      relevantChoices = choices.filter(
        (choice) => choice.value === "Node.js + TypeScript API",
      );
    } else if (frontendStack === "Hosted booking page") {
      relevantChoices = choices.filter(
        (choice) => choice.value === "Hosted booking backend",
      );
    }
  }

  return [...relevantChoices, NOT_SURE_STACK_CHOICE];
}

function getDatabaseChoices(
  projectType: ProjectType,
  backendStack: string | null,
): Choice[] {
  let relevantChoices = DATABASE_CHOICES[projectType];

  if (backendStack === "Shopify-managed backend") {
    relevantChoices = DATABASE_CHOICES["online-store"].filter(
      (choice) => choice.value === "Shopify-managed data",
    );
  } else if (
    backendStack === "WooCommerce / WordPress / PHP" ||
    backendStack === "WordPress / PHP" ||
    backendStack === "WordPress booking plugin"
  ) {
    relevantChoices = DATABASE_CHOICES[projectType].filter(
      (choice) => choice.value === "MySQL / MariaDB",
    );
  } else if (backendStack === "Hosted booking backend") {
    relevantChoices = DATABASE_CHOICES["booking-site"].filter(
      (choice) => choice.value === "Provider-managed data",
    );
  } else if (backendStack === "Supabase managed backend") {
    relevantChoices = [
      { label: "Supabase Postgres", value: "Supabase Postgres" },
    ];
  } else if (backendStack === "Firebase managed backend") {
    relevantChoices = [
      { label: "Firebase Firestore", value: "Firebase Firestore" },
    ];
  } else if (backendStack === "No backend") {
    relevantChoices = [
      { label: "Local storage only", value: "Local storage only" },
    ];
  } else if (backendStack === "Wix managed services") {
    relevantChoices = [
      { label: "Managed by Wix", value: "Wix-managed data" },
    ];
  } else if (backendStack === "No custom backend") {
    relevantChoices = [
      { label: "No database needed", value: "No database" },
      { label: "Managed by a hosted form service", value: "Hosted form storage" },
    ];
  } else if (
    backendStack === "Node.js + TypeScript API" &&
    (projectType === "online-store" || projectType === "booking-site")
  ) {
    relevantChoices = DATABASE_CHOICES[projectType].filter(
      (choice) => choice.value === "PostgreSQL",
    );
  } else if (
    backendStack === "Node.js + TypeScript API" &&
    projectType === "mobile-app"
  ) {
    relevantChoices = DATABASE_CHOICES["mobile-app"].filter(
      (choice) => choice.value === "PostgreSQL behind an API",
    );
  }

  return [...relevantChoices, NOT_SURE_STACK_CHOICE];
}

function getExternalServiceChoices(answers: Answers): Choice[] {
  const projectType = answers.projectType;
  const features =
    answers.mode === "client"
      ? answers.multiAnswers.clientFeatures
      : answers.multiAnswers.ideaGoals;
  const choices: Choice[] = [];
  const hasFeature = (values: string[]) =>
    features.some((feature) => values.includes(feature));

  if (
    projectType === "online-store" ||
    hasFeature([
      "Online orders or payments",
      "Online payments",
      "Booking payments",
      "Payments",
      "Cart and checkout",
    ])
  ) {
    const paymentLabel =
      answers.backendStack === "Shopify-managed backend"
        ? "Payments — Shopify Payments or a supported local provider"
        : answers.backendStack === "WooCommerce / WordPress / PHP"
          ? "Payments — WooCommerce gateway (Stripe, PayPal, or local provider)"
          : "Payments — Stripe, PayPal, or a local provider";
    choices.push({
      label: paymentLabel,
      value: paymentLabel,
    });
  }

  if (
    projectType === "booking-site" ||
    hasFeature([
      "Appointment requests",
      "Services and availability",
      "Appointment management",
      "Booking reminders",
    ])
  ) {
    choices.push({
      label: "Bookings and calendars — booking platform or Google Calendar",
      value: "Bookings and calendars — booking platform or Google Calendar",
    });
  }

  if (
    hasFeature(["Opening hours and directions", "Business details"])
  ) {
    choices.push({
      label: "Maps — Google Maps or OpenStreetMap",
      value: "Maps — Google Maps or OpenStreetMap",
    });
  }

  if (
    hasFeature([
      "Contact or enquiries",
      "Contact details",
      "Contact or messaging",
      "Forms and requests",
    ])
  ) {
    choices.push({
      label: "Email — Resend, Postmark, or the business email provider",
      value: "Email — Resend, Postmark, or the business email provider",
    });
  }

  if (
    projectType === "online-store" &&
    hasFeature(["Delivery or pickup", "Orders and stock"])
  ) {
    choices.push({
      label: "Shipping or local delivery integration",
      value: "Shipping or local delivery integration",
    });
  }

  if (
    hasFeature([
      "Product browsing and search",
      "Product details and availability",
      "Create and manage information",
    ])
  ) {
    choices.push({
      label: "Image and file storage — Supabase Storage or S3-compatible storage",
      value: "Image and file storage — Supabase Storage or S3-compatible storage",
    });
  }

  if (
    hasFeature([
      "Accounts and sign-in",
      "Accounts and profiles",
      "Team access",
    ])
  ) {
    choices.push({
      label: "Sign-in — Supabase Auth, Clerk, or Firebase Auth",
      value: "Sign-in — Supabase Auth, Clerk, or Firebase Auth",
    });
  }

  if (hasFeature(["Notifications"])) {
    choices.push({
      label: "Push notifications — Firebase Cloud Messaging or a platform service",
      value: "Push notifications — Firebase Cloud Messaging or a platform service",
    });
  }

  if (choices.length === 0) {
    choices.push(
      {
        label: "Email delivery — Resend or Postmark",
        value: "Email delivery — Resend or Postmark",
      },
      {
        label: "Analytics or error monitoring — Plausible or Sentry",
        value: "Analytics or error monitoring — Plausible or Sentry",
      },
    );
  }

  choices.push({
    label: "No external services needed",
    value: "No external services needed",
  });

  return choices;
}

function createStackSteps(projectType: ProjectType, answers: Answers): DiscoveryStep[] {
  return [
    {
      id: "frontend-stack",
      type: "single",
      group: "Technology",
      field: "frontendStack",
      title: "What should the frontend be built with?",
      description:
        "The frontend is the pages and screens people see and use. These are planning options, not a setup action.",
      choices: [...FRONTEND_CHOICES[projectType], NOT_SURE_STACK_CHOICE],
    },
    {
      id: "backend-stack",
      type: "single",
      group: "Technology",
      field: "backendStack",
      title: "What should handle the backend or API?",
      description:
        "The backend handles business rules, forms, accounts, orders, or data. Some platforms include it for you.",
      choices: getBackendChoices(projectType, answers.frontendStack),
    },
    {
      id: "database",
      type: "single",
      group: "Technology",
      field: "database",
      title: "Where should project data live?",
      description:
        "A simple information site may not need a database. Stores and apps often use a platform-managed database or PostgreSQL.",
      choices: getDatabaseChoices(projectType, answers.backendStack),
    },
    {
      id: "external-services",
      type: "multi",
      group: "Technology",
      field: "stackServices",
      title: "Which other services might it need?",
      description:
        "Suggestions follow the features you selected. This records a preference only; it does not connect a service.",
      choices: getExternalServiceChoices(answers),
    },
  ];
}

const MODE_STEP: SingleStep = {
  id: "mode",
  type: "single",
  group: "Start",
  field: "mode",
  title: "What brings you here?",
  description: "Pick the situation that sounds most like yours.",
  choices: MODE_CHOICES,
};

const PROJECT_TYPE_STEP: SingleStep = {
  id: "project-type",
  type: "single",
  group: "Project",
  field: "projectType",
  title: "What are you thinking of making?",
  description: "Choose the closest match. You can change direction later.",
  choices: PROJECT_TYPE_CHOICES,
};

const IDEA_ASSET_STEP: MultiStep = {
  id: "idea-assets",
  type: "multi",
  group: "Idea",
  field: "ideaAssets",
  title: "What do you already have?",
  description: "Select anything that could help get a first version started.",
  choices: IDEA_ASSET_CHOICES,
};

const CLIENT_OUTCOME_STEP: MultiStep = {
  id: "client-outcomes",
  type: "multi",
  group: "Client brief",
  field: "clientOutcomes",
  title: "What does the client want to improve?",
  description: "Choose the outcomes they mentioned or care about most.",
  choices: CLIENT_OUTCOME_CHOICES,
};

const CLIENT_USERS_STEP: MultiStep = {
  id: "client-users",
  type: "multi",
  group: "Client brief",
  field: "clientUsers",
  title: "Who will use the project?",
  description: "Think about the people using it day to day.",
  choices: CLIENT_USER_CHOICES,
};

const CLIENT_ASSET_STEP: MultiStep = {
  id: "client-assets",
  type: "multi",
  group: "Client brief",
  field: "clientAssets",
  title: "What does the client already have?",
  description: "This helps separate new work from things that can be reused.",
  choices: CLIENT_ASSET_CHOICES,
};

const CLIENT_CONSTRAINT_STEP: MultiStep = {
  id: "client-constraints",
  type: "multi",
  group: "Client brief",
  field: "clientConstraints",
  title: "Did the client mention any constraints?",
  description: "Choose anything that could affect scope, timing, or the build.",
  choices: CLIENT_CONSTRAINT_CHOICES,
};

function createInitialAnswers(): Answers {
  return {
    mode: null,
    projectType: null,
    businessType: null,
    ideaSpark: "",
    clientBrief: "",
    clientApprover: null,
    frontendStack: null,
    backendStack: null,
    database: null,
    textNotDecided: {
      ideaSpark: false,
      clientBrief: false,
    },
    multiAnswers: {
      ideaGoals: [],
      ideaAudience: [],
      ideaAssets: [],
      clientOutcomes: [],
      clientUsers: [],
      clientFeatures: [],
      clientAssets: [],
      clientConstraints: [],
      stackServices: [],
    },
    multiNotDecided: {
      ideaGoals: false,
      ideaAudience: false,
      ideaAssets: false,
      clientOutcomes: false,
      clientUsers: false,
      clientFeatures: false,
      clientAssets: false,
      clientConstraints: false,
      stackServices: false,
    },
  };
}

function isBusinessProject(projectType: ProjectType) {
  return (
    projectType === "business-site" ||
    projectType === "online-store" ||
    projectType === "booking-site"
  );
}

function createSteps(answers: Answers): DiscoveryStep[] {
  const steps: DiscoveryStep[] = [MODE_STEP];

  if (!answers.mode) {
    return steps;
  }

  steps.push(PROJECT_TYPE_STEP);
  if (!answers.projectType) {
    return steps;
  }

  if (isBusinessProject(answers.projectType)) {
    steps.push({
      id: "business-type",
      type: "single",
      group: "Project",
      field: "businessType",
      title:
        answers.mode === "idea"
          ? "What kind of business did you notice?"
          : "What kind of business is the client in?",
      description: "Choose the closest match, or pick not sure.",
      choices: BUSINESS_TYPE_CHOICES,
    });
  }

  if (answers.mode === "idea") {
    steps.push(
      {
        id: "idea-spark",
        type: "text",
        group: "Idea",
        field: "ideaSpark",
        title: "What gave you the idea?",
        description:
          "For example: “I noticed a nearby shop has no website, so customers cannot check its products or opening hours.”",
        label: "Your thought, in your own words",
        placeholder: "I noticed...",
      },
      {
        id: "idea-goals",
        type: "multi",
        group: "Idea",
        field: "ideaGoals",
        title:
          answers.projectType === "mobile-app"
            ? "What should people be able to do in the app?"
            : "What should visitors or customers be able to do?",
        description: "Choose the most useful things for a first version.",
        choices: PROJECT_FEATURE_CHOICES[answers.projectType],
      },
      {
        id: "idea-audience",
        type: "multi",
        group: "Idea",
        field: "ideaAudience",
        title: "Who do you picture using it?",
        description: "Pick any groups that come to mind.",
        choices: IDEA_AUDIENCE_CHOICES,
      },
      IDEA_ASSET_STEP,
    );
  } else {
    steps.push(
      CLIENT_OUTCOME_STEP,
      {
        id: "client-brief",
        type: "text",
        group: "Client brief",
        field: "clientBrief",
        title: "What did the client ask you to build?",
        description:
          "Capture the request in plain words. Add key features or details they called out.",
        label: "Notes from the client conversation",
        placeholder: "The client wants...",
      },
      CLIENT_USERS_STEP,
      {
        id: "client-features",
        type: "multi",
        group: "Client brief",
        field: "clientFeatures",
        title: "Which features belong in the first version?",
        description:
          "Select what the client asked for. You can leave uncertain items open.",
        choices: PROJECT_FEATURE_CHOICES[answers.projectType],
      },
      CLIENT_ASSET_STEP,
      CLIENT_CONSTRAINT_STEP,
      {
        id: "client-approver",
        type: "single",
        group: "Client brief",
        field: "clientApprover",
        title: "Who will approve the final result?",
        description: "Knowing who gives feedback helps avoid surprises later.",
        choices: CLIENT_APPROVER_CHOICES,
      },
    );
  }

  steps.push(...createStackSteps(answers.projectType, answers));

  return steps;
}

function getChoiceLabel(choices: Choice[], value: string | null) {
  return choices.find((choice) => choice.value === value)?.label ?? "Skipped";
}

function getTextSummary(
  answers: Answers,
  field: TextField,
): string {
  if (answers.textNotDecided[field]) {
    return "Not decided yet";
  }

  return answers[field].trim() || "Skipped";
}

function getMultiAnswerSummary(answers: Answers, field: MultiField) {
  if (answers.multiNotDecided[field]) {
    return "Not decided yet";
  }

  return answers.multiAnswers[field].join(", ") || "Skipped";
}

export function GuidedDiscoveryExperience() {
  const [answers, setAnswers] = useState<Answers>(createInitialAnswers);
  const [activeIndex, setActiveIndex] = useState(0);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousActiveIndex = useRef(activeIndex);
  const steps = createSteps(answers);
  const currentStep = steps[activeIndex];
  const isReview = activeIndex >= steps.length;
  const progressValue = isReview
    ? 100
    : Math.round((activeIndex / steps.length) * 100);
  const progressGroups = Array.from(new Set(steps.map((step) => step.group)));

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

  function chooseSingle(step: SingleStep, value: string) {
    if (!step.choices.some((choice) => choice.value === value)) {
      throw new Error("Unknown discovery choice.");
    }

    if (step.field === "mode") {
      if (value !== "idea" && value !== "client") {
        throw new Error("Unknown project mode.");
      }

      setAnswers({ ...createInitialAnswers(), mode: value });
      return;
    }

    if (step.field === "projectType") {
      const selectedType = PROJECT_TYPE_CHOICES.find(
        (choice) => choice.value === value,
      );
      if (!selectedType) {
        throw new Error("Unknown project type.");
      }

      setAnswers((previous) => ({
        ...createInitialAnswers(),
        mode: previous.mode,
        projectType: selectedType.value,
      }));
      return;
    }

    if (step.field === "businessType") {
      setAnswers((previous) => ({ ...previous, businessType: value }));
    } else if (step.field === "clientApprover") {
      setAnswers((previous) => ({ ...previous, clientApprover: value }));
    } else if (step.field === "frontendStack") {
      setAnswers((previous) => ({
        ...previous,
        frontendStack: value,
        backendStack: null,
        database: null,
        multiAnswers: { ...previous.multiAnswers, stackServices: [] },
        multiNotDecided: { ...previous.multiNotDecided, stackServices: false },
      }));
    } else if (step.field === "backendStack") {
      setAnswers((previous) => ({
        ...previous,
        backendStack: value,
        database: null,
        multiAnswers: { ...previous.multiAnswers, stackServices: [] },
        multiNotDecided: { ...previous.multiNotDecided, stackServices: false },
      }));
    } else {
      setAnswers((previous) => ({ ...previous, database: value }));
    }
  }

  function updateTextAnswer(field: TextField, value: string) {
    setAnswers((previous) => ({
      ...previous,
      [field]: value,
      textNotDecided: { ...previous.textNotDecided, [field]: false },
    }));
  }

  function toggleTextNotDecided(field: TextField) {
    setAnswers((previous) => {
      const notDecided = !previous.textNotDecided[field];
      return {
        ...previous,
        [field]: notDecided ? "" : previous[field],
        textNotDecided: { ...previous.textNotDecided, [field]: notDecided },
      };
    });
  }

  function toggleMultiChoice(field: MultiField, value: string) {
    setAnswers((previous) => {
      const selected = previous.multiAnswers[field];
      const exclusiveChoice =
        field === "ideaAssets"
          ? "Nothing ready yet"
          : field === "clientAssets"
            ? "Nothing shared yet"
            : field === "stackServices"
              ? "No external services needed"
            : null;
      const isExclusiveChoice = value === exclusiveChoice;
      const nextValues = isExclusiveChoice
        ? selected.includes(value)
          ? []
          : [value]
        : selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected.filter((item) => item !== exclusiveChoice), value];
      const featuresChanged =
        field === "ideaGoals" || field === "clientFeatures";

      return {
        ...previous,
        multiAnswers: {
          ...previous.multiAnswers,
          [field]: nextValues,
          ...(featuresChanged ? { stackServices: [] } : {}),
        },
        multiNotDecided: {
          ...previous.multiNotDecided,
          [field]: false,
          ...(featuresChanged ? { stackServices: false } : {}),
        },
      };
    });
  }

  function toggleMultiNotDecided(field: MultiField) {
    setAnswers((previous) => {
      const notDecided = !previous.multiNotDecided[field];
      const featuresChanged =
        field === "ideaGoals" || field === "clientFeatures";

      return {
        ...previous,
        multiAnswers: {
          ...previous.multiAnswers,
          [field]: notDecided ? [] : previous.multiAnswers[field],
          ...(featuresChanged ? { stackServices: [] } : {}),
        },
        multiNotDecided: {
          ...previous.multiNotDecided,
          [field]: notDecided,
          ...(featuresChanged ? { stackServices: false } : {}),
        },
      };
    });
  }

  function goBack() {
    setActiveIndex((index) => Math.max(0, index - 1));
  }

  function goForward() {
    if (
      (currentStep?.field === "mode" && answers.mode === null) ||
      (currentStep?.field === "projectType" && answers.projectType === null)
    ) {
      return;
    }

    setActiveIndex((index) => Math.min(steps.length, index + 1));
  }

  function startOver() {
    setAnswers(createInitialAnswers());
    setActiveIndex(0);
  }

  return (
    <div className={styles.experience}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Guided discovery / Step 02</p>
          <h1>Let’s make the project clearer.</h1>
          <p className={styles.pageDescription}>
            Simple questions, one step at a time. Your answers help turn an idea
            or client conversation into a useful first picture.
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
              {progressGroups.map((group) => {
                const groupSteps = steps.filter((step) => step.group === group);
                const isComplete =
                  isReview ||
                  (groupSteps.length > 0 &&
                    groupSteps.every(
                      (step) => steps.indexOf(step) < activeIndex,
                    ));
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
              })}
            </ol>
            <p className={styles.progressCount}>
              {isReview
                ? "Review"
                : `Question ${activeIndex + 1} / ${steps.length}`}
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
            {answers.mode === "client"
              ? "Questions focus on the client’s goals, users, and constraints."
              : answers.mode === "idea"
                ? "Questions help turn what you noticed into a first version."
                : "Choose the path that best fits your situation."}
          </p>
        </div>

        {isReview ? (
          <section className={styles.review} aria-labelledby="review-title">
            <p className={styles.questionEyebrow}>Your project notes</p>
            <h2 id="review-title" ref={questionHeadingRef} tabIndex={-1}>
              A clearer first picture.
            </h2>
            <p className={styles.reviewIntro}>
              This is a working summary, not a saved project. Nothing has been
              stored.
            </p>

            <dl className={styles.reviewList}>
              <div className={styles.reviewRow}>
                <dt>Starting point</dt>
                <dd>
                  {answers.mode === "idea"
                    ? "I have an idea"
                    : "I am building for a client"}
                </dd>
              </div>
              <div className={styles.reviewRow}>
                <dt>Project type</dt>
                <dd>{getChoiceLabel(PROJECT_TYPE_CHOICES, answers.projectType)}</dd>
              </div>
              {answers.projectType &&
                isBusinessProject(answers.projectType) && (
                  <div className={styles.reviewRow}>
                    <dt>Business type</dt>
                    <dd>{answers.businessType ?? "Skipped"}</dd>
                  </div>
                )}
              {answers.mode === "idea" ? (
                <>
                  <div className={styles.reviewRow}>
                    <dt>What sparked it</dt>
                    <dd>{getTextSummary(answers, "ideaSpark")}</dd>
                  </div>
                  <div className={styles.reviewRow}>
                    <dt>First-version goals</dt>
                    <dd>{getMultiAnswerSummary(answers, "ideaGoals")}</dd>
                  </div>
                  <div className={styles.reviewRow}>
                    <dt>People it is for</dt>
                    <dd>{getMultiAnswerSummary(answers, "ideaAudience")}</dd>
                  </div>
                  <div className={styles.reviewRow}>
                    <dt>What is ready</dt>
                    <dd>{getMultiAnswerSummary(answers, "ideaAssets")}</dd>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.reviewRow}>
                    <dt>Client goals</dt>
                    <dd>{getMultiAnswerSummary(answers, "clientOutcomes")}</dd>
                  </div>
                  <div className={styles.reviewRow}>
                    <dt>Client request</dt>
                    <dd>{getTextSummary(answers, "clientBrief")}</dd>
                  </div>
                  <div className={styles.reviewRow}>
                    <dt>Users</dt>
                    <dd>{getMultiAnswerSummary(answers, "clientUsers")}</dd>
                  </div>
                  <div className={styles.reviewRow}>
                    <dt>First-version features</dt>
                    <dd>{getMultiAnswerSummary(answers, "clientFeatures")}</dd>
                  </div>
                  <div className={styles.reviewRow}>
                    <dt>What the client has</dt>
                    <dd>{getMultiAnswerSummary(answers, "clientAssets")}</dd>
                  </div>
                  <div className={styles.reviewRow}>
                    <dt>Constraints</dt>
                    <dd>{getMultiAnswerSummary(answers, "clientConstraints")}</dd>
                  </div>
                  <div className={styles.reviewRow}>
                    <dt>Approver</dt>
                    <dd>
                      {getChoiceLabel(
                        CLIENT_APPROVER_CHOICES,
                        answers.clientApprover,
                      )}
                    </dd>
                  </div>
                </>
              )}
              <div className={styles.reviewRow}>
                <dt>Frontend</dt>
                <dd>
                  {answers.projectType
                    ? getChoiceLabel(
                        [
                          ...FRONTEND_CHOICES[answers.projectType],
                          NOT_SURE_STACK_CHOICE,
                        ],
                        answers.frontendStack,
                      )
                    : "Skipped"}
                </dd>
              </div>
              <div className={styles.reviewRow}>
                <dt>Backend / API</dt>
                <dd>
                  {answers.projectType
                    ? getChoiceLabel(
                        getBackendChoices(
                          answers.projectType,
                          answers.frontendStack,
                        ),
                        answers.backendStack,
                      )
                    : "Skipped"}
                </dd>
              </div>
              <div className={styles.reviewRow}>
                <dt>Database / storage</dt>
                <dd>
                  {answers.projectType
                    ? getChoiceLabel(
                        getDatabaseChoices(
                          answers.projectType,
                          answers.backendStack,
                        ),
                        answers.database,
                      )
                    : "Skipped"}
                </dd>
              </div>
              <div className={styles.reviewRow}>
                <dt>Other services</dt>
                <dd>{getMultiAnswerSummary(answers, "stackServices")}</dd>
              </div>
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
              Refreshing this page clears these answers. Saving is not available
              yet.
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
                {currentStep.title}
              </h2>
              <p>{currentStep.description}</p>
            </div>

            <div className={styles.answerArea}>
              {currentStep.type === "single" && (
                <div className={styles.choiceList}>
                  {currentStep.choices.map((choice) => {
                    const selected =
                      currentStep.field === "mode"
                        ? answers.mode === choice.value
                        : currentStep.field === "projectType"
                          ? answers.projectType === choice.value
                          : currentStep.field === "businessType"
                            ? answers.businessType === choice.value
                            : currentStep.field === "clientApprover"
                              ? answers.clientApprover === choice.value
                              : currentStep.field === "frontendStack"
                                ? answers.frontendStack === choice.value
                                : currentStep.field === "backendStack"
                                  ? answers.backendStack === choice.value
                                  : answers.database === choice.value;

                    return (
                      <button
                        className={`${styles.singleChoice} ${
                          selected ? styles.selectedChoice : ""
                        }`}
                        type="button"
                        aria-pressed={selected}
                        key={choice.value}
                        onClick={() => chooseSingle(currentStep, choice.value)}
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
                    disabled={answers.textNotDecided[currentStep.field]}
                    onChange={(event) =>
                      updateTextAnswer(currentStep.field, event.target.value)
                    }
                  />
                  <button
                    className={`${styles.notDecidedButton} ${
                      answers.textNotDecided[currentStep.field]
                        ? styles.selectedNotDecided
                        : ""
                    }`}
                    type="button"
                    aria-pressed={answers.textNotDecided[currentStep.field]}
                    onClick={() => toggleTextNotDecided(currentStep.field)}
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
                          checked={answers.multiAnswers[
                            currentStep.field
                          ].includes(choice.value)}
                          onChange={() =>
                            toggleMultiChoice(currentStep.field, choice.value)
                          }
                        />
                        <span
                          className={styles.checkboxMark}
                          aria-hidden="true"
                        />
                        <span>{choice.label}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    className={`${styles.notDecidedButton} ${
                      answers.multiNotDecided[currentStep.field]
                        ? styles.selectedNotDecided
                        : ""
                    }`}
                    type="button"
                    aria-pressed={answers.multiNotDecided[currentStep.field]}
                    onClick={() => toggleMultiNotDecided(currentStep.field)}
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
                  (currentStep.field === "mode" && answers.mode === null) ||
                  (currentStep.field === "projectType" &&
                    answers.projectType === null)
                }
              >
                {currentStep.id === "external-services"
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
