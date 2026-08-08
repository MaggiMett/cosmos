import type { CosmosMapRuntime } from "../../runtime/cosmosMapRuntime";
import type { ProjectCosmosPresentation } from "./projectCosmosProjection";

export interface ProjectCosmosObjectHost {
  openObject(objectId: string, section: "details"): Promise<unknown>;
}

export async function selectProjectCosmosNode(
  runtime: Readonly<Pick<CosmosMapRuntime, "select" | "persistSelection">>,
  project: Readonly<ProjectCosmosPresentation>,
  objectId: string,
): Promise<boolean> {
  if (!project.nodes.some((node) => node.objectId === objectId)) return false;
  runtime.select(objectId);
  await runtime.persistSelection();
  return true;
}

export async function openSelectedProjectCosmosNode(
  host: ProjectCosmosObjectHost,
  project: Readonly<ProjectCosmosPresentation>,
  objectId: string,
): Promise<boolean> {
  const node = project.nodes.find((candidate) => candidate.objectId === objectId);
  if (!node?.isSelected) return false;
  await host.openObject(objectId, "details");
  return true;
}
