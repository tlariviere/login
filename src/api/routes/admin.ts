import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Require admin permission");
});

export default router;
