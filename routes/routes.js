import { Router } from "express";
const router = Router();

import authRoutes from "../api/user/user.routes.js";
import attendanceRoutes from "../api/attendance/attendance.routes.js";
import membersRoutes from "../api/member/member.routes.js";
import paymentRoutes from "../api/payment/payment.routes.js";
import turnoutRoutes from "../api/turnout/turnout.routes.js";

router.get("/", (req, res) => {
  return res.status(200).json({ message: "Landed Well !" });
});

//Users Routes
router.use("/api/auth", authRoutes);
router.use("/api/member", membersRoutes);
router.use("/api/atendance", attendanceRoutes);
router.use("/api/payment", paymentRoutes);
router.use("/api/turnout", turnoutRoutes);

export default router;
