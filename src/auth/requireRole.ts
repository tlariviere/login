import type { AsyncRequestHandler } from "../utils/types";
import type { RoleLevels, AuthorizedReq } from "./types";
import TokenFamilies from "./TokenFamilies";
import requireLogin from "./requireLogin";

/**
 * Middleware to forbid route unless user has required permission represented by role level.
 * `requireLogin` middleware is called beforehand.
 * @param tokenFamilies Access and refresh tokens families.
 * @param roleLevels List of user roles assiociated with their level (numeric value).
 * @param requiredRole Minimum role required, any role level higher or equal will be accepted.
 * @returns Express middleware.
 */
const requireRole = <Roles extends string>(
  tokenFamilies: TokenFamilies<Roles>,
  roleLevels: RoleLevels<Roles>,
  requiredRole: Roles
): AsyncRequestHandler => {
  const loginMiddleware = requireLogin(tokenFamilies);
  return (req, res, next) =>
    loginMiddleware(req, res, () => {
      const { role } = (req as AuthorizedReq<Roles>).user;
      if (!role || roleLevels[role] < roleLevels[requiredRole]) {
        res.status(403).send(`Permission '${requiredRole}' required`);
      } else {
        next();
      }
    });
};

export default requireRole;
