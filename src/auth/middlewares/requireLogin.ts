import type { AsyncRequestHandler } from "../../utils/types";
import type { AuthenticateReq } from "../utils/types";
import TokenFamilies from "../TokenFamilies";

/**
 * Middleware to forbid route unless user is logged in.
 * @param tokenFamilies Access and refresh tokens families.
 * @returns Express middleware.
 */
const requireLogin = <Roles extends string>(
  tokenFamilies: TokenFamilies<Roles>
): AsyncRequestHandler => {
  return async (req: AuthenticateReq<Roles>, res, next) => {
    if (req.user) {
      next();
      return;
    }

    const { access_token: accessToken } = req.cookies;
    if (!accessToken) {
      res.sendStatus(401);
      return;
    }

    try {
      const { body } = await tokenFamilies.verifyAccessToken(accessToken);
      req.user = { id: body.sub, role: body.role };
      next();
    } catch (err) {
      res.status(401).send((err as Error).message);
    }
  };
};

export default requireLogin;
