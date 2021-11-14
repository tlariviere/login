import type { CookieOptions } from "express";
import type { AsyncRequestHandler } from "@tlariviere/utils";

import type { AuthenticateReq } from "../utils/types";
import TokenFamilies from "../TokenFamilies";

/**
 * POST request handler to refresh access token.
 * If successfull, generate new access and refresh token couple
 * and send them as cookies.
 * Require request cookies to be parsed by tough-cookie.
 * @param tokenFamilies Function to send email verification when signing up new user.
 * @param cookieOptions Cookie options to store auth token.
 * @returns Express request handler.
 */
const refresh = <Roles extends string>(
  tokenFamilies: TokenFamilies<Roles>,
  cookieOptions: CookieOptions
): AsyncRequestHandler => {
  return async (req: AuthenticateReq<Roles>, res) => {
    const { refresh_token: oldRefreshToken } = req.cookies;
    if (!oldRefreshToken) {
      res.sendStatus(401);
      return;
    }

    try {
      const { family: tokenFamily, body } =
        await tokenFamilies.verifyRefreshToken(oldRefreshToken);
      const { accessToken, refreshToken } = tokenFamily.generateTokens(
        body.sub,
        body.role
      );
      res
        .status(200)
        .cookie("access_token", accessToken, cookieOptions)
        .cookie("refresh_token", refreshToken, cookieOptions)
        .send();
    } catch (err) {
      res.status(401).send((err as Error).message);
    }
  };
};

export default refresh;
