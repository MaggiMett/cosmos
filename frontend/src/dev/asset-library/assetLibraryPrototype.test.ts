import { beforeAll, describe, expect, it } from "vitest";

import {
  ASSET_LIBRARY_STATUS_DETAILS,
  AssetLibraryStatus,
  cardAccessibleLabel,
  catalogContextsFor,
  createAssetLibraryPrototype,
  nextAssetGridIndex,
  queryAssetLibrary,
  type AssetLibraryFilters,
  type AssetLibraryPrototype,
  type AssetLibraryViewId,
} from "./assetLibraryPrototype";

const noFilters: AssetLibraryFilters = {
  category: "",
  scope: "",
  origin: "",
  status: "",
};

describe("Asset Library fixture projection", () => {
  let prototype: Readonly<AssetLibraryPrototype>;

  beforeAll(async () => {
    prototype = await createAssetLibraryPrototype();
  });

  it("projects canonical Catalog entries separately from fixture drafts", () => {
    const cataloged = query(prototype, "all-assets");
    const drafts = query(prototype, "drafts");

    expect(cataloged).toHaveLength(5);
    expect(cataloged.every((item) => item.kind === "cataloged")).toBe(true);
    expect(drafts).toHaveLength(3);
    expect(drafts.every((item) => item.kind !== "cataloged")).toBe(true);
    expect(drafts.every((item) => item.kind !== "rejected-import")).toBe(true);
  });

  it("implements all five binding system views without inventing personal entries", () => {
    expect(query(prototype, "all-assets")).toHaveLength(5);
    expect(query(prototype, "my-assets")).toEqual([]);
    expect(query(prototype, "current-theme")).toHaveLength(5);
    expect(query(prototype, "drafts")).toHaveLength(3);
    expect(query(prototype, "needs-attention")).toHaveLength(3);
  });

  it("searches names, descriptions, categories, tags and exact IDs in the active view", () => {
    expect(search(prototype, "all-assets", "wood").map((item) => item.name))
      .toEqual(["Bookshelf", "Wooden Door"]);
    expect(search(prototype, "all-assets", "core.category.decoration").map(
      (item) => item.name,
    )).toEqual(["Plant"]);
    expect(search(
      prototype,
      "all-assets",
      "core.visual-asset.workbench",
    ).map((item) => item.name)).toEqual(["Workbench"]);
    expect(search(prototype, "drafts", "Imported Vector").map(
      (item) => item.status,
    )).toEqual([AssetLibraryStatus.Warning]);
    expect(search(prototype, "all-assets", "Imported Vector")).toEqual([]);
  });

  it("combines category, Scope, Origin and Status filters deterministically", () => {
    const architecture = filtered(prototype, "all-assets", {
      ...noFilters,
      category: "core.category.architecture",
    });
    const coreBuiltIn = filtered(prototype, "all-assets", {
      ...noFilters,
      scope: "core",
      origin: "built-in",
      status: AssetLibraryStatus.Cataloged,
    });
    const personalWarning = filtered(prototype, "drafts", {
      ...noFilters,
      scope: "personal",
      origin: "imported",
      status: AssetLibraryStatus.Warning,
    });

    expect(architecture.map((item) => item.name)).toEqual([
      "Steel Door",
      "Wooden Door",
    ]);
    expect(coreBuiltIn).toHaveLength(5);
    expect(personalWarning.map((item) => item.name)).toEqual([
      "Imported Vector",
    ]);
  });

  it("exposes every required status with an icon and readable label", () => {
    const statuses = new Set(prototype.items.map((item) => item.status));

    expect(statuses).toEqual(new Set([
      AssetLibraryStatus.NeedsMetadata,
      AssetLibraryStatus.ReadyForCatalog,
      AssetLibraryStatus.Cataloged,
      AssetLibraryStatus.Warning,
      AssetLibraryStatus.Rejected,
    ]));
    for (const status of statuses) {
      expect(ASSET_LIBRARY_STATUS_DETAILS[status].icon).not.toBe("");
      expect(ASSET_LIBRARY_STATUS_DETAILS[status].label).not.toBe("");
    }
  });

  it("retains rejected files only in Needs Attention and creates no asset for them", () => {
    const rejected = filtered(prototype, "needs-attention", {
      ...noFilters,
      status: AssetLibraryStatus.Rejected,
    });

    expect(rejected).toHaveLength(1);
    expect(rejected[0]?.kind).toBe("rejected-import");
    expect(query(prototype, "all-assets")).not.toContainEqual(rejected[0]);
    expect(query(prototype, "drafts")).not.toContainEqual(rejected[0]);
    expect("draftVisualAsset" in rejected[0]!).toBe(false);
    expect("catalogEntry" in rejected[0]!).toBe(false);
  });

  it("provides metadata, technical source and exact Catalog contexts for detail", () => {
    const bookshelf = query(prototype, "all-assets").find(
      (item) => item.name === "Bookshelf",
    );
    expect(bookshelf?.kind).toBe("cataloged");
    if (bookshelf?.kind !== "cataloged") throw new Error("Fixture missing.");

    expect(bookshelf.visualAsset.format).toBe("svg");
    expect(bookshelf.catalogEntry.creator.name).toBe("Cosmos Core Team");
    expect(bookshelf.catalogEntry.license.expression).toBe("CC0-1.0");
    expect(catalogContextsFor(prototype, bookshelf).map((entry) => entry.id))
      .toEqual(["core.asset-catalog.bookshelf"]);
    expect(cardAccessibleLabel(bookshelf)).toContain(
      "Bookshelf, cataloged asset, Furniture, core scope, Cataloged, svg",
    );
  });

  it("uses the existing completion and import services without promoting drafts", () => {
    const readyDraft = filtered(prototype, "drafts", {
      ...noFilters,
      status: AssetLibraryStatus.ReadyForCatalog,
    });

    expect(readyDraft).toHaveLength(1);
    expect(readyDraft[0]?.kind).toBe("catalog-draft");
    expect(prototype.registry.list()).toHaveLength(5);
    expect(
      prototype.registry.getByVersion(
        "personal.asset-catalog.imported-swatch",
        "1.0.0",
      ),
    ).toBeUndefined();
    expect(JSON.stringify(prototype.items)).not.toContain(
      "visualObjectDefinition",
    );
    expect(JSON.stringify(prototype.items)).not.toContain("interactionZone");
    expect(JSON.stringify(prototype.items)).not.toContain("functionBinding");
  });
});

