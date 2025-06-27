import { z } from "zod";

export const paymentSchema = z.object({
  id: z.string().optional(), // Let Prisma generate or custom ID
  memberid: z.string().min(1, "Member ID is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  paymentdate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  paymentmethod: z.string().min(1, "Payment method is required"),
  assessmentid: z.string().optional(),
});
