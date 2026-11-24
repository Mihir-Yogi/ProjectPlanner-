import { Suspense } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { ProjectDetails } from "./project-details";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

async function ProjectContent({ params }: ProjectPageProps) {
  const { projectId } = await params;
  return <ProjectDetails projectId={projectId} />;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <WorkspaceShell activePage="projects">
      <Suspense fallback={<p>Loading saved project…</p>}>
        <ProjectContent params={params} />
      </Suspense>
    </WorkspaceShell>
  );
}
