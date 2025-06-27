// routes/userRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getAUserById,
  logoutUser,
  getSession,
  deleteUser,
  updateUser,
} from "./user.controller.js";

const router = express.Router();

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/session", getSession);

// CRUD
router.get("/", getAllUsers);
router.get("/:id", getAUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
