import type { DeepReadonly } from "vue";

import type {
  CosmosMapRuntime,
  CosmosMapSnapshot,
  MapConnection,
  MapNode,
  MapProject,
} from "../../runtime/cosmosMapRuntime";

export interface ProjectCosmosNodePresentation {
  objectId: string;
  displayName: string;
  description: string;
  typeLabel: string;
  isSelected: boolean;
  style: Readonly<Record<string, string>>;
}

export interface ProjectCosmosConnectionPresentation {
  objectId: string;
  provenance: MapConnection["provenance"];
  path: string;
}

export interface ProjectCosmosPresentation {
  objectId: string;
  displayName: string;
  description: string;
  isFocused: boolean;
  isCoreSelected: boolean;
  nodes: readonly Readonly<ProjectCosmosNodePresentation>[];
  connections: readonly Readonly<ProjectCosmosConnectionPresentation>[];
  style: Readonly<Record<string, string>>;
}

interface ProjectCosmosStateBase {
  projectName: string;
  objectCount: number;
  zoomLabel: string;
}

export type ProjectCosmosPresentationState =
  | (ProjectCosmosStateBase & { phase: "loading" })
  | (ProjectCosmosStateBase & { phase: "error"; message: string })
  | (ProjectCosmosStateBase & { phase: "not-found"; requestedProjectId: string | null })
  | (ProjectCosmosStateBase & {
      phase: "empty-project";
      project: Readonly<ProjectCosmosPresentation>;
    })
  | (ProjectCosmosStateBase & {
      phase: "success";
      project: Readonly<ProjectCosmosPresentation>;
    });

interface CanvasPoint {
  x: number;
  y: number;
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 760;
const CORE_POINT: Readonly<CanvasPoint> = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };
const DEFAULT_LIGHT = [116, 190, 226] as const;

export function loadProjectCosmosSnapshot(
  runtime: Readonly<Pick<CosmosMapRuntime, "load">>,
): Promise<void> {
  return runtime.load();
}

export function projectIdFromQuery(value: unknown): string | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : null;
}

export function projectProjectCosmosState(
  phase: CosmosMapRuntime["state"]["phase"],
  snapshot: DeepReadonly<CosmosMapSnapshot> | null,
  error: string | null,
  requestedProjectId: string | null,
  selectedObjectId: string | null = snapshot?.selectedObjectId ?? null,
): ProjectCosmosPresentationState {
  if (phase === "idle" || phase === "loading") {
    return { phase: "loading", projectName: "Project", objectCount: 0, zoomLabel: "--" };
  }
  if (phase === "failed") {
    return {
      phase: "error",
      projectName: "Project",
      objectCount: 0,
      zoomLabel: "--",
      message: error ?? "The Cosmos map could not be loaded.",
    };
  }
  if (!snapshot) {
    return {
      phase: "error",
      projectName: "Project",
      objectCount: 0,
      zoomLabel: "--",
      message: "The Cosmos map returned no snapshot.",
    };
  }

  const project = requestedProjectId === null
    ? undefined
    : snapshot.projects.find((candidate) => candidate.objectId === requestedProjectId);
  if (!project) {
    return {
      phase: "not-found",
      projectName: "Project",
      objectCount: 0,
      zoomLabel: zoomLabel(snapshot.camera.zoom),
      requestedProjectId,
    };
  }

  const presentation = projectProjectCosmosSnapshot(snapshot, project, selectedObjectId);
  const base = {
    projectName: presentation.displayName,
    objectCount: presentation.nodes.length,
    zoomLabel: zoomLabel(snapshot.camera.zoom),
    project: presentation,
  };
  return presentation.nodes.length === 0
    ? { phase: "empty-project", ...base }
    : { phase: "success", ...base };
}

