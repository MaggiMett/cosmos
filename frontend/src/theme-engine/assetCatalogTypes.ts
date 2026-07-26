import type {
  AssetFormat,
  AssetKind,
  AssetMimeType,
  NamespacedId,
  SemanticVersion,
  VersionedRef,
} from "./types";

export interface ExactVersionedRef {
  id: NamespacedId;
  version: SemanticVersion;
}

/**
 * A safe, immutable media resource. It intentionally carries no placement,
 * hitbox, function, renderer or runtime semantics.
 */
export interface VisualAsset {
  $schema?: string;
  schemaVersion: 1;
  id: NamespacedId;
  version: SemanticVersion;
  kind: AssetKind;
  format: AssetFormat;
  mimeType: AssetMimeType;
  path: string;
  sha256: string;
  byteSize: number;
  width: number;
  height: number;
  colorSpace?: "srgb" | "display-p3" | "unknown";
  alpha?: boolean;
  density?: number;
  accessibilityDescription?: string;
}

export interface AssetCatalogCreator {
  id?: NamespacedId;
  name: string;
  url?: string;
}

export type AssetProvenanceKind =
  | "original"
  | "generated"
  | "imported"
  | "derived"
  | "unknown";

export interface AssetProvenance {
  kind: AssetProvenanceKind;
  source?: string;
  sourceRef?: string;
  notes?: string;
}

export interface AssetLicense {
  expression: string;
  attribution?: string;
  url?: string;
}

/**
 * Discovery metadata for a Visual Asset. Compatibility fields are descriptive
 * filters only; they do not grant placement, interaction or runtime behavior.
 */
export interface AssetCatalogEntry {
  $schema?: string;
  schemaVersion: 1;
  id: NamespacedId;
  version: SemanticVersion;
  visualAssetRef: ExactVersionedRef;
  displayName: string;
  description: string;
  category: NamespacedId;
  subCategory?: NamespacedId;
  systemTags: readonly NamespacedId[];
  userTags: readonly string[];
  perspective: string;
  orientation: string;
  scaleClass: string;
  theme?: NamespacedId;
  creator: AssetCatalogCreator;
  provenance: AssetProvenance;
  license: AssetLicense;
  thumbnailRef?: ExactVersionedRef;
  previewRef?: ExactVersionedRef;
  layerPreviewRef?: ExactVersionedRef;
  compatibleTemplates: readonly VersionedRef[];
  compatibleSurfaceTypes: readonly string[];
  compatibleVisualObjectTypes: readonly string[];
  deprecated: boolean;
  replacement?: ExactVersionedRef;
}

export interface AssetCatalogRegistrationBatch {
  visualAssets: readonly unknown[];
  entries: readonly unknown[];
}
