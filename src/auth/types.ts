import type { JwtHeader } from "njwt";

import type { Optional, Request, ReqCookies, TokenBody } from "../utils/types";
import type TokenFamily from "./TokenFamily";

// ===========================================================================
// User
// ===========================================================================

export type UserId = string;

export interface User<Roles extends string> {
  id: UserId;
  name: string;
  email: string;
  hashedPassword: string;
  role?: Roles;
}

export type RoleLevels<Roles extends string> = {
  [role in Roles]: number;
};

export interface UserInfo<Roles extends string> {
  id: UserId;
  role?: Roles;
}

// ===========================================================================
// Request
// ===========================================================================

export interface ReqTokenCookies extends ReqCookies {
  // eslint-disable-next-line camelcase
  access_token?: string;
  // eslint-disable-next-line camelcase
  refresh_token?: string;
}

export interface AuthenticateReq<Roles extends string> extends Request {
  user?: UserInfo<Roles>;
  cookies: ReqTokenCookies;
}

export interface AuthorizedReq<Roles extends string>
  extends AuthenticateReq<Roles> {
  user: UserInfo<Roles>;
}

// ===========================================================================
// AuthToken
// ===========================================================================

export interface AuthTokenBody<Roles extends string> extends TokenBody {
  role?: Roles;
}

export interface JwtAuthData<Roles extends string> {
  header: JwtHeader;
  body: AuthTokenBody<Roles>;
  family: TokenFamily<Roles>;
}

// ===========================================================================
// UnverifiedUser
// ===========================================================================

export interface UnverifiedUserTokenBody<Roles extends string>
  extends AuthTokenBody<Roles> {
  email: string;
}
