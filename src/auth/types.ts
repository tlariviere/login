import type { JwtHeader } from "njwt";

import type { TokenBody } from "../utils/types";
import type TokenFamily from "./TokenFamily";

// ===========================================================================
// User
// ===========================================================================

export type UserId = string;

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
