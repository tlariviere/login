import { Router } from "express";
import { asyncHandler } from "@tlariviere/utils";

import type { Roles } from "../strategy/roles";
import type { User, AuthorizedReq } from "../../auth/utils/types";
import userUnprotectedData from "../../auth/utils/userUnprotectedData";
import findUser from "../strategy/findUser";

const router = Router();

router.get(
  "/info",
  asyncHandler(async (req, res) => {
    const { user: userInfo } = req as AuthorizedReq<Roles>;
    const user = await findUser.byId(userInfo.id);
    res.json(userUnprotectedData(user as User<Roles>));
  })
);

export default router;
