import { inject, type InjectionKey, type Plugin } from "vue";

import { cosmosTheme } from "../themes/cosmos";
import { CosmosApiClient } from "./apiClient";
import { ApplicationRuntime } from "./applicationRuntime";
import { BaseRuntime } from "./baseRuntime";
import { CosmosMapRuntime } from "./cosmosMapRuntime";
import { CoreToolsRuntime } from "./coreToolsRuntime";
import { NotificationRuntime } from "./notificationRuntime";
import { ObjectInteractionRuntime } from "./objectInteractionRuntime";
import { ThemeRegistry } from "./themeRegistry";
import { ThemeRuntime } from "./themeRuntime";
import { ToolRuntime } from "./toolRuntime";
import { TransitionRuntime } from "./transitionRuntime";
import { WindowRuntime } from "./windowRuntime";
import { WorkspaceRuntime } from "./workspaceRuntime";

export interface CosmosFrontendRuntime {
  api: CosmosApiClient;
  application: ApplicationRuntime;
  base: BaseRuntime;
  cosmosMap: CosmosMapRuntime;
  coreTools: CoreToolsRuntime;
  notifications: NotificationRuntime;
  objectInteractions: ObjectInteractionRuntime;
  themes: ThemeRuntime;
  tools: ToolRuntime;
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
  const tools = new ToolRuntime(windows, api);
  const cosmosMap = new CosmosMapRuntime(api);
  const base = new BaseRuntime(api);
  const notifications = new NotificationRuntime(api, cosmosMap, base);

  return {
    api,
    application: new ApplicationRuntime(api, themes, cosmosTheme.objectId),
    base,
    cosmosMap,
    coreTools: new CoreToolsRuntime(api),
    notifications,
    objectInteractions: new ObjectInteractionRuntime(api, windows, cosmosMap),
    themes,
    tools,
    transitions,
    windows,
    workspaces: new WorkspaceRuntime(windows, api, tools),
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
