import type { CookieOptions } from "express";

import type { AsyncRequestHandler } from "../../utils/types";
import type { AuthorizedReq } from "../utils/types";
import requireLogin from "../middlewares/requireLogin";
import TokenFamilies from "../TokenFamilies";

/**
 * Logout POST request handler.
 * Logout user and invalidate its token family.
 * `requireLogin` middleware is called beforehand.
 * @param tokenFamilies Function to send email verification when signing up new user.
 * @param cookieOptions Same cookie options used to store auth token.
 * @returns Express request handler.
 */
const signOut = <Roles extends string>(
  tokenFamilies: TokenFamilies<Roles>,
  cookieOptions: CookieOptions
): AsyncRequestHandler => {
  const loginMiddleware = requireLogin(tokenFamilies);
  return (req, res) =>
    loginMiddleware(req, res, () => {
      const { user } = req as AuthorizedReq<Roles>;
      const tokenFamily = tokenFamilies.getOrCreate(user.id);
      tokenFamily.invalidate();
      res
        .status(200)
        .clearCookie("access_token", cookieOptions)
        .clearCookie("refresh_token", cookieOptions)
        .send();
    });
};

export default signOut;
