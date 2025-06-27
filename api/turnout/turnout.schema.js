import { z } from "zod";

export const TurnoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  turnoutdate: z.coerce.date(), // accepts strings like '2025-06-25'
  location: z.string().optional(),
  organizer: z.string().optional(),
  status: z.string().optional(),
  attendance: z.coerce.number().optional(),
});
