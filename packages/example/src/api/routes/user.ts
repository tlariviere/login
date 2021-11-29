import type { AuthorizedReq } from "@tlariviere/login";
import { Router } from "express";
import { asyncHandler } from "@tlariviere/utils";
import { userUnprotectedData } from "@tlariviere/login";

import type { Roles } from "../strategy/roles";
import findUser from "../strategy/findUser";

const router = Router();

router.get(
  "/info",
  asyncHandler(async (req, res) => {
    const { user: userInfo } = req as AuthorizedReq<Roles>;
    const user = await findUser.byId(userInfo.id);
    if (!user) {
      res.sendStatus(500);
    } else {
      res.json(userUnprotectedData(user));
    }
  })
);

export default router;
