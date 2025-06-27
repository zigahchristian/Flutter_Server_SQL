import prisma from "../../prisma/prisma.js";
import { paymentSchema } from "./payment.schema.js";

// Create Payment
export const createNewPayment = async (req, res) => {
  try {
    const parsed = paymentSchema.parse(req.body); // Zod validation

    const payment = await prisma.payment.create({
      data: {
        memberid: parsed.memberid,
        amount: parsed.amount,
        paymentdate: new Date(parsed.paymentdate),
        paymentmethod: parsed.paymentmethod,
        assessmentid: parsed.assessmentid,
      },
    });

    res.status(201).json(payment);
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ errors: err.errors });
    }
    console.error("Create payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { paymentdate: "desc" },
    });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Fetch payments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({ where: { id } });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (err) {
    console.error("Get payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Payment
export const updatePaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const parsed = paymentSchema.parse(req.body); // partial zod schema

    const updated = await prisma.payment.update({
      where: { id },
      data: {
        ...parsed,
        paymentdate: parsed.paymentdate
          ? new Date(parsed.paymentdate)
          : undefined,
      },
    });

    res.status(200).json(updated);
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ errors: err.errors });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Payment not found" });
    }
    console.error("Update payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Payment
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.payment.delete({ where: { id } });

    res.status(200).json({
      message: "Payment deleted successfully",
      deletedPayment: deleted,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Payment not found" });
    }
    console.error("Delete payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
