import type { Request } from "@tlariviere/utils";
import { Router } from "express";
import bcrypt from "bcrypt";
import { asyncHandler } from "@tlariviere/utils";

import type {
  UserId,
  FindUserFunction,
  SendPwdRecoverEmailFunction,
  UpdatePasswordFunction,
} from "../utils/types";
import config from "../constants/token";
import { generateToken, verifyToken } from "../utils/jwt";
import urlOrigin from "../utils/urlOrigin";

/**
 * Create router for password recovery with the following routes:
 *  - POST /
 *      Look for user with given username or email.
 *      If found, sends email to reset password.
 *  - GET /verify/:userId/:token
 *      Check if token is valid and return result.
 *  - POST /update
 *      Check if token is valid and update user's password.
 * Require request body to be parsed by bodyParser.
 * @param findUser Functions to find user either by id or login (username or email).
 * @param sendPwdRecoverEmail Function to send password recovery email.
 * @param updatePassword Function to update user's password.
 * @param port Server url port.
 * @returns Express router.
 */
const pwdRecovery = <Roles extends string>(
  findUser: FindUserFunction<Roles>,
  sendPwdRecoverEmail: SendPwdRecoverEmailFunction<Roles>,
  updatePassword: UpdatePasswordFunction<Roles>,
  port: number
): Router => {
  const verifyPwdRecoverToken = async (userId: UserId, token: string) => {
    const user = await findUser.byId(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await verifyToken(token, user.hashedPassword);
    return user;
  };

  const router = Router();

  router.post(
    "/",
    asyncHandler(async (req: Request, res) => {
      const { login } = req.body;
      if (!login) {
        res.status(400).send("Missing login");
        return;
      }

      const user = await findUser.byLogin(login);
      if (!user) {
        res.status(400).send("User not found");
        return;
      }

      const token = generateToken(
        user.hashedPassword,
        config.PWD_RECOVER_TOKEN_LIFETIME,
        user.id
      ).compact();
      await sendPwdRecoverEmail(user, urlOrigin(req, port), token);
      res.sendStatus(200);
    })
  );

  router.get(
    "/verify/:userId/:token",
    asyncHandler(async (req, res) => {
      const { userId, token } = req.params;
      try {
        await verifyPwdRecoverToken(userId, token);
        res.sendStatus(200);
      } catch (err) {
        res.status(400).send((err as Error).message);
      }
    })
  );

  router.post(
    "/update",
    asyncHandler(async (req: Request, res) => {
      const { userId, token, newPassword } = req.body;
      if (!userId || !token || !newPassword) {
        res.status(400).send("Missing mandatory field");
        return;
      }

      let user;
      try {
        user = await verifyPwdRecoverToken(userId, token);
      } catch (err) {
        res.status(400).send((err as Error).message);
        return;
      }

      const hashedNewPassword = await bcrypt.hash(
        newPassword,
        config.PASSWORD_HASH_ROUNDS
      );
      await updatePassword(user, hashedNewPassword);
      res.sendStatus(200);
    })
  );

  return router;
};

export default pwdRecovery;
