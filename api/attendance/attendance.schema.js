import { z } from "zod";
export const attendanceSchema = z.object({
  memberid: z.string().min(1),
  date: z.coerce.date(),
  turnout: z.boolean(),
  participation: z.number().int().nonnegative(),
  remarks: z.string().optional(),
});
