import type { Router, RequestHandler } from "express";

import type { AuthStrategy, AuthOptions } from "./utils/types";
import TokenFamilies from "./TokenFamilies";
import UnverifiedUsers from "./UnverifiedUsers";
import requireLogin from "./middlewares/requireLogin";
import requireRole from "./middlewares/requireRole";
import authRouter from "./router";

interface AuthLib<Roles extends string> {
  requireLogin: RequestHandler;
  requireRole: (requiredRole: Roles) => RequestHandler;
  router: Router;
}

/**
 * Create auth library.
 * @param strategy Auth abstraction functions.
 * @param options Auth options.
 * @param options.roleLevels List of user roles assiociated with their level (numeric value).
 *    If a minimum role is required in order to authorize some action,
 *    any role level higher or equal will be accepted.
 * @param options.https Is https enabled (default true).
 * @returns Auth library.
 */
const auth = <Roles extends string>(
  strategy: AuthStrategy<Roles>,
  options: AuthOptions<Roles>
): AuthLib<Roles> => {
  const tokenFamilies: TokenFamilies<Roles> = new TokenFamilies();
  const unverifiedUsers: UnverifiedUsers<Roles> = new UnverifiedUsers();

  return {
    requireLogin: requireLogin(tokenFamilies),
    requireRole: (requiredRole: Roles) =>
      requireRole(tokenFamilies, options.roleLevels, requiredRole),
    router: authRouter(strategy, tokenFamilies, unverifiedUsers, options),
  };
};

export default auth;
