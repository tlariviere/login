import express from "express";
import cookieParser from "cookie-parser";

import type { Roles } from "./strategy/roles";
import { roleLevels } from "./strategy/roles";
import strategy from "./strategy";
import auth from "../auth";
import "./initDB";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());

const {
  requireLogin,
  requireRole,
  router: authRouter,
} = auth<Roles>(strategy, { roleLevels, https: false });

export default router;
