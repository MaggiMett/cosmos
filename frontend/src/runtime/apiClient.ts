import type { ApiError, ApiRequestOptions, ApiResult } from "./contracts";

const defaultBaseUrl = import.meta.env.VITE_COSMOS_API_BASE_URL ?? "/api";

export class CosmosApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl = defaultBaseUrl) {
    this.baseUrl = normalizeBaseUrl(baseUrl);
  }

  get configured(): boolean {
    return this.baseUrl.length > 0;
  }

  get configuredBaseUrl(): string {
    return this.baseUrl;
  }

  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<ApiResult<T>> {
    if (!this.baseUrl) {
      return {
        ok: false,
        error: { kind: "unavailable", message: "No Cosmos API base URL is configured." },
      };
    }

    try {
      const response = await fetch(this.urlFor(path, options.query), {
        method: options.method ?? "GET",
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        headers: options.body === undefined ? undefined : { "Content-Type": "application/json" },
        signal: options.signal,
      });
      const payload = await parseJson(response);

      if (!response.ok) {
        return {
          ok: false,
          error: {
            kind: response.status === 400 || response.status === 422 ? "validation" : "http",
            status: response.status,
            message: backendErrorMessage(payload, response.status),
          },
        };
      }

      return { ok: true, data: payload as T };
    } catch (cause) {
      return { ok: false, error: normalizeApiError(cause) };
    }
  }

  get<T>(path: string, options: Omit<ApiRequestOptions, "method" | "body"> = {}): Promise<ApiResult<T>> {
    return this.request(path, { ...options, method: "GET" });
  }

  post<T>(
    path: string,
    body: unknown,
    options: Omit<ApiRequestOptions, "method" | "body"> = {},
  ): Promise<ApiResult<T>> {
    return this.request(path, { ...options, method: "POST", body });
  }

  put<T>(
    path: string,
    body: unknown,
    options: Omit<ApiRequestOptions, "method" | "body"> = {},
  ): Promise<ApiResult<T>> {
    return this.request(path, { ...options, method: "PUT", body });
  }

  private urlFor(path: string, query?: ApiRequestOptions["query"]): string {
    const url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    }

    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  }
}

export const cosmosApiClient = new CosmosApiClient();

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, "");
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function normalizeApiError(cause: unknown): ApiError {
  if (cause instanceof DOMException && cause.name === "AbortError") {
    return { kind: "network", message: "The request was cancelled.", cause };
  }
  if (cause instanceof TypeError) {
    return { kind: "network", message: "The Cosmos API is unavailable.", cause };
  }
  return { kind: "unknown", message: "The Cosmos API request failed.", cause };
}

function backendErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return `Cosmos API responded with ${status}.`;
}
