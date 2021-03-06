import express from "express";
import cookieParser from "cookie-parser";
import auth from "@tlariviere/login";

import type { Roles } from "./strategy/roles";
import { roleLevels } from "./strategy/roles";
import strategy from "./strategy";
import config from "../constants/server";
import "./initDB";
import userRouter from "./routes/user";
import adminRouter from "./routes/admin";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());

const {
  requireLogin,
  requireRole,
  router: authRouter,
} = auth<Roles>(strategy, { roleLevels, https: true, port: config.PORT });

router.use("/auth", authRouter);
router.use("/user", requireLogin, userRouter);
router.use("/admin", requireRole("admin"), adminRouter);

export default router;
