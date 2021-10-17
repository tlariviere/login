import express from "express";
import cookieParser from "cookie-parser";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());

export default router;
