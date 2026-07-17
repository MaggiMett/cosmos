import type { InjectionKey, Plugin } from "vue";

import { CosmosApiClient } from "./apiClient";

export interface CosmosFrontendRuntime {
  api: CosmosApiClient;
}

export interface CosmosRuntimePluginOptions {
  apiBaseUrl?: string;
}

export const cosmosRuntimeKey: InjectionKey<CosmosFrontendRuntime> = Symbol("cosmos-runtime");

export function createCosmosRuntimePlugin(options: CosmosRuntimePluginOptions = {}): Plugin {
  const runtime: CosmosFrontendRuntime = {
    api: new CosmosApiClient(options.apiBaseUrl),
  };

  return {
    install(app) {
      app.provide(cosmosRuntimeKey, runtime);
    },
  };
}
