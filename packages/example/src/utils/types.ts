import type { ReactNode } from "react";
import type { QueryKey, UseQueryOptions } from "react-query";
import type { UserUnprotectedData } from "@tlariviere/auth";

import type { Roles } from "../api/strategy/roles";

// ===========================================================================
// User
// ===========================================================================

export type UserData = UserUnprotectedData<Roles>;

// ===========================================================================
// Error
// ===========================================================================

export interface NodeError extends Error {
  code: string;
}

export interface SystemError extends NodeError {
  syscall: string;
}

export const isSystemError = (error: NodeError): error is SystemError => {
  return (error as SystemError).syscall !== undefined;
};

// ===========================================================================
// Http
// ===========================================================================

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// ===========================================================================
// React
// ===========================================================================

export interface WithChildrenProps {
  children: ReactNode;
}

// ===========================================================================
// Fetch
// ===========================================================================

export type FetchReqBody<T> =
  | (T extends Record<string, unknown> ? T : never)
  | BodyInit
  | undefined;

export type UseFetchOptions<ResData, Key extends QueryKey> = {
  resJson: ResData extends Response ? false | undefined : true;
} & Omit<UseQueryOptions<ResData, Error, ResData, Key>, "queryKey" | "queryFn">;
