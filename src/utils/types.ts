import type express from "express";
import type { JwtBody } from "njwt";

// ===========================================================================
// Optional
// ===========================================================================

export type Optional<T> = T | undefined;

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
// express
// ===========================================================================

export interface ReqBody {
  [key: string]: string | undefined;
}

export interface ReqCookies {
  [key: string]: string | undefined;
}

export interface Request extends express.Request {
  cookies: ReqCookies;
  body: ReqBody;
}

export interface AsyncRequestHandler {
  (
    req: Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void>;
}

// ===========================================================================
// Token
// ===========================================================================

export type CompactedToken = string;

export interface TokenBody extends JwtBody {
  sub: string;
  jti: string;
}
