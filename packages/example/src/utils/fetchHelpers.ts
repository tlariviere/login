import type { HttpMethod, FetchReqBody } from "./types";
import HttpError from "./HttpError";
import fetchOptions from "../constants/fetchOptions";

interface FetchOptions<JsonReqBody> {
  method?: HttpMethod;
  body?: FetchReqBody<JsonReqBody>;
  signal?: AbortSignal;
}

type FetchArgs<JsonReqBody> = [
  url: string,
  options?: FetchOptions<JsonReqBody>
];

export const fetchData = async <JsonReqBody>(
  ...args: FetchArgs<JsonReqBody>
): Promise<Response> => {
  const [url, options] = args;
  const { method = "GET", body, signal } = options ?? {};
  const res = await fetch(url, {
    ...fetchOptions,
    signal,
    method,
    headers:
      typeof body === "object"
        ? {
            "Content-Type": "application/json",
          }
        : {},
    body: body ?? typeof body === "object" ? JSON.stringify(body) : body,
  });
  if (!res.ok) {
    throw new HttpError(res.status, await res.text());
  }
  return res;
};

export const fetchJson = async <ResData = unknown, JsonReqBody = unknown>(
  ...args: FetchArgs<JsonReqBody>
): Promise<ResData> => {
  const res = await fetchData<JsonReqBody>(...args);
  const json = (await res.json()) as ResData;
  return json;
};
