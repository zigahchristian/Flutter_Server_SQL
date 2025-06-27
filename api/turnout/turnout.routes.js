import express from "express";
import {
  createTurnout,
  getAllTurnouts,
  getTurnoutById,
  updateTurnoutByID,
  deleteTurnout,
} from "./turnout.controller.js";

const router = express.Router();

router.post("/", createTurnout);
router.get("/", getAllTurnouts);
router.get("/:id", getTurnoutById);
router.put("/:id", updateTurnoutByID);
router.delete("/:id", deleteTurnout);

export default router;
