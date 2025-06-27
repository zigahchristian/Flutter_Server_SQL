import express from "express";
import {
  createNewAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendanceByID,
  deleteAttendance,
} from "./attendance.controller.js";

const router = express.Router();

router.post("/", createNewAttendance);
router.get("/", getAllAttendance);
router.get("/:id", getAttendanceById);
router.put("/:id", updateAttendanceByID);
router.delete("/:id", deleteAttendance);

export default router;