export function projectProjectCosmosSnapshot(
  snapshot: DeepReadonly<CosmosMapSnapshot>,
  project: DeepReadonly<MapProject>,
  runtimeSelectedObjectId: string | null = snapshot.selectedObjectId,
): Readonly<ProjectCosmosPresentation> {
  const nodes = project.nodes.filter((node) => node.objectId !== project.objectId);
  const selectedObjectId = nodes.some((node) => node.objectId === runtimeSelectedObjectId)
    ? runtimeSelectedObjectId
    : null;
  const points = projectNodePoints(project, nodes);
  const memberIds = new Set([project.objectId, ...nodes.map((node) => node.objectId)]);
  const connections = snapshot.connections
    .filter(
      (connection) =>
        memberIds.has(connection.endpointAId) && memberIds.has(connection.endpointBId),
    )
    .flatMap((connection) => projectConnection(connection, points));
  const light = colorChannels(project.color);

  return {
    objectId: project.objectId,
    displayName: project.displayName,
    description: project.description,
    isFocused: snapshot.focusedProjectId === project.objectId,
    isCoreSelected: runtimeSelectedObjectId === project.objectId,
    nodes: nodes.map((node) => {
      const point = points.get(node.objectId) ?? CORE_POINT;
      return {
        objectId: node.objectId,
        displayName: node.displayName,
        description: node.description,
        typeLabel: nodeTypeLabel(node),
        isSelected: selectedObjectId === node.objectId,
        style: {
          "--node-left": `${round((point.x / CANVAS_WIDTH) * 100)}%`,
          "--node-top": `${round((point.y / CANVAS_HEIGHT) * 100)}%`,
          "--node-size": `${nodeSize(node.hierarchyLevel)}px`,
        },
      };
    }),
    connections,
    style: { "--project-light": light.join(", ") },
  };
}

function projectNodePoints(
  project: DeepReadonly<MapProject>,
  nodes: readonly DeepReadonly<MapNode>[],
): ReadonlyMap<string, Readonly<CanvasPoint>> {
  const points = new Map<string, Readonly<CanvasPoint>>([[project.objectId, CORE_POINT]]);
  const maxDeltaX = Math.max(...nodes.map((node) => Math.abs(node.x - project.x)), 0);
  const maxDeltaY = Math.max(...nodes.map((node) => Math.abs(node.y - project.y)), 0);

  nodes.forEach((node, index) => {
    const angle = nodes.length === 0 ? 0 : (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
    const x = maxDeltaX === 0
      ? CORE_POINT.x + Math.cos(angle) * 350
      : CORE_POINT.x + ((node.x - project.x) / maxDeltaX) * 390;
    const y = maxDeltaY === 0
      ? CORE_POINT.y + Math.sin(angle) * 245
      : CORE_POINT.y + ((node.y - project.y) / maxDeltaY) * 255;
    points.set(node.objectId, { x: clamp(x, 140, 1060), y: clamp(y, 90, 670) });
  });
  return points;
}

function projectConnection(
  connection: DeepReadonly<MapConnection>,
  points: ReadonlyMap<string, Readonly<CanvasPoint>>,
): readonly Readonly<ProjectCosmosConnectionPresentation>[] {
  const start = points.get(connection.endpointAId);
  const end = points.get(connection.endpointBId);
  if (!start || !end) return [];
  const controlX = round((start.x + end.x) / 2);
  return [{
    objectId: connection.objectId,
    provenance: connection.provenance,
    path: `M${round(start.x)} ${round(start.y)} C${controlX} ${round(start.y)} ${controlX} ${round(end.y)} ${round(end.x)} ${round(end.y)}`,
  }];
}

function nodeTypeLabel(node: DeepReadonly<MapNode>): string {
  const semanticTag = node.systemTags.find(
    (tag) => !["Node", "Project", "ProjectRoot", "System"].includes(tag),
  );
  return semanticTag ?? node.hierarchyLevel;
}

function nodeSize(level: MapNode["hierarchyLevel"]): number {
  switch (level) {
    case "ProjectRoot":
      return 32;
    case "Domain":
      return 28;
    case "Cluster":
      return 23;
    case "Object":
      return 16;
    case "Detail":
      return 10;
  }
}

function colorChannels(value: string): readonly [number, number, number] {
  const short = /^#([\da-f])([\da-f])([\da-f])$/iu.exec(value.trim());
  if (short) {
    return [
      Number.parseInt(`${short[1]}${short[1]}`, 16),
      Number.parseInt(`${short[2]}${short[2]}`, 16),
      Number.parseInt(`${short[3]}${short[3]}`, 16),
    ];
  }
  const full = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/iu.exec(value.trim());
  if (!full) return DEFAULT_LIGHT;
  return [
    Number.parseInt(full[1] ?? "74", 16),
    Number.parseInt(full[2] ?? "be", 16),
    Number.parseInt(full[3] ?? "e2", 16),
  ];
}

function zoomLabel(zoom: number): string {
  return Number.isFinite(zoom) ? `${Math.round(zoom * 100)}%` : "--";
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
