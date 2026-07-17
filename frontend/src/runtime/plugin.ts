import { inject, type InjectionKey, type Plugin } from "vue";

import { cosmosTheme } from "../themes/cosmos";
import { CosmosApiClient } from "./apiClient";
import { ApplicationRuntime } from "./applicationRuntime";
import { CosmosMapRuntime } from "./cosmosMapRuntime";
import { ThemeRegistry } from "./themeRegistry";
import { ThemeRuntime } from "./themeRuntime";
import { TransitionRuntime } from "./transitionRuntime";
import { WindowRuntime } from "./windowRuntime";
import { WorkspaceRuntime } from "./workspaceRuntime";

export interface CosmosFrontendRuntime {
  api: CosmosApiClient;
  application: ApplicationRuntime;
  cosmosMap: CosmosMapRuntime;
  themes: ThemeRuntime;
  transitions: TransitionRuntime;
  windows: WindowRuntime;
  workspaces: WorkspaceRuntime;
}

export interface CosmosRuntimePluginOptions {
  apiBaseUrl?: string;
  runtime?: CosmosFrontendRuntime;
}

export const cosmosRuntimeKey: InjectionKey<CosmosFrontendRuntime> = Symbol("cosmos-runtime");

export function createCosmosFrontendRuntime(apiBaseUrl?: string): CosmosFrontendRuntime {
  const api = new CosmosApiClient(apiBaseUrl);
  const transitions = new TransitionRuntime();
  const registry = new ThemeRegistry();
  registry.register(cosmosTheme);
  const themes = new ThemeRuntime(registry, transitions, cosmosTheme.objectId);
  const windows = new WindowRuntime();
  const cosmosMap = new CosmosMapRuntime(api);

  return {
    api,
    application: new ApplicationRuntime(api, themes, cosmosTheme.objectId),
    cosmosMap,
    themes,
    transitions,
    windows,
    workspaces: new WorkspaceRuntime(windows),
  };
}

export function createCosmosRuntimePlugin(options: CosmosRuntimePluginOptions = {}): Plugin {
  const runtime = options.runtime ?? createCosmosFrontendRuntime(options.apiBaseUrl);

  return {
    install(app) {
      app.provide(cosmosRuntimeKey, runtime);
    },
  };
}

export function useCosmosRuntime(): CosmosFrontendRuntime {
  const runtime = inject(cosmosRuntimeKey);
  if (!runtime) throw new Error("Cosmos frontend runtime is not installed.");
  return runtime;
}
