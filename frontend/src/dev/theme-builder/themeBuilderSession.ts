import {
  cloneAndFreeze,
  type ThemeBuilderProject,
  type ThemeBuilderProjectMetadata,
} from "../../theme-engine";
import type { ApiError, ApiResult } from "../../runtime/contracts";

export interface UpdateThemeMetadataCommand {
  type: "update-theme-metadata";
  metadata: ThemeBuilderProjectMetadata;
}

export interface ThemeBuilderSavePort {
  saveMetadata(
    builderProjectId: string,
    expectedRevision: number,
    metadata: ThemeBuilderProjectMetadata,
  ): Promise<ApiResult<Readonly<ThemeBuilderProject>>>;
}

export interface ThemeBuilderSessionSnapshot {
  project: Readonly<ThemeBuilderProject>;
  dirty: boolean;
  saving: boolean;
  canUndo: boolean;
  canRedo: boolean;
  saveError?: ApiError;
  saveConflict?: ApiError;
}

export class ThemeBuilderSession {
  private states: Readonly<ThemeBuilderProject>[];
  private cursor = 0;
  private savedCursor = 0;
  private authoritativeRevision: number;
  private saving = false;
  private saveError?: ApiError;
  private saveConflict?: ApiError;

  constructor(project: Readonly<ThemeBuilderProject>) {
    this.states = [cloneAndFreeze(project)];
    this.authoritativeRevision = project.revision;
  }

  get snapshot(): Readonly<ThemeBuilderSessionSnapshot> {
    return Object.freeze({
      project: this.states[this.cursor]!,
      dirty: this.cursor !== this.savedCursor,
      saving: this.saving,
      canUndo: this.cursor > 0,
      canRedo: this.cursor < this.states.length - 1,
      ...(this.saveError ? { saveError: this.saveError } : {}),
      ...(this.saveConflict ? { saveConflict: this.saveConflict } : {}),
    });
  }

  execute(command: Readonly<UpdateThemeMetadataCommand>): void {
    if (command.type !== "update-theme-metadata") return;
    const current = this.snapshot.project;
    const metadata = normalizedMetadata(command.metadata);
    const manifestDraft = {
      ...current.manifestDraft,
      displayName: metadata.name,
      description: metadata.description,
      ...(metadata.author ? { author: { name: metadata.author } } : {}),
    };
    if (!metadata.author) delete (manifestDraft as { author?: unknown }).author;
    const next = cloneAndFreeze({
      ...current,
      ...metadata,
      manifestDraft,
    });
    if (this.savedCursor > this.cursor) this.savedCursor = -1;
    this.states = [...this.states.slice(0, this.cursor + 1), next];
    this.cursor += 1;
    this.saveError = undefined;
    this.saveConflict = undefined;
  }

  undo(): void {
    if (this.cursor > 0) this.cursor -= 1;
  }

  redo(): void {
    if (this.cursor < this.states.length - 1) this.cursor += 1;
  }

  async save(port: ThemeBuilderSavePort): Promise<boolean> {
    if (this.saving || !this.snapshot.dirty) return false;
    this.saving = true;
    this.saveError = undefined;
    this.saveConflict = undefined;
    const current = this.snapshot.project;
    const result = await port.saveMetadata(
      current.builderProjectId,
      this.authoritativeRevision,
      metadataOf(current),
    );
    this.saving = false;
    if (!result.ok) {
      if (result.error.code === "theme_builder_project_revision_conflict") {
        this.saveConflict = result.error;
      } else {
        this.saveError = result.error;
      }
      return false;
    }
    this.states = this.states.map((state, index) =>
      cloneAndFreeze({
        ...result.data,
        ...(index === this.cursor ? {} : metadataOf(state)),
        manifestDraft: {
          ...result.data.manifestDraft,
          ...(index === this.cursor
            ? {}
            : {
                displayName: state.name,
                description: state.description,
                ...(state.author ? { author: { name: state.author } } : {}),
              }),
        },
      }),
    );
    this.authoritativeRevision = result.data.revision;
    this.savedCursor = this.cursor;
    return true;
  }
}

function metadataOf(project: Readonly<ThemeBuilderProject>): ThemeBuilderProjectMetadata {
  return { name: project.name, description: project.description, author: project.author };
}

function normalizedMetadata(metadata: ThemeBuilderProjectMetadata): ThemeBuilderProjectMetadata {
  return {
    name: metadata.name.trim(),
    description: metadata.description.trim(),
    author: metadata.author.trim(),
  };
}
