import express from "express";
import controller from "./controller";

const router = express.Router();

router.post("/", controller.vefify);
router.get("/blocks/:address", controller.getBlocks);

export default router;
