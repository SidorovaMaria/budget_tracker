interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function fetcher<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = 5000, headers: customHeaders = {}, ...restOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };
  const config: RequestInit = { ...restOptions, headers, signal: controller.signal };
  try {
    const response = await fetch(url, config);
    clearTimeout(id);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
