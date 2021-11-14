import { Router } from "express";
import { asyncHandler } from "@tlariviere/utils";

import type { AuthStrategy, AuthOptions } from "../utils/types";
import TokenFamilies from "../TokenFamilies";
import UnverifiedUsers from "../UnverifiedUsers";
import signUp from "./signUp";
import signIn from "./signIn";
import refresh from "./refresh";
import pwdRecover from "./pwdRecover";
import signOut from "./signOut";

/**
 * Create router for sign-up, login, logout and password recovery.
 * @param strategy Auth abstraction functions.
 * @param strategy.findUser Functions to find user either by id, username or email.
 * @param strategy.createUser Function to create new user.
 * @param strategy.updatePassword Function to update user's password.
 * @param strategy.sendSignUpEmail Function to send email verification when signing up new user.
 * @param strategy.sendPwdRecoverEmail Function to send password recovery email.
 * @param options Router options.
 * @param options.roleLevels List of user roles assiociated with their level (numeric value).
 *    If a minimum role is required in order to authorize some action,
 *    any role level higher or equal will be accepted.
 * @param options.https Is https enabled (default true).
 * @returns Express router.
 */
const authRouter = <Roles extends string>(
  {
    findUser,
    createUser,
    updatePassword,
    sendSignUpEmail,
    sendPwdRecoverEmail,
  }: AuthStrategy<Roles>,
  tokenFamilies: TokenFamilies<Roles>,
  unverifiedUsers: UnverifiedUsers<Roles>,
  { roleLevels, https = true }: AuthOptions<Roles>
): Router => {
  const cookieOptions = {
    secure: https,
    httpOnly: true,
    sameSite: true,
  };

  const router = Router();
  router.use(
    "/sign-up",
    signUp(
      findUser,
      sendSignUpEmail,
      createUser,
      roleLevels,
      tokenFamilies,
      unverifiedUsers,
      cookieOptions
    )
  );
  router.post(
    "/sign-in",
    asyncHandler(signIn(findUser, tokenFamilies, cookieOptions))
  );
  router.post("/refresh", asyncHandler(refresh(tokenFamilies, cookieOptions)));
  router.use(
    "/pwd-recover",
    pwdRecover(findUser, sendPwdRecoverEmail, updatePassword)
  );
  router.post("/sign-out", asyncHandler(signOut(tokenFamilies, cookieOptions)));

  return router;
};

export default authRouter;
