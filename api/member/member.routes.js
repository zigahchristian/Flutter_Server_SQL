import express from "express";
import {
  createNewMember,
  getAllMembers,
  getAMemberById,
  updateMemberByID,
  deleteMember,
} from "./member.controller.js";

import { validateWithZod } from "../../middlewares/zodValidator.js";
import { memberSchema } from "./member.schema.js";

const router = express.Router();

router.post("/", validateWithZod(memberSchema), createNewMember);
router.get("/", getAllMembers);
router.get("/:id", getAMemberById);
router.patch("/:id", validateWithZod(memberSchema.partial()), updateMemberByID); // .partial() for optional update fields
router.delete("/:id", deleteMember);

export default router;
