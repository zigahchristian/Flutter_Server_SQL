import express from "express";
import {
  createNewPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentById,
  deletePayment,
} from "./payment.controller.js";

const router = express.Router();

// Create a payment
router.post("/", createNewPayment);

// Get all payments
router.get("/", getAllPayments);

// Get a specific payment by ID
router.get("/:id", getPaymentById);

// Update a payment by ID
router.put("/:id", updatePaymentById);

// Delete a payment by ID
router.delete("/:id", deletePayment);

export default router;