describe("Asset Library keyboard navigation", () => {
  it("moves through a roving grid without leaving its bounds", () => {
    expect(nextAssetGridIndex(0, "ArrowLeft", 3, 8)).toBe(0);
    expect(nextAssetGridIndex(0, "ArrowRight", 3, 8)).toBe(1);
    expect(nextAssetGridIndex(1, "ArrowDown", 3, 8)).toBe(4);
    expect(nextAssetGridIndex(4, "ArrowUp", 3, 8)).toBe(1);
    expect(nextAssetGridIndex(7, "ArrowDown", 3, 8)).toBe(7);
    expect(nextAssetGridIndex(4, "Home", 3, 8)).toBe(0);
    expect(nextAssetGridIndex(4, "End", 3, 8)).toBe(7);
    expect(nextAssetGridIndex(0, "Home", 3, 0)).toBe(-1);
  });
});

function query(
  prototype: Readonly<AssetLibraryPrototype>,
  view: AssetLibraryViewId,
) {
  return queryAssetLibrary(prototype, {
    view,
    search: "",
    filters: noFilters,
  });
}

function search(
  prototype: Readonly<AssetLibraryPrototype>,
  view: AssetLibraryViewId,
  searchValue: string,
) {
  return queryAssetLibrary(prototype, {
    view,
    search: searchValue,
    filters: noFilters,
  });
}

function filtered(
  prototype: Readonly<AssetLibraryPrototype>,
  view: AssetLibraryViewId,
  filters: Readonly<AssetLibraryFilters>,
) {
  return queryAssetLibrary(prototype, {
    view,
    search: "",
    filters,
  });
}
